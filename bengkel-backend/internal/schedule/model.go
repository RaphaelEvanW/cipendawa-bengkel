package schedule

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

type IntArray []int

func (a IntArray) Value() (driver.Value, error) {
	if a == nil {
		return "{}", nil
	}
	b, err := json.Marshal(a)
	return string(b), err
}

func (a *IntArray) Scan(value interface{}) error {
	if value == nil {
		*a = []int{}
		return nil
	}
	var str string
	switch v := value.(type) {
	case string:
		str = v
	case []byte:
		str = string(v)
	default:
		return fmt.Errorf("unsupported type: %T", value)
	}
	str = str[1 : len(str)-1]
	if str == "" {
		*a = []int{}
		return nil
	}
	var result []int
	for _, s := range splitComma(str) {
		var n int
		fmt.Sscanf(s, "%d", &n)
		result = append(result, n)
	}
	*a = result
	return nil
}

func splitComma(s string) []string {
	var result []string
	var current string
	for _, c := range s {
		if c == ',' {
			result = append(result, current)
			current = ""
		} else {
			current += string(c)
		}
	}
	if current != "" {
		result = append(result, current)
	}
	return result
}

type ShopConfig struct {
	ID                string    `json:"id" gorm:"type:uuid;primary_key"`
	OpenDays          IntArray  `json:"open_days" gorm:"type:int[]"`
	OpenTime          string    `json:"open_time" gorm:"type:time"`
	CloseTime         string    `json:"close_time" gorm:"type:time"`
	MaxBookingsPerDay int       `json:"max_bookings_per_day"`
	UpdatedAt         time.Time `json:"updated_at"`
}

func (ShopConfig) TableName() string { return "shop_config" }

type ShopClosure struct {
	ID                string `json:"id" gorm:"type:uuid;primary_key"`
	Date              string `json:"date" gorm:"type:date;unique"`
	IsNationalHoliday bool   `json:"is_national_holiday" gorm:"default:false"`
	IsOverridden      bool   `json:"is_overridden" gorm:"default:false"`
	IsClosed          bool   `json:"is_closed" gorm:"default:true"`
	Note              string `json:"note"`
}

func (ShopClosure) TableName() string { return "shop_closures" }

type UpdateConfigRequest struct {
	OpenDays          IntArray `json:"open_days" binding:"required"`
	OpenTime          string   `json:"open_time" binding:"required"`
	CloseTime         string   `json:"close_time" binding:"required"`
	MaxBookingsPerDay int      `json:"max_bookings_per_day" binding:"required"`
}

type CreateClosureRequest struct {
	Date     string `json:"date" binding:"required"`
	IsClosed bool   `json:"is_closed"`
	Note     string `json:"note"`
}

type UpdateClosureRequest struct {
	IsClosed     bool   `json:"is_closed"`
	IsOverridden bool   `json:"is_overridden"`
	Note         string `json:"note"`
}

type CreateClosureBulkRequest struct {
	Dates    []string `json:"dates" binding:"required"`
	Note     string   `json:"note"`
	IsClosed bool     `json:"is_closed"`
}

type CreateClosureRangeRequest struct {
	DateFrom string `json:"date_from" binding:"required"`
	DateTo   string `json:"date_to" binding:"required"`
	Note     string `json:"note"`
	IsClosed bool   `json:"is_closed"`
}

type CheckAvailabilityRequest struct {
	Date string `json:"date" binding:"required"`
	Time string `json:"time" binding:"required"`
}

type AvailabilityResponse struct {
	Available       bool   `json:"available"`
	Reason          string `json:"reason,omitempty"`
	CurrentBookings int    `json:"current_bookings"`
	MaxBookings     int    `json:"max_bookings"`
}
