package notification

import (
	"bytes"
	"encoding/json"
	"errors"
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

func (s *Service) Send(reservationID string, payload NotificationPayload) error {
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	notif := &Notification{
		ID:            uuid.New().String(),
		ReservationID: reservationID,
		Channel:       "whatsapp",
		Status:        "pending",
		Payload:       string(payloadBytes),
	}

	if err := s.repo.Create(notif); err != nil {
		return err
	}

	// kirim ke n8n
	n8nURL := "http://localhost:5678/webhook/reservasi-baru"
	resp, err := http.Post(n8nURL, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil || resp.StatusCode >= 400 {
		s.repo.UpdateStatus(notif.ID, "failed")
		return nil // non-blocking, ga return error biar reservasi tetap sukses
	}
	defer resp.Body.Close()

	s.repo.UpdateStatus(notif.ID, "sent")
	return nil
}

func (s *Service) GetAll() ([]Notification, error) {
	return s.repo.FindAll()
}

func (s *Service) GetByReservationID(reservationID string) ([]Notification, error) {
	return s.repo.FindByReservationID(reservationID)
}

func (s *Service) Retry(id string) error {
	notif, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New("notifikasi tidak ditemukan")
	}
	if err != nil {
		return err
	}
	if notif.Status != "failed" {
		return errors.New("hanya notifikasi yang gagal yang bisa di-retry")
	}

	n8nURL := "http://localhost:5678/webhook/reservasi-baru"
	resp, err := http.Post(n8nURL, "application/json", bytes.NewBufferString(notif.Payload))
	if err != nil || resp.StatusCode >= 400 {
		return errors.New("gagal mengirim ulang notifikasi")
	}
	defer resp.Body.Close()

	now := time.Now()
	s.repo.UpdateStatus(notif.ID, "sent")
	notif.SentAt = &now
	return nil
}
