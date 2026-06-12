package dashboard

import (
	"time"

	"gorm.io/gorm"
)

type Service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

type Summary struct {
	TodayTotal int64 `json:"today_total"`
	Pending    int64 `json:"pending"`
	Confirmed  int64 `json:"confirmed"`
	InProgress int64 `json:"in_progress"`
	Done       int64 `json:"done"`
	Rejected   int64 `json:"rejected"`
	Cancelled  int64 `json:"cancelled"`
}

type ChartPoint struct {
	Date  string `json:"date"`
	Total int64  `json:"total"`
}

func (s *Service) GetSummary() (*Summary, error) {
	today := time.Now().Format("2006-01-02")
	summary := &Summary{}

	s.db.Model(&struct{}{}).Table("reservation").
		Where("reservation_date = ?", today).
		Count(&summary.TodayTotal)

	statuses := map[string]*int64{
		"pending":     &summary.Pending,
		"confirmed":   &summary.Confirmed,
		"in_progress": &summary.InProgress,
		"done":        &summary.Done,
		"rejected":    &summary.Rejected,
		"cancelled":   &summary.Cancelled,
	}

	for status, count := range statuses {
		s.db.Model(&struct{}{}).Table("reservation").
			Where("status = ?", status).
			Count(count)
	}

	return summary, nil
}

func (s *Service) GetChartData() ([]ChartPoint, error) {
	var points []ChartPoint
	for i := 6; i >= 0; i-- {
		date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		var count int64
		s.db.Model(&struct{}{}).Table("reservation").
			Where("reservation_date = ? AND status NOT IN ?", date, []string{"rejected", "cancelled"}).
			Count(&count)
		points = append(points, ChartPoint{Date: date, Total: count})
	}
	return points, nil
}
