package main

import (
	"log"

	"bengkel-backend/config"
	"bengkel-backend/internal/auth"
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

		// admin routes
		adminRoutes := api.Group("/admin")
		adminRoutes.Use(auth.AuthMiddleware(cfg))
		{
			// service
			adminRoutes.GET("/services", serviceHandler.GetAllAdmin)
			adminRoutes.POST("/services", serviceHandler.Create)
			adminRoutes.PUT("/services/:id", serviceHandler.Update)
			adminRoutes.DELETE("/services/:id", serviceHandler.Delete)

			// booking config
			adminRoutes.PUT("/book/config", scheduleHandler.UpdateConfig)

			// book closures
			adminRoutes.GET("/book/closures", scheduleHandler.GetClosures)
			adminRoutes.POST("/book/closures", scheduleHandler.CreateClosure)
			adminRoutes.POST("/book/closures/bulk", scheduleHandler.CreateClosureBulk)
			adminRoutes.POST("/book/closures/range", scheduleHandler.CreateClosureRange)
			adminRoutes.PATCH("/book/closures/:id", scheduleHandler.UpdateClosure)
			adminRoutes.DELETE("/book/closures/:id", scheduleHandler.DeleteClosure)

			// sync libur nasional
			adminRoutes.POST("/book/sync-holidays", scheduleHandler.SyncNationalHolidays)
		}
	}

	log.Printf("Server running on port %s", cfg.Port)
	r.Run(":" + cfg.Port)
}
