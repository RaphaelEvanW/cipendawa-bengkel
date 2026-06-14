package settings

import (
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindAll() ([]Setting, error) {
	var settings []Setting
	err := r.db.Find(&settings).Error
	return settings, err
}

func (r *Repository) FindByKey(key string) (*Setting, error) {
	var setting Setting
	err := r.db.Where("key = ?", key).First(&setting).Error
	return &setting, err
}

func (r *Repository) Update(key, value string) (*Setting, error) {
	var setting Setting
	err := r.db.Where("key = ?", key).First(&setting).Error
	if err != nil {
		return nil, err
	}
	setting.Value = value
	err = r.db.Save(&setting).Error
	return &setting, err
}
