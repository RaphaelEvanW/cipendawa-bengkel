package reservation

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func validRequest() CreateReservationRequest {
	return CreateReservationRequest{ServiceCode: "service", BranchCode: "utama", ReservationDate: "2026-10-24", PreferredPeriod: "sore", CustomerName: "Evan", CustomerPhone: "081234567890"}
}
func fixedNow() time.Time { return time.Date(2026, 10, 24, 5, 0, 0, 0, time.UTC) }
func TestNormalizeValidation(t *testing.T) {
	req, fields := normalizeRequest(validRequest(), fixedNow())
	if len(fields) != 0 || req.CustomerPhone != "6281234567890" {
		t.Fatalf("normalization: %+v %+v", req, fields)
	}
	cases := []struct {
		name, field string
		change      func(*CreateReservationRequest)
	}{
		{"required", "customer_name", func(r *CreateReservationRequest) { r.CustomerName = " " }},
		{"short name", "customer_name", func(r *CreateReservationRequest) { r.CustomerName = "A" }},
		{"long name", "customer_name", func(r *CreateReservationRequest) { r.CustomerName = strings.Repeat("名", 101) }},
		{"vehicle", "customer_vehicle", func(r *CreateReservationRequest) { r.CustomerVehicle = strings.Repeat("x", 121) }},
		{"notes", "notes", func(r *CreateReservationRequest) { r.Notes = strings.Repeat("x", 1001) }},
		{"email", "customer_email", func(r *CreateReservationRequest) { r.CustomerEmail = "Name <a@example.com>" }},
		{"long email", "customer_email", func(r *CreateReservationRequest) { r.CustomerEmail = strings.Repeat("x", 250) + "@e.com" }},
		{"phone", "customer_phone", func(r *CreateReservationRequest) { r.CustomerPhone = "123" }},
		{"service", "service_code", func(r *CreateReservationRequest) { r.ServiceCode = "other" }},
		{"branch", "branch_code", func(r *CreateReservationRequest) { r.BranchCode = "other" }},
		{"date", "reservation_date", func(r *CreateReservationRequest) { r.ReservationDate = "2026-02-30" }},
		{"past", "reservation_date", func(r *CreateReservationRequest) { r.ReservationDate = "2026-10-23" }},
		{"Sunday", "reservation_date", func(r *CreateReservationRequest) { r.ReservationDate = "2026-10-25" }},
		{"period", "preferred_period", func(r *CreateReservationRequest) { r.PreferredPeriod = "other" }},
		{"elapsed", "preferred_period", func(r *CreateReservationRequest) { r.PreferredPeriod = "pagi" }},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			r := validRequest()
			tc.change(&r)
			_, fields := normalizeRequest(r, fixedNow())
			if fields[tc.field] == "" {
				t.Fatalf("missing %s: %+v", tc.field, fields)
			}
		})
	}
	for _, branch := range []string{"utama", "cianjur2", "sukabumi"} {
		for _, code := range []string{"body_repair", "service", "sparepart"} {
			r := validRequest()
			r.BranchCode = branch
			r.ServiceCode = code
			if _, f := normalizeRequest(r, fixedNow()); len(f) > 0 {
				t.Fatal(f)
			}
		}
	}
}
func TestPeriodBoundariesJakarta(t *testing.T) {
	for _, tc := range []struct {
		period string
		hour   int
	}{{"pagi", 11}, {"siang", 14}, {"sore", 17}} {
		r := validRequest()
		r.PreferredPeriod = tc.period
		now := time.Date(2026, 10, 24, tc.hour-7, 0, 0, 0, time.UTC)
		if _, f := normalizeRequest(r, now.Add(-time.Second)); len(f) > 0 {
			t.Fatal(f)
		}
		if _, f := normalizeRequest(r, now); f["preferred_period"] == "" {
			t.Fatal("ended period accepted")
		}
	}
}
func TestCreateHTTP(t *testing.T) {
	gin.SetMode(gin.TestMode)
	for _, tc := range []struct {
		name, body, key string
		code            int
	}{{"validation", `{}`, "a7e988e8-63cd-43ea-9ca5-c59259200af6", 422}, {"key", `{}`, "invalid", 422}, {"malformed", `{`, "", 400}, {"null", `null`, "", 400}, {"unknown", `{"surprise":true}`, "", 400}, {"trailing", `{} {}`, "", 400}, {"large", strings.Repeat(" ", 16385), "", 400}} {
		t.Run(tc.name, func(t *testing.T) {
			router := gin.New()
			router.POST("/", NewHandler(NewService(nil, nil, nil)).Create)
			r := httptest.NewRequest("POST", "/", strings.NewReader(tc.body))
			r.Header.Set("Idempotency-Key", tc.key)
			w := httptest.NewRecorder()
			router.ServeHTTP(w, r)
			if w.Code != tc.code {
				t.Fatalf("got %d %s", w.Code, w.Body.String())
			}
		})
	}
}

