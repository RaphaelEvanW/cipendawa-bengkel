package auth

import (
	"errors"

	"bengkel-backend/config"
	"bengkel-backend/pkg"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	db  *gorm.DB
	cfg *config.Config
}

func NewService(db *gorm.DB, cfg *config.Config) *Service {
	return &Service{db: db, cfg: cfg}
}

func (s *Service) Login(req LoginRequest) (*LoginResponse, error) {
	var admin Admin
	if err := s.db.Where("username = ?", req.Username).First(&admin).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("username atau password salah")
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("username atau password salah")
	}

	accessToken, err := pkg.GenerateToken(admin.ID, admin.Username, s.cfg.JWTSecret)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken: accessToken,
		Admin:       admin,
	}, nil
}
