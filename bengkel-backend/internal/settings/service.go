package settings

import (
	"errors"

	"gorm.io/gorm"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAll() ([]Setting, error) {
	return s.repo.FindAll()
}

func (s *Service) GetByKey(key string) (*Setting, error) {
	setting, err := s.repo.FindByKey(key)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("setting tidak ditemukan")
	}
	return setting, err
}

func (s *Service) Update(key, value string) (*Setting, error) {
	_, err := s.repo.FindByKey(key)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("setting tidak ditemukan")
	}
	return s.repo.Update(key, value)
}