type memoryStore struct {
	record       *Reservation
	notification NotificationReceipt
	failure      error
}

func (m *memoryStore) Save(r *Reservation, n NotificationReceipt) (*Reservation, NotificationReceipt, bool, error) {
	if m.failure != nil {
		return nil, n, false, m.failure
	}
	if m.record != nil {
		if m.record.RequestHash != r.RequestHash {
			return nil, n, false, ErrIdempotencyConflict
		}
		return m.record, m.notification, true, nil
	}
	m.record = r
	m.notification = n
	return r, n, false, nil
}
func TestIdempotencyAndStorageFailure(t *testing.T) {
	store := &memoryStore{}
	s := NewService(nil, nil, nil)
	s.store = store
	s.now = fixedNow
	key := "a7e988e8-63cd-43ea-9ca5-c59259200af6"
	first, replay, err := s.CreateWithKey(validRequest(), key)
	if err != nil || replay {
		t.Fatal(err)
	}
	r := validRequest()
	r.CustomerPhone = "+62 812-3456-7890"
	second, replay, err := s.CreateWithKey(r, key)
	if err != nil || !replay || *first != *second {
		t.Fatalf("replay: %+v %v", second, err)
	}
	r.Notes = "different"
	if _, _, err = s.CreateWithKey(r, key); !errors.Is(err, ErrIdempotencyConflict) {
		t.Fatal(err)
	}
	store.failure = errors.New("database password secret")
	if _, _, err = s.CreateWithKey(validRequest(), key); !errors.Is(err, ErrStorage) {
		t.Fatal(err)
	}
}
func TestReplayAfterPeriodEnds(t *testing.T) {
	store := &memoryStore{}
	s := NewService(nil, nil, nil)
	s.store = store
	s.now = fixedNow
	key := "a7e988e8-63cd-43ea-9ca5-c59259200af6"
	if _, _, err := s.CreateWithKey(validRequest(), key); err != nil {
		t.Fatal(err)
	}
	s.now = func() time.Time { return fixedNow().Add(72 * time.Hour) }
	if _, replay, err := s.CreateWithKey(validRequest(), key); err != nil || !replay {
		t.Fatalf("saved replay must survive date validation: %v", err)
	}
}
func (m *memoryStore) Lookup(key, hash string) (*Receipt, error) {
	if m.failure != nil {
		return nil, m.failure
	}
	if m.record == nil {
		return nil, nil
	}
	if m.record.RequestHash != hash {
		return nil, ErrIdempotencyConflict
	}
	return &Receipt{BookingCode: m.record.BookingCode, Status: m.record.Status, Notification: m.notification}, nil
}
func TestCreateHTTPReceiptsAndFailures(t *testing.T) {
	gin.SetMode(gin.TestMode)
	store := &memoryStore{}
	s := NewService(nil, nil, nil)
	s.store = store
	s.now = fixedNow
	router := gin.New()
	router.POST("/", NewHandler(s).Create)
	request := validRequest()
	key := "a7e988e8-63cd-43ea-9ca5-c59259200af6"
	send := func(want int) {
		t.Helper()
		body, _ := json.Marshal(request)
		r := httptest.NewRequest("POST", "/", strings.NewReader(string(body)))
		r.Header.Set("Idempotency-Key", key)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, r)
		if w.Code != want {
			t.Fatalf("want %d got %d: %s", want, w.Code, w.Body.String())
		}
		if strings.Contains(w.Body.String(), "secret") {
			t.Fatal("raw storage error exposed")
		}
		if want == 201 || want == 200 {
			var response struct {
				Success bool
				Data    Receipt
			}
			if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
				t.Fatal(err)
			}
			if !response.Success || response.Data.BookingCode == "" || response.Data.Status != "pending" || response.Data.Notification.Mode != "mock" || response.Data.Notification.Status != "simulated" {
				t.Fatal(w.Body.String())
			}
		}
	}
	send(201)
	send(200)
	request.Notes = "different"
	send(409)
	store.failure = errors.New("secret database failure")
	send(503)
}
