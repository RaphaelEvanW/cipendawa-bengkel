package schedule

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAvailable(date string) ([]ScheduleSlot, error) {
	if date == "" {
		return nil, errors.New("tanggal harus diisi")
	}
	return s.repo.FindAvailable(date)
}

func (s *Service) GetAll() ([]ScheduleSlot, error) {
	return s.repo.FindAll()
}

func (s *Service) GetByID(id string) (*ScheduleSlot, error) {
	slot, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("slot tidak ditemukan")
	}
	return slot, err
}

func (s *Service) Create(req CreateSlotRequest) (*ScheduleSlot, error) {
	// validasi waktu biar ga bisa buat kemarin / masa lalu
	slotDate, err := time.Parse("2006-01-02", req.SlotDate)
	if err != nil {
		return nil, errors.New("format tanggal tidak valid, gunakan YYYY-MM-DD")
	}

	today := time.Now().Truncate(24 * time.Hour)
	if slotDate.Before(today) {
		return nil, errors.New("tanggal slot tidak boleh di masa lalu")
	}

	slot := &ScheduleSlot{
		ID:          uuid.New().String(),
		SlotDate:    req.SlotDate,
		SlotTime:    req.SlotTime,
		MaxBookings: req.MaxBookings,
		IsOpen:      true,
	}
	err = s.repo.Create(slot)
	return slot, err
}

func (s *Service) Update(id string, req UpdateSlotRequest) (*ScheduleSlot, error) {
	slot, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("slot tidak ditemukan")
	}
	if err != nil {
		return nil, err
	}

	slot.IsOpen = req.IsOpen
	if req.MaxBookings > 0 {
		slot.MaxBookings = req.MaxBookings
	}

	err = s.repo.Update(slot)
	return slot, err
}

func (s *Service) Delete(id string) error {
	_, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New("slot tidak ditemukan")
	}
	return s.repo.Delete(id)
}
