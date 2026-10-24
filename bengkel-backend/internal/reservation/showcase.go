package reservation

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/mail"
	"regexp"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/google/uuid"
)

var ErrIdempotencyConflict = errors.New("idempotency key already used")
var ErrStorage = errors.New("reservation storage unavailable")

type ValidationError map[string]string

func (e ValidationError) Error() string { return "Input reservasi tidak valid" }

type NotificationReceipt struct {
	Mode    string `json:"mode"`
	Status  string `json:"status"`
	Message string `json:"message"`
}
type Receipt struct {
	BookingCode  string              `json:"booking_code"`
	Status       string              `json:"status"`
	Notification NotificationReceipt `json:"notification"`
}
type reservationStore interface {
	Lookup(string, string) (*Receipt, error)
	Save(*Reservation, NotificationReceipt) (*Reservation, NotificationReceipt, bool, error)
}

var serviceIDs = map[string]string{"body_repair": "c1e00000-0000-4000-8000-000000000001", "service": "c1e00000-0000-4000-8000-000000000002", "sparepart": "c1e00000-0000-4000-8000-000000000003"}
var periods = map[string]struct{ start, end int }{"pagi": {8, 11}, "siang": {11, 14}, "sore": {14, 17}}
var jakarta = time.FixedZone("Asia/Jakarta", 7*60*60)
var phonePattern = regexp.MustCompile(`^628[0-9]{8,11}$`)

