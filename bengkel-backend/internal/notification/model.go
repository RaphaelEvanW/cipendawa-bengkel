package notification

import "time"

type Notification struct {
	ID            string     `json:"id" gorm:"type:uuid;primary_key"`
	ReservationID string     `json:"reservation_id" gorm:"type:uuid;not null"`
	Channel       string     `json:"channel" gorm:"type:notification_channel;not null"`
	Status        string     `json:"status" gorm:"type:notification_status;default:pending"`
	Payload       string     `json:"payload"`
	SentAt        *time.Time `json:"sent_at"`
}

func (Notification) TableName() string { return "notification" }

type NotificationPayload struct {
	BookingCode        string `json:"booking_code"`
	CustomerName       string `json:"customer_name"`
	CustomerPhone      string `json:"customer_phone"`
	CustomerVehicle    string `json:"customer_vehicle"`
	ServiceID          string `json:"service_id"`
	ReservationDate    string `json:"reservation_date"`
	ReservationTime    string `json:"reservation_time"`
	Notes              string `json:"notes"`
	RescheduleWilling  bool   `json:"reschedule_willing"`
	RescheduleDateFrom string `json:"reschedule_date_from"`
	RescheduleDateTo   string `json:"reschedule_date_to"`
	RescheduleTimeFrom string `json:"reschedule_time_from"`
	RescheduleTimeTo   string `json:"reschedule_time_to"`
	IsOverCapacity     bool   `json:"is_over_capacity"`
}

type RetryRequest struct {
	ID string `json:"id" binding:"required"`
}
