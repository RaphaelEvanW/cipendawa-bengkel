package notification

import (
	"time"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(notif *Notification) error {
	return r.db.Create(notif).Error
}

func (r *Repository) FindAll() ([]Notification, error) {
	var notifs []Notification
	err := r.db.Order("sent_at DESC").Find(&notifs).Error
	return notifs, err
}

func (r *Repository) FindByID(id string) (*Notification, error) {
	var notif Notification
	err := r.db.Where("id = ?", id).First(&notif).Error
	return &notif, err
}

func (r *Repository) FindByReservationID(reservationID string) ([]Notification, error) {
	var notifs []Notification
	err := r.db.Where("reservation_id = ?", reservationID).
		Order("sent_at DESC").
		Find(&notifs).Error
	return notifs, err
}

func (r *Repository) UpdateStatus(id, status string) error {
	updates := map[string]interface{}{"status": status}
	if status == "sent" {
		now := time.Now()
		updates["sent_at"] = now
	}
	return r.db.Model(&Notification{}).
		Where("id = ?", id).
		Updates(updates).Error
}
