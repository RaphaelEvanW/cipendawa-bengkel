package reservation

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"bengkel-backend/config"
	"bengkel-backend/internal/schedule"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Service struct {
	repo         *Repository
	scheduleRepo *schedule.Repository
	cfg          *config.Config
}

func NewService(repo *Repository, scheduleRepo *schedule.Repository, cfg *config.Config) *Service {
	return &Service{repo: repo, scheduleRepo: scheduleRepo, cfg: cfg}
}

func (s *Service) generateBookingCode() string {
	date := time.Now().Format("060102")
	shortID := strings.ToUpper(uuid.New().String()[:4])
	return fmt.Sprintf("CPD%s%s", date, shortID)
}

func (s *Service) Create(req CreateReservationRequest) (*Reservation, error) {
	// validasi tanggal
	resDate, err := time.Parse("2006-01-02", req.ReservationDate)
	if err != nil {
		return nil, errors.New("format tanggal tidak valid, gunakan YYYY-MM-DD")
	}
	if resDate.Before(time.Now().Truncate(24 * time.Hour)) {
		return nil, errors.New("tanggal reservasi tidak boleh di masa lalu")
	}

	// validasi jam
	_, err = time.Parse("15:04", req.ReservationTime)
	if err != nil {
		return nil, errors.New("format jam tidak valid, gunakan HH:MM")
	}

	// cek availability via schedule
	config, err := s.scheduleRepo.GetConfig()
	if err != nil {
		return nil, errors.New("gagal ambil config bengkel")
	}

	// cek hari operasional
	dayOfWeek := int(resDate.Weekday())
	isOpenDay := false
	for _, d := range config.OpenDays {
		if d == dayOfWeek {
			isOpenDay = true
			break
		}
	}
	if !isOpenDay {
		return nil, errors.New("bengkel tidak beroperasi di hari tersebut")
	}

	// cek closure
	closure, err := s.scheduleRepo.GetClosureByDate(req.ReservationDate)
	if err == nil && closure.IsClosed {
		reason := "bengkel tutup di tanggal tersebut"
		if closure.Note != "" {
			reason = closure.Note
		}
		return nil, errors.New(reason)
	}

	// cek kapasitas — warning kalau penuh tapi tetap boleh submit
	count, _ := s.scheduleRepo.CountBookingsByDate(req.ReservationDate)
	isOverCapacity := count >= int64(config.MaxBookingsPerDay)

	// validasi reschedule kalau bersedia
	if req.RescheduleWilling {
		if req.RescheduleDateFrom == "" || req.RescheduleDateTo == "" {
			return nil, errors.New("tanggal reschedule harus diisi jika bersedia reschedule")
		}
		if req.RescheduleTimeFrom == "" || req.RescheduleTimeTo == "" {
			return nil, errors.New("jam reschedule harus diisi jika bersedia reschedule")
		}
		dateFrom, err := time.Parse("2006-01-02", req.RescheduleDateFrom)
		if err != nil {
			return nil, errors.New("format tanggal reschedule tidak valid")
		}
		dateTo, err := time.Parse("2006-01-02", req.RescheduleDateTo)
		if err != nil {
			return nil, errors.New("format tanggal reschedule tidak valid")
		}
		if dateFrom.Before(time.Now().Truncate(24 * time.Hour)) {
			return nil, errors.New("tanggal reschedule tidak boleh di masa lalu")
		}
		if dateTo.Before(dateFrom) {
			return nil, errors.New("tanggal akhir reschedule tidak boleh sebelum tanggal awal")
		}
	}

	reservation := &Reservation{
		ID:                 uuid.New().String(),
		BookingCode:        s.generateBookingCode(),
		ServiceID:          req.ServiceID,
		ReservationDate:    req.ReservationDate,
		ReservationTime:    req.ReservationTime,
		CustomerName:       req.CustomerName,
		CustomerPhone:      req.CustomerPhone,
		CustomerVehicle:    req.CustomerVehicle,
		Notes:              req.Notes,
		RescheduleWilling:  req.RescheduleWilling,
		RescheduleDateFrom: req.RescheduleDateFrom,
		RescheduleDateTo:   req.RescheduleDateTo,
		RescheduleTimeFrom: req.RescheduleTimeFrom,
		RescheduleTimeTo:   req.RescheduleTimeTo,
		Status:             "pending",
	}

	if err := s.repo.Create(reservation); err != nil {
		return nil, errors.New("gagal membuat reservasi")
	}

	// trigger notif ke n8n (non-blocking)
	go s.triggerN8N(reservation, isOverCapacity)

	return reservation, nil
}

