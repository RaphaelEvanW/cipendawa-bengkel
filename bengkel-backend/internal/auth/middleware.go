package auth

import (
	"net/http"
	"strings"

	"bengkel-backend/config"
	"bengkel-backend/pkg"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			pkg.SendError(c, http.StatusUnauthorized, "Token tidak ditemukan")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			pkg.SendError(c, http.StatusUnauthorized, "Format token tidak valid")
			c.Abort()
			return
		}

		claims, err := pkg.ValidateToken(parts[1], cfg.JWTSecret)
		if err != nil {
			pkg.SendError(c, http.StatusUnauthorized, "Token tidak valid atau expired")
			c.Abort()
			return
		}

		c.Set("admin_id", claims.AdminID)
		c.Set("username", claims.Username)
		c.Next()
	}
}
