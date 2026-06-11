package reservation

import "time"

type Reservation struct {
	ID                 string    `json:"id" gorm:"type:uuid;primary_key"`
	BookingCode        string    `json:"booking_code" gorm:"unique;not null"`
	ServiceID          string    `json:"service_id" gorm:"type:uuid;not null"`
	ReservationDate    string    `json:"reservation_date" gorm:"type:date;not null"`
	ReservationTime    string    `json:"reservation_time" gorm:"type:time;not null"`
	CustomerName       string    `json:"customer_name" gorm:"not null"`
	CustomerPhone      string    `json:"customer_phone" gorm:"not null"`
	CustomerVehicle    string    `json:"customer_vehicle"`
	Notes              string    `json:"notes"`
	RescheduleWilling  bool      `json:"reschedule_willing" gorm:"default:false"`
	RescheduleDateFrom string    `json:"reschedule_date_from" gorm:"type:date"`
	RescheduleDateTo   string    `json:"reschedule_date_to" gorm:"type:date"`
	RescheduleTimeFrom string    `json:"reschedule_time_from" gorm:"type:time"`
	RescheduleTimeTo   string    `json:"reschedule_time_to" gorm:"type:time"`
	Status             string    `json:"status" gorm:"type:reservation_status;default:pending"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

func (Reservation) TableName() string { return "reservation" }

type ReservationLog struct {
	ID            string    `json:"id" gorm:"type:uuid;primary_key"`
	ReservationID string    `json:"reservation_id" gorm:"type:uuid;not null"`
	AdminID       string    `json:"admin_id" gorm:"type:uuid"`
	OldStatus     string    `json:"old_status"`
	NewStatus     string    `json:"new_status" gorm:"not null"`
	Note          string    `json:"note"`
	ChangedAt     time.Time `json:"changed_at"`
}

func (ReservationLog) TableName() string { return "reservation_log" }

type CreateReservationRequest struct {
	ServiceID          string `json:"service_id" binding:"required"`
	ReservationDate    string `json:"reservation_date" binding:"required"`
	ReservationTime    string `json:"reservation_time" binding:"required"`
	CustomerName       string `json:"customer_name" binding:"required"`
	CustomerPhone      string `json:"customer_phone" binding:"required"`
	CustomerVehicle    string `json:"customer_vehicle"`
	Notes              string `json:"notes"`
	RescheduleWilling  bool   `json:"reschedule_willing"`
	RescheduleDateFrom string `json:"reschedule_date_from"`
	RescheduleDateTo   string `json:"reschedule_date_to"`
	RescheduleTimeFrom string `json:"reschedule_time_from"`
	RescheduleTimeTo   string `json:"reschedule_time_to"`
}

type UpdateStatusRequest struct {
	Status string `json:"status" binding:"required"`
	Note   string `json:"note"`
}

type CheckStatusRequest struct {
	BookingCode   string `json:"booking_code"`
	CustomerPhone string `json:"customer_phone"`
}
