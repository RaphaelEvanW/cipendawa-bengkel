package main

import (
	"log"

	"bengkel-backend/config"
	"bengkel-backend/internal/auth"
	"bengkel-backend/internal/dashboard"
	"bengkel-backend/internal/notification"
	"bengkel-backend/internal/reservation"
	"bengkel-backend/internal/schedule"
	"bengkel-backend/internal/service"
	"bengkel-backend/pkg"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	db := pkg.InitDB(cfg)

	// auth
	authService := auth.NewService(db, cfg)
	authHandler := auth.NewHandler(authService)

	// service
	serviceRepo := service.NewRepository(db)
	serviceService := service.NewService(serviceRepo)
	serviceHandler := service.NewHandler(serviceService)

	// schedule
	scheduleRepo := schedule.NewRepository(db)
	scheduleService := schedule.NewService(scheduleRepo, cfg)
	scheduleHandler := schedule.NewHandler(scheduleService)

	// reservation
	reservationRepo := reservation.NewRepository(db)
	reservationService := reservation.NewService(reservationRepo, scheduleRepo, cfg)
	reservationHandler := reservation.NewHandler(reservationService)

	// notification
	notificationRepo := notification.NewRepository(db)
	notificationService := notification.NewService(notificationRepo, cfg)
	notificationHandler := notification.NewHandler(notificationService)

	// dashboard
	dashboardService := dashboard.NewService(db)
	dashboardHandler := dashboard.NewHandler(dashboardService)

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		pkg.SendSuccess(c, 200, "pong", nil)
	})

	api := r.Group("/api")
	{
		// auth
		authRoutes := api.Group("/auth")
		{
			authRoutes.POST("/login", authHandler.Login)
		}

		// public routes
		api.GET("/services", serviceHandler.GetAll)
		api.GET("/services/:id", serviceHandler.GetByID)
		api.GET("/book/config", scheduleHandler.GetConfig)
		api.POST("/book/availability", scheduleHandler.CheckAvailability)
		api.POST("/reservations", reservationHandler.Create)
		api.POST("/reservations/status", reservationHandler.CheckStatus)

		// admin routes
		adminRoutes := api.Group("/admin")
		adminRoutes.Use(auth.AuthMiddleware(cfg))
		{
			// service
			adminRoutes.GET("/services", serviceHandler.GetAllAdmin)
			adminRoutes.POST("/services", serviceHandler.Create)
			adminRoutes.PUT("/services/:id", serviceHandler.Update)
			adminRoutes.DELETE("/services/:id", serviceHandler.Delete)

			// shop config
			adminRoutes.PUT("/book/config", scheduleHandler.UpdateConfig)

			// shop closures
			adminRoutes.GET("/book/closures", scheduleHandler.GetClosures)
			adminRoutes.POST("/book/closures", scheduleHandler.CreateClosure)
			adminRoutes.POST("/book/closures/bulk", scheduleHandler.CreateClosureBulk)
			adminRoutes.POST("/book/closures/range", scheduleHandler.CreateClosureRange)
			adminRoutes.PATCH("/book/closures/:id", scheduleHandler.UpdateClosure)
			adminRoutes.DELETE("/book/closures/:id", scheduleHandler.DeleteClosure)
			adminRoutes.POST("/book/sync-holidays", scheduleHandler.SyncNationalHolidays)

			// reservation
			adminRoutes.GET("/reservations", reservationHandler.GetAll)
			adminRoutes.GET("/reservations/:id", reservationHandler.GetByID)
			adminRoutes.PATCH("/reservations/:id/status", reservationHandler.UpdateStatus)
			adminRoutes.DELETE("/reservations/:id", reservationHandler.Delete)
			adminRoutes.GET("/reservations/:id/logs", reservationHandler.GetLogs)

			// notification
			adminRoutes.GET("/notifications", notificationHandler.GetAll)
			adminRoutes.GET("/notifications/reservation/:reservation_id", notificationHandler.GetByReservationID)
			adminRoutes.POST("/notifications/:id/retry", notificationHandler.Retry)

			// dashboard
			adminRoutes.GET("/dashboard/summary", dashboardHandler.GetSummary)
			adminRoutes.GET("/dashboard/chart", dashboardHandler.GetChartData)
		}
	}

	log.Printf("Server running on port %s", cfg.Port)
	r.Run(":" + cfg.Port)
}
