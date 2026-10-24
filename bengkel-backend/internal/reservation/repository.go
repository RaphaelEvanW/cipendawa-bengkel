package reservation

import (
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(reservation *Reservation) error {
	return r.db.Create(reservation).Error
}

func (r *Repository) FindAll() ([]Reservation, error) {
	var reservations []Reservation
	err := r.db.Order("created_at DESC").Find(&reservations).Error
	return reservations, err
}

func (r *Repository) FindWithFilter(status, date string) ([]Reservation, error) {
	var reservations []Reservation
	query := r.db.Order("created_at DESC")
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if date != "" {
		query = query.Where("reservation_date = ?", date)
	}
	err := query.Find(&reservations).Error
	return reservations, err
}

func (r *Repository) FindByID(id string) (*Reservation, error) {
	var reservation Reservation
	err := r.db.Where("id = ?", id).First(&reservation).Error
	return &reservation, err
}

func (r *Repository) FindByBookingCode(code string) (*Reservation, error) {
	var reservation Reservation
	err := r.db.Where("booking_code = ?", code).First(&reservation).Error
	return &reservation, err
}

func (r *Repository) FindByPhone(phone string) ([]Reservation, error) {
	var reservations []Reservation
	err := r.db.Where("customer_phone = ?", phone).Order("created_at DESC").Find(&reservations).Error
	return reservations, err
}

func (r *Repository) UpdateStatus(id, status string) error {
	return r.db.Model(&Reservation{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": gorm.Expr("NOW()"),
		}).Error
}

func (r *Repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&Reservation{}).Error
}

func (r *Repository) CreateLog(log *ReservationLog) error {
	return r.db.Create(log).Error
}

func (r *Repository) FindLogs(reservationID string) ([]ReservationLog, error) {
	var logs []ReservationLog
	err := r.db.Where("reservation_id = ?", reservationID).
		Order("changed_at ASC").
		Find(&logs).Error
	return logs, err
}

func (r *Repository) CountByDate(date string) (int64, error) {
	var count int64
	err := r.db.Model(&Reservation{}).
		Where("reservation_date = ? AND status NOT IN ?", date, []string{"rejected", "cancelled"}).
		Count(&count).Error
	return count, err
}

func (r *Repository) Save(reservation *Reservation, notification NotificationReceipt) (*Reservation, NotificationReceipt, bool, error) {
	replay := false
	err := r.db.Transaction(func(tx *gorm.DB) error {
		result := tx.Omit("RescheduleDateFrom", "RescheduleDateTo", "RescheduleTimeFrom", "RescheduleTimeTo").Clauses(clause.OnConflict{Columns: []clause.Column{{Name: "idempotency_key"}}, DoNothing: true}).Create(reservation)
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			replay = true
			var original Reservation
			if err := tx.Where("idempotency_key = ?", reservation.IdempotencyKey).First(&original).Error; err != nil {
				return err
			}
			if original.RequestHash != reservation.RequestHash {
				return ErrIdempotencyConflict
			}
			var saved struct{ Payload string }
			if err := tx.Table("notification").Select("payload").Where("reservation_id = ? AND status = ?", original.ID, "simulated").Take(&saved).Error; err != nil {
				return err
			}
			if err := json.Unmarshal([]byte(saved.Payload), &notification); err != nil {
				return err
			}
			*reservation = original
			return nil
		}
		payload, err := json.Marshal(notification)
		if err != nil {
			return err
		}
		return tx.Exec("INSERT INTO notification (id, reservation_id, channel, status, payload, sent_at) VALUES (?, ?, 'whatsapp', 'simulated', ?, NULL)", uuid.NewString(), reservation.ID, string(payload)).Error
	})
	return reservation, notification, replay, err
}
func (r *Repository) Lookup(key, hash string) (*Receipt, error) {
	var original Reservation
	err := r.db.Where("idempotency_key = ?", key).First(&original).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if original.RequestHash != hash {
		return nil, ErrIdempotencyConflict
	}
	var saved struct{ Payload string }
	if err = r.db.Table("notification").Select("payload").Where("reservation_id = ? AND status = ?", original.ID, "simulated").Take(&saved).Error; err != nil {
		return nil, err
	}
	var notification NotificationReceipt
	if err = json.Unmarshal([]byte(saved.Payload), &notification); err != nil {
		return nil, err
	}
	return &Receipt{BookingCode: original.BookingCode, Status: original.Status, Notification: notification}, nil
}
