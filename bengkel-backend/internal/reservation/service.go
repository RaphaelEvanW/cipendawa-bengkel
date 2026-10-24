package reservation

import (
	"errors"
	"fmt"

	"strings"
	"time"

	"bengkel-backend/config"
	"bengkel-backend/internal/schedule"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Service struct {
	store        reservationStore
	now          func() time.Time
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
	receipt, _, err := s.CreateWithKey(req, uuid.NewString())
	if err != nil {
		return nil, err
	}
	return s.repo.FindByBookingCode(receipt.BookingCode)
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
