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

	authService := auth.NewService(db, cfg)
	authHandler := auth.NewHandler(authService)

	// inisialisasi service module
	serviceRepo := service.NewRepository(db)
	serviceService := service.NewService(serviceRepo)
	serviceHandler := service.NewHandler(serviceService)

	scheduleRepo := schedule.NewRepository(db)
	scheduleService := schedule.NewService(scheduleRepo)
	scheduleHandler := schedule.NewHandler(scheduleService)

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		pkg.SendSuccess(c, 200, "pong", nil)
	})

	api := r.Group("/api")
	{
		authRoutes := api.Group("/auth")
		{
			authRoutes.POST("/login", authHandler.Login)
		}
		//Routes buat public
		api.GET("/services", serviceHandler.GetAll)
		api.GET("/service/:id", serviceHandler.GetByID)
		api.GET("/schedule/available", scheduleHandler.GetAvailable)

		// Routes buat admin
		adminRoutes := api.Group("/admin")
		adminRoutes.Use(auth.AuthMiddleware(cfg))
		{
			//Service routes
			adminRoutes.GET("/services", serviceHandler.GetAllAdmin)
			adminRoutes.POST("/services", serviceHandler.Create)
			adminRoutes.PUT("/services:id", serviceHandler.Update)
			adminRoutes.DELETE("/services/:id", serviceHandler.Delete)

			//Schedule routes
			adminRoutes.GET("/schedule", scheduleHandler.GetAll)
			adminRoutes.GET("/schedule/:id", scheduleHandler.GetByID)
			adminRoutes.POST("/schedule", scheduleHandler.Create)
			adminRoutes.PATCH("/schedule/:id", scheduleHandler.Update)
			adminRoutes.DELETE("/schedule/:id", scheduleHandler.Delete)
		}
	}

	log.Printf("Server running on port %s", cfg.Port)
	r.Run(":" + cfg.Port)
}
