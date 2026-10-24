package main

import (
	"context"
	"errors"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"bengkel-backend/config"
	"bengkel-backend/internal/reservation"
	"bengkel-backend/internal/schedule"
	"bengkel-backend/pkg"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func buildRouter(cfg *config.Config, db *gorm.DB) *gin.Engine {
	router := gin.New()
	_ = router.SetTrustedProxies(nil)
	router.Use(gin.Logger(), gin.Recovery())
	router.Use(cors.New(cors.Config{
		AllowOrigins: cfg.CORSOrigins,
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders: []string{"Origin", "Content-Type", "Idempotency-Key"},
		MaxAge:       time.Hour,
	}))
	router.GET("/ping", func(c *gin.Context) {
		pkg.SendSuccess(c, http.StatusOK, "pong", nil)
	})
	repository := reservation.NewRepository(db)
	scheduleRepository := schedule.NewRepository(db)
	handler := reservation.NewHandler(reservation.NewService(repository, scheduleRepository, cfg))
	router.POST("/api/reservations", handler.Create)
	return router
}

func main() {
	cfg := config.Load()
	if err := cfg.Validate(); err != nil {
		log.Fatal(err)
	}
	db := pkg.InitDB(cfg)
	pool, err := db.DB()
	if err != nil {
		log.Fatal("Database pool unavailable")
	}
	defer pool.Close()

	gin.SetMode(gin.ReleaseMode)
	server := &http.Server{
		Addr:              net.JoinHostPort(cfg.ListenHost, cfg.Port),
		Handler:           buildRouter(cfg, db),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    16 * 1024,
	}
	stop, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()
	serverErrors := make(chan error, 1)
	go func() {
		log.Printf("Showcase API listening on %s; WhatsApp mode: mock", server.Addr)
		serverErrors <- server.ListenAndServe()
	}()
	select {
	case err := <-serverErrors:
		if !errors.Is(err, http.ErrServerClosed) {
			log.Fatal(err)
		}
	case <-stop.Done():
		shutdown, done := context.WithTimeout(context.Background(), 10*time.Second)
		defer done()
		if err := server.Shutdown(shutdown); err != nil {
			log.Print("Graceful shutdown timed out")
		}
	}
}
