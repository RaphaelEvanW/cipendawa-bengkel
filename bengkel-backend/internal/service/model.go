package service

import "time"

type Service struct {
	ID              string    `json:"id" gorm:"type:uuid;primary_key"`
	Name            string    `json:"name" gorm:"not null"`
	Description     string    `json:"description"`
	PriceEstimate   float64   `json:"price_estimate"`
	DurationMinutes int       `json:"duration_minutes"`
	IsActive        bool      `json:"is_active" gorm:"default:true"`
	CreatedAt       time.Time `json:"created_at"`
}

func (Service) TableName() string {
	return "service"
}

type CreateServiceRequest struct {
	Name            string  `json:"name" binding:"required"`
	Description     string  `json:"description"`
	PriceEstimate   float64 `json:"price_estimate"`
	DurationMinutes int     `json:"duration_minutes"`
}

type UpdateServiceRequest struct {
	Name            string  `json:"name"`
	Description     string  `json:"description"`
	PriceEstimate   float64 `json:"price_estimate"`
	DurationMinutes int     `json:"duration_minutes"`
	IsActive        bool    `json:"is_active"`
}
