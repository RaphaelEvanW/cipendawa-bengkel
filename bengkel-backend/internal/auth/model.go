package auth

import "time"

type Admin struct {
	ID           string    `json:"id" gorm:"type:uuid;primary_key"`
	Username     string    `json:"username" gorm:"unique;not null"`
	PasswordHash string    `json:"-" gorm:"not null"`
	Email        string    `json:"email" gorm:"unique;not null"`
	CreatedAt    time.Time `json:"created_at"`
}

func (Admin) TableName() string {
	return "admin"
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	Admin        Admin  `json:"admin"`
}
