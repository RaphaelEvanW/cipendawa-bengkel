package reservation

import (
	"gorm.io/gorm"
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