func (s *Service) triggerN8N(reservation *Reservation, isOverCapacity bool) {
	n8nURL := "http://localhost:5678/webhook/reservasi-baru"
	payload := map[string]interface{}{
		"booking_code":         reservation.BookingCode,
		"customer_name":        reservation.CustomerName,
		"customer_phone":       reservation.CustomerPhone,
		"customer_vehicle":     reservation.CustomerVehicle,
		"service_id":           reservation.ServiceID,
		"reservation_date":     reservation.ReservationDate,
		"reservation_time":     reservation.ReservationTime,
		"notes":                reservation.Notes,
		"reschedule_willing":   reservation.RescheduleWilling,
		"reschedule_date_from": reservation.RescheduleDateFrom,
		"reschedule_date_to":   reservation.RescheduleDateTo,
		"reschedule_time_from": reservation.RescheduleTimeFrom,
		"reschedule_time_to":   reservation.RescheduleTimeTo,
		"is_over_capacity":     isOverCapacity,
	}
	body, _ := json.Marshal(payload)
	http.Post(n8nURL, "application/json", bytes.NewBuffer(body))
}

func (s *Service) GetAll(status, date string) ([]Reservation, error) {
	return s.repo.FindWithFilter(status, date)
}

func (s *Service) GetByID(id string) (*Reservation, error) {
	reservation, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("reservasi tidak ditemukan")
	}
	return reservation, err
}

func (s *Service) CheckStatus(req CheckStatusRequest) (interface{}, error) {
	if req.BookingCode != "" {
		reservation, err := s.repo.FindByBookingCode(req.BookingCode)
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("reservasi tidak ditemukan")
		}
		return reservation, err
	}
	if req.CustomerPhone != "" {
		reservations, err := s.repo.FindByPhone(req.CustomerPhone)
		if err != nil {
			return nil, err
		}
		return reservations, nil
	}
	return nil, errors.New("booking code atau nomor HP harus diisi")
}

func (s *Service) UpdateStatus(id, adminID string, req UpdateStatusRequest) error {
	validStatuses := map[string]bool{
		"pending": true, "confirmed": true, "in_progress": true,
		"done": true, "rejected": true, "cancelled": true,
	}
	if !validStatuses[req.Status] {
		return errors.New("status tidak valid")
	}

	reservation, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New("reservasi tidak ditemukan")
	}
	if err != nil {
		return err
	}

	oldStatus := reservation.Status
	if err := s.repo.UpdateStatus(id, req.Status); err != nil {
		return errors.New("gagal update status")
	}

	// buat log
	log := &ReservationLog{
		ID:            uuid.New().String(),
		ReservationID: id,
		AdminID:       adminID,
		OldStatus:     oldStatus,
		NewStatus:     req.Status,
		Note:          req.Note,
		ChangedAt:     time.Now(),
	}
	s.repo.CreateLog(log)

	return nil
}

func (s *Service) Delete(id string) error {
	_, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New("reservasi tidak ditemukan")
	}
	return s.repo.Delete(id)
}

func (s *Service) GetLogs(reservationID string) ([]ReservationLog, error) {
	return s.repo.FindLogs(reservationID)
}
