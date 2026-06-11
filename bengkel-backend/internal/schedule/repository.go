package schedule

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetConfig() (*ShopConfig, error) {
	var config ShopConfig
	err := r.db.First(&config).Error
	return &config, err
}

func (r *Repository) UpdateConfig(config *ShopConfig) error {
	return r.db.Save(config).Error
}

func (r *Repository) GetClosures() ([]ShopClosure, error) {
	var closures []ShopClosure
	err := r.db.Order("date ASC").Find(&closures).Error
	return closures, err
}

func (r *Repository) GetClosureByDate(date string) (*ShopClosure, error) {
	var closure ShopClosure
	err := r.db.Where("date = ?", date).First(&closure).Error
	return &closure, err
}

func (r *Repository) CreateClosure(closure *ShopClosure) error {
	return r.db.Create(closure).Error
}

func (r *Repository) UpdateClosure(closure *ShopClosure) error {
	return r.db.Save(closure).Error
}

func (r *Repository) DeleteClosure(id string) error {
	return r.db.Where("id = ?", id).Delete(&ShopClosure{}).Error
}

func (r *Repository) SyncNationalHolidays(holidays []ShopClosure) error {
	for _, holiday := range holidays {
		var existing ShopClosure
		err := r.db.Where("date = ?", holiday.Date).First(&existing).Error
		if err == gorm.ErrRecordNotFound {
			holiday.ID = uuid.New().String()
			r.db.Create(&holiday)
		}
		// skip kalau udah ada — termasuk yang udah di-override admin
	}
	return nil
}

func (r *Repository) CountBookingsByDate(date string) (int64, error) {
	var count int64
	err := r.db.Table("reservation").
		Where("reservation_date = ? AND status NOT IN ?", date, []string{"rejected", "cancelled"}).
		Count(&count).Error
	return count, err
}

func (r *Repository) CreateClosureBulk(closures []ShopClosure) error {
	return r.db.Create(&closures).Error
}

func (r *Repository) CreateClosureRange(dateFrom, dateTo, note string, isClosed bool) error {
	from, err := time.Parse("2006-01-02", dateFrom)
	if err != nil {
		return err
	}
	to, err := time.Parse("2006-01-02", dateTo)
	if err != nil {
		return err
	}
	if to.Before(from) {
		return errors.New("tanggal akhir tidak boleh sebelum tanggal awal")
	}

	var closures []ShopClosure
	for d := from; !d.After(to); d = d.AddDate(0, 0, 1) {
		// skip kalau udah ada
		var existing ShopClosure
		err := r.db.Where("date = ?", d.Format("2006-01-02")).First(&existing).Error
		if err == nil {
			continue
		}
		closures = append(closures, ShopClosure{
			ID:       uuid.New().String(),
			Date:     d.Format("2006-01-02"),
			IsClosed: isClosed,
			Note:     note,
		})
	}

	if len(closures) == 0 {
		return nil
	}
	return r.db.Create(&closures).Error
}
