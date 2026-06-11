package schedule

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"

	"bengkel-backend/config"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Service struct {
	repo *Repository
	cfg  *config.Config
}

func NewService(repo *Repository, cfg *config.Config) *Service {
	return &Service{repo: repo, cfg: cfg}
}

func (s *Service) GetConfig() (*ShopConfig, error) {
	return s.repo.GetConfig()
}

func (s *Service) UpdateConfig(req UpdateConfigRequest) (*ShopConfig, error) {
	if len(req.OpenDays) == 0 {
		return nil, errors.New("minimal satu hari operasional harus dipilih")
	}
	for _, day := range req.OpenDays {
		if day < 0 || day > 6 {
			return nil, errors.New("hari operasional tidak valid, gunakan 0 (Minggu) sampai 6 (Sabtu)")
		}
	}
	open, err := time.Parse("15:04", req.OpenTime)
	if err != nil {
		return nil, errors.New("format jam buka tidak valid, gunakan HH:MM")
	}
	close, err := time.Parse("15:04", req.CloseTime)
	if err != nil {
		return nil, errors.New("format jam tutup tidak valid, gunakan HH:MM")
	}
	if !close.After(open) {
		return nil, errors.New("jam tutup harus setelah jam buka")
	}
	if req.MaxBookingsPerDay <= 0 {
		return nil, errors.New("max booking per hari harus lebih dari 0")
	}

	config, err := s.repo.GetConfig()
	if err != nil {
		return nil, err
	}
	config.OpenDays = req.OpenDays
	config.OpenTime = req.OpenTime
	config.CloseTime = req.CloseTime
	config.MaxBookingsPerDay = req.MaxBookingsPerDay
	config.UpdatedAt = time.Now()

	err = s.repo.UpdateConfig(config)
	return config, err
}

func (s *Service) GetClosures() ([]ShopClosure, error) {
	return s.repo.GetClosures()
}

func (s *Service) CreateClosure(req CreateClosureRequest) (*ShopClosure, error) {
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, errors.New("format tanggal tidak valid, gunakan YYYY-MM-DD")
	}
	if date.Before(time.Now().Truncate(24 * time.Hour)) {
		return nil, errors.New("tanggal tidak boleh di masa lalu")
	}

	closure := &ShopClosure{
		ID:       uuid.New().String(),
		Date:     req.Date,
		IsClosed: req.IsClosed,
		Note:     req.Note,
	}
	err = s.repo.CreateClosure(closure)
	return closure, err
}

func (s *Service) CreateClosureBulk(req CreateClosureBulkRequest) ([]ShopClosure, error) {
	today := time.Now().Truncate(24 * time.Hour)
	var closures []ShopClosure
	for _, dateStr := range req.Dates {
		date, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			return nil, fmt.Errorf("format tanggal tidak valid: %s", dateStr)
		}
		if date.Before(today) {
			return nil, fmt.Errorf("tanggal %s tidak boleh di masa lalu", dateStr)
		}
		closures = append(closures, ShopClosure{
			ID:       uuid.New().String(),
			Date:     dateStr,
			IsClosed: req.IsClosed,
			Note:     req.Note,
		})
	}
	err := s.repo.CreateClosureBulk(closures)
	return closures, err
}

func (s *Service) CreateClosureRange(req CreateClosureRangeRequest) error {
	today := time.Now().Truncate(24 * time.Hour)
	from, err := time.Parse("2006-01-02", req.DateFrom)
	if err != nil {
		return errors.New("format tanggal awal tidak valid")
	}
	if from.Before(today) {
		return errors.New("tanggal awal tidak boleh di masa lalu")
	}
	return s.repo.CreateClosureRange(req.DateFrom, req.DateTo, req.Note, req.IsClosed)
}

func (s *Service) UpdateClosure(id string, req UpdateClosureRequest) (*ShopClosure, error) {
	closure, err := s.repo.GetClosureByDate("")
	if err != nil {
		// cari by id
		var c ShopClosure
		if dbErr := s.repo.db.Where("id = ?", id).First(&c).Error; dbErr != nil {
			if errors.Is(dbErr, gorm.ErrRecordNotFound) {
				return nil, errors.New("closure tidak ditemukan")
			}
			return nil, dbErr
		}
		closure = &c
	}

	closure.IsClosed = req.IsClosed
	closure.Note = req.Note
	if req.IsOverridden {
		closure.IsOverridden = true
	}

	err = s.repo.UpdateClosure(closure)
	return closure, err
}

func (s *Service) DeleteClosure(id string) error {
	return s.repo.DeleteClosure(id)
}

func (s *Service) CheckAvailability(req CheckAvailabilityRequest) (*AvailabilityResponse, error) {
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return nil, errors.New("format tanggal tidak valid")
	}
	if date.Before(time.Now().Truncate(24 * time.Hour)) {
		return &AvailabilityResponse{Available: false, Reason: "tanggal sudah lewat"}, nil
	}

	config, err := s.repo.GetConfig()
	if err != nil {
		return nil, err
	}

	// cek hari operasional
	dayOfWeek := int(date.Weekday())
	isOpenDay := false
	for _, d := range config.OpenDays {
		if d == dayOfWeek {
			isOpenDay = true
			break
		}
	}
	if !isOpenDay {
		return &AvailabilityResponse{Available: false, Reason: "bengkel tidak beroperasi di hari ini"}, nil
	}

	// cek jam operasional
	reqTime, _ := time.Parse("15:04:05", req.Time+":00")
	if err != nil {
		return nil, errors.New("format jam tidak valid, gunakan HH:MM")
	}
	openTime, _ := time.Parse("15:04:05", config.OpenTime)
	closeTime, _ := time.Parse("15:04:05", config.CloseTime)

	if reqTime.Before(openTime) || reqTime.After(closeTime) {
		return &AvailabilityResponse{
			Available: false,
			Reason:    fmt.Sprintf("jam operasional bengkel %s - %s", config.OpenTime, config.CloseTime),
		}, nil
	}

	// cek closure
	closure, err := s.repo.GetClosureByDate(req.Date)
	if err == nil && closure.IsClosed {
		reason := "bengkel tutup di tanggal ini"
		if closure.Note != "" {
			reason = closure.Note
		}
		return &AvailabilityResponse{Available: false, Reason: reason}, nil
	}

	// cek kapasitas
	count, err := s.repo.CountBookingsByDate(req.Date)
	if err != nil {
		return nil, err
	}

	return &AvailabilityResponse{
		Available:       count < int64(config.MaxBookingsPerDay),
		CurrentBookings: int(count),
		MaxBookings:     config.MaxBookingsPerDay,
		Reason: func() string {
			if count >= int64(config.MaxBookingsPerDay) {
				return "kapasitas harian sudah penuh"
			}
			return ""
		}(),
	}, nil
}

type nationalHolidayAPI struct {
	Date      string `json:"date"`
	LocalName string `json:"localName"`
	Name      string `json:"name"`
}

func (s *Service) SyncNationalHolidays(year int) error {
	url := fmt.Sprintf("https://date.nager.at/api/v3/PublicHolidays/%d/ID", year)
	resp, err := http.Get(url)
	if err != nil {
		return errors.New("gagal fetch libur nasional")
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var holidays []nationalHolidayAPI
	if err := json.Unmarshal(body, &holidays); err != nil {
		return err
	}

	var closures []ShopClosure
	for _, h := range holidays {
		closures = append(closures, ShopClosure{
			IsNationalHoliday: true,
			IsClosed:          true,
			Date:              h.Date,
			Note:              h.LocalName,
		})
	}

	return s.repo.SyncNationalHolidays(closures)
}
