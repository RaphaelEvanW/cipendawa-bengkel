package settings

import "time"

type Setting struct {
	Key       string    `json:"key" gorm:"primary_key"`
	Value     string    `json:"value" gorm:"not null"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Setting) TableName() string { return "settings" }

type UpdateSettingRequest struct {
	Value string `json:"value" binding:"required"`
}
