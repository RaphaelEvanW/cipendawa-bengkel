package service

import "gorm.io/gorm"

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindAll() ([]Service, error) {
	var services []Service
	err := r.db.Where("is_active = ?", true).Find(&services).Error
	return services, err
}

func (r *Repository) FindAllAdmin() ([]Service, error) {
	var services []Service
	err := r.db.Find(&services).Error
	return services, err
}

func (r *Repository) FindByID(id string) (*Service, error) {
	var service Service
	err := r.db.Where("id = ?", id).First(&service).Error
	return &service, err
}

func (r *Repository) Create(service *Service) error {
	return r.db.Create(service).Error
}

func (r *Repository) Update(service *Service) error {
	return r.db.Save(service).Error
}

func (r *Repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&Service{}).Error
}
