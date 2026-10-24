package pkg

import (
	"log"
	"time"

	"bengkel-backend/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB(cfg *config.Config) *gorm.DB {
	db, err := gorm.Open(postgres.Open(cfg.DBConnectionString()), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})
	if err != nil {
		log.Fatal("Failed to connect to database; check the local database and environment configuration")
	}
	pool, err := db.DB()
	if err != nil {
		log.Fatal("Failed to configure database pool")
	}
	pool.SetMaxOpenConns(10)
	pool.SetMaxIdleConns(5)
	pool.SetConnMaxLifetime(30 * time.Minute)

	log.Println("Database connected successfully")
	DB = db
	return db
}