func normalizeRequest(req CreateReservationRequest, now time.Time) (CreateReservationRequest, ValidationError) {
	req.ServiceCode = strings.TrimSpace(req.ServiceCode)
	req.BranchCode = strings.TrimSpace(req.BranchCode)
	req.ReservationDate = strings.TrimSpace(req.ReservationDate)
	req.PreferredPeriod = strings.TrimSpace(req.PreferredPeriod)
	req.CustomerName = strings.TrimSpace(req.CustomerName)
	req.CustomerEmail = strings.TrimSpace(req.CustomerEmail)
	req.CustomerVehicle = strings.TrimSpace(req.CustomerVehicle)
	req.Notes = strings.TrimSpace(req.Notes)
	phone := strings.TrimSpace(req.CustomerPhone)
	phone = strings.NewReplacer(" ", "", "-", "", "(", "", ")", "").Replace(phone)
	phone = strings.TrimPrefix(phone, "+")
	if strings.HasPrefix(phone, "0") {
		phone = "62" + phone[1:]
	} else if strings.HasPrefix(phone, "8") {
		phone = "62" + phone
	}
	req.CustomerPhone = phone
	fields := ValidationError{}
	if _, ok := serviceIDs[req.ServiceCode]; !ok {
		fields["service_code"] = "Pilih layanan yang tersedia"
	}
	if req.BranchCode != "utama" && req.BranchCode != "cianjur2" && req.BranchCode != "sukabumi" {
		fields["branch_code"] = "Pilih cabang yang tersedia"
	}
	if n := utf8.RuneCountInString(req.CustomerName); n < 2 || n > 100 {
		fields["customer_name"] = "Nama harus 2–100 karakter"
	}
	if !phonePattern.MatchString(phone) {
		fields["customer_phone"] = "Masukkan nomor HP Indonesia yang valid"
	}
	if utf8.RuneCountInString(req.CustomerVehicle) > 120 {
		fields["customer_vehicle"] = "Kendaraan maksimal 120 karakter"
	}
	if utf8.RuneCountInString(req.Notes) > 1000 {
		fields["notes"] = "Catatan maksimal 1000 karakter"
	}
	if req.CustomerEmail != "" {
		address, err := mail.ParseAddress(req.CustomerEmail)
		if len(req.CustomerEmail) > 254 || err != nil || address.Address != req.CustomerEmail {
			fields["customer_email"] = "Masukkan alamat email yang valid"
		}
	}
	period, ok := periods[req.PreferredPeriod]
	if !ok {
		fields["preferred_period"] = "Pilih waktu kunjungan"
	}
	now = now.In(jakarta)
	date, err := time.ParseInLocation("2006-01-02", req.ReservationDate, jakarta)
	if err != nil || date.Format("2006-01-02") != req.ReservationDate {
		fields["reservation_date"] = "Gunakan tanggal YYYY-MM-DD"
	} else if date.Before(time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, jakarta)) {
		fields["reservation_date"] = "Tanggal tidak boleh di masa lalu"
	} else if date.Weekday() == time.Sunday {
		fields["reservation_date"] = "Bengkel tutup pada hari Minggu"
	} else if ok && date.Format("2006-01-02") == now.Format("2006-01-02") && now.Hour() >= period.end {
		fields["preferred_period"] = "Waktu kunjungan sudah berakhir; pilih waktu lain"
	}
	return req, fields
}
func (s *Service) CreateWithKey(req CreateReservationRequest, key string) (*Receipt, bool, error) {
	parsed, err := uuid.Parse(key)
	if err != nil || len(key) != 36 {
		return nil, false, ValidationError{"idempotency_key": "Idempotency-Key harus UUID"}
	}
	key = parsed.String()
	now := time.Now()
	if s.now != nil {
		now = s.now()
	}
	req, fields := normalizeRequest(req, now)

	payload, _ := json.Marshal(struct{ Service, Branch, Date, Period, Name, Phone, Email, Vehicle, Notes string }{req.ServiceCode, req.BranchCode, req.ReservationDate, req.PreferredPeriod, req.CustomerName, req.CustomerPhone, req.CustomerEmail, req.CustomerVehicle, req.Notes})
	hash := sha256.Sum256(payload)
	store := s.store
	if store == nil {
		store = s.repo
	}
	if s.repo == nil && s.store == nil {
		if len(fields) > 0 {
			return nil, false, fields
		}
		return nil, false, ErrStorage
	}
	previous, lookupErr := store.Lookup(key, hex.EncodeToString(hash[:]))
	if errors.Is(lookupErr, ErrIdempotencyConflict) {
		return nil, false, lookupErr
	}
	if lookupErr != nil {
		if len(fields) > 0 {
			return nil, false, fields
		}
		return nil, false, ErrStorage
	}
	if previous != nil {
		return previous, true, nil
	}
	if len(fields) > 0 {
		return nil, false, fields
	}
	r := &Reservation{ID: uuid.NewString(), BookingCode: fmt.Sprintf("CPD%s%s", now.In(jakarta).Format("060102"), strings.ToUpper(strings.ReplaceAll(uuid.NewString(), "-", ""))), ServiceID: serviceIDs[req.ServiceCode], ServiceCode: req.ServiceCode, BranchCode: req.BranchCode, ReservationDate: req.ReservationDate, ReservationTime: fmt.Sprintf("%02d:00", periods[req.PreferredPeriod].start), PreferredPeriod: req.PreferredPeriod, CustomerName: req.CustomerName, CustomerPhone: req.CustomerPhone, CustomerEmail: req.CustomerEmail, CustomerVehicle: req.CustomerVehicle, Notes: req.Notes, Status: "pending", IdempotencyKey: key, RequestHash: hex.EncodeToString(hash[:])}
	serviceNames := map[string]string{"body_repair": "Body Repair", "service": "Service", "sparepart": "Sparepart & Variasi"}
	branchNames := map[string]string{"utama": "Cipendawa Utama", "cianjur2": "Cipendawa Cianjur 2", "sukabumi": "Cipendawa Sukabumi"}
	message := fmt.Sprintf("Simulasi WhatsApp — reservasi %s\nNama: %s\nHP: %s\nLayanan: %s\nCabang tujuan: %s\nTanggal: %s\nPreferensi waktu: %s (%02d.00–%02d.00 WIB)\nKendaraan: %s\nEmail: %s\nCatatan: %s\nReservasi tersimpan dan menunggu konfirmasi bengkel. Pesan simulasi ini tidak dikirim ke WhatsApp.", r.BookingCode, r.CustomerName, r.CustomerPhone, serviceNames[r.ServiceCode], branchNames[r.BranchCode], r.ReservationDate, r.PreferredPeriod, periods[r.PreferredPeriod].start, periods[r.PreferredPeriod].end, r.CustomerVehicle, r.CustomerEmail, r.Notes)
	n := NotificationReceipt{Mode: "mock", Status: "simulated", Message: message}
	saved, notification, replay, err := store.Save(r, n)
	if errors.Is(err, ErrIdempotencyConflict) {
		return nil, false, err
	}
	if err != nil {
		return nil, false, ErrStorage
	}
	return &Receipt{BookingCode: saved.BookingCode, Status: saved.Status, Notification: notification}, replay, nil
}
