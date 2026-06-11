package service

import (
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ServiceUsecase struct {
	repo *Repository
}

func NewService(repo *Repository) *ServiceUsecase {
	return &ServiceUsecase{repo: repo}
}

func (s *ServiceUsecase) GetAll() ([]Service, error) {
	return s.repo.FindAll()
}

func (s *ServiceUsecase) GetAllAdmin() ([]Service, error) {
	return s.repo.FindAllAdmin()
}

func (s *ServiceUsecase) GetByID(id string) (*Service, error) {
	service, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("layanan tidak ditemukan")
	}
	return service, err
}

func (s *ServiceUsecase) Create(req CreateServiceRequest) (*Service, error) {
	service := &Service{
		ID:              uuid.New().String(),
		Name:            req.Name,
		Description:     req.Description,
		PriceEstimate:   req.PriceEstimate,
		DurationMinutes: req.DurationMinutes,
		IsActive:        true,
	}
	err := s.repo.Create(service)
	return service, err
}

func (s *ServiceUsecase) Update(id string, req UpdateServiceRequest) (*Service, error) {
	service, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("layanan tidak ditemukan")
	}
	if err != nil {
		return nil, err
	}

	service.Name = req.Name
	service.Description = req.Description
	service.PriceEstimate = req.PriceEstimate
	service.DurationMinutes = req.DurationMinutes
	service.IsActive = req.IsActive

	err = s.repo.Update(service)
	return service, err
}

func (s *ServiceUsecase) Delete(id string) error {
	_, err := s.repo.FindByID(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New("layanan tidak ditemukan")
	}
	return s.repo.Delete(id)
}
