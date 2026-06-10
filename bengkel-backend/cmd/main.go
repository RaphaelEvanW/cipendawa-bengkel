package main

import (
	"log"

	"bengkel-backend/config"
	"bengkel-backend/internal/auth"
	"bengkel-backend/pkg"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()
	db := pkg.InitDB(cfg)

	authService := auth.NewService(db, cfg)
	authHandler := auth.NewHandler(authService)

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

		adminRoutes := api.Group("/admin")
		adminRoutes.Use(auth.AuthMiddleware(cfg))
		{
		}
	}

	log.Printf("Server running on port %s", cfg.Port)
	r.Run(":" + cfg.Port)
}
