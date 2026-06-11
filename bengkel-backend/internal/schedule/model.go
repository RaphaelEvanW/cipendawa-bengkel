package schedule

type ScheduleSlot struct {
	ID              string `json:"id" gorm:"type:uuid;primary_key"`
	SlotDate        string `json:"slot_data" gorm:"type:date;not null"`
	SlotTime        string `json:"slot_time" gorm:"type:time;not null"`
	MaxBookings     int    `json:"max_bookings" gorm:"default:1"`
	CurrentBookings int    `json:"current_bookings" gorm:"default:0"`
	IsOpen          bool   `json:"is_open" gorm:"default:true"`
}

func (ScheduleSlot) TableName() string {
	return "schedule_slot"
}

type CreateSlotRequest struct {
	SlotDate    string `json:"slot_date" binding:"required"`
	SlotTime    string `json:"slot_time" binding:"required"`
	MaxBookings int    `json:"max_bookings" binding:"required"`
}

type UpdateSlotRequest struct {
	IsOpen      bool `json:"is_open"`
	MaxBookings int  `json:"max_bookings"`
}
