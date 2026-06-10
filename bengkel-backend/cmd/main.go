package main

import (
	"log"

	"bengkel-backend/config"
	"bengkel-backend/pkg"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	pkg.InitDB(cfg)

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		pkg.SendSuccess(c, 200, "pong", nil)
	})

	log.Printf("Server running on port %s", cfg.Port)
	r.Run(":" + cfg.Port)
}
