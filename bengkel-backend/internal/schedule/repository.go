package schedule

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

func (r *Repository) FindAvailable(date string) ([]ScheduleSlot, error) {
	var slots []ScheduleSlot
	err := r.db.Where(
		"slot_date = ? AND is_open = ? AND current_bookings < max_bookings",
		date, true,
	).Find(&slots).Error
	return slots, err
}

func (r *Repository) FindAll() ([]ScheduleSlot, error) {
	var slots []ScheduleSlot
	err := r.db.Order("slot_date ASC, slot_time ASC").Find(&slots).Error
	return slots, err
}

func (r *Repository) FindByID(id string) (*ScheduleSlot, error) {
	var slot ScheduleSlot
	err := r.db.Where("id = ?", id).First(&slot).Error
	return &slot, err
}

func (r *Repository) Create(slot *ScheduleSlot) error {
	return r.db.Create(slot).Error
}

func (r *Repository) Update(slot *ScheduleSlot) error {
	return r.db.Save(slot).Error
}

func (r *Repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&ScheduleSlot{}).Error
}

func (r *Repository) IncrementBooking(id string) error {
	return r.db.Model(&ScheduleSlot{}).
		Where("id = ?", id).
		Update("current_bookings", gorm.Expr("current_bookings + 1")).Error
}

func (r *Repository) DecrementBooking(id string) error {
	return r.db.Model(&ScheduleSlot{}).
		Where("id = ?", id).
		Where("current_bookings > 0").
		Update("current_bookings", gorm.Expr("current_bookings - 1")).Error
}

func (r *Repository) DeletePastSlots() error {
	return r.db.Where("slot_date < ?", time.Now()).Delete(&ScheduleSlot{}).Error
}
