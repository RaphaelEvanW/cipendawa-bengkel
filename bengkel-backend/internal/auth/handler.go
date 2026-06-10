package auth

import (
	"net/http"

	"bengkel-backend/pkg"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}

	resp, err := h.service.Login(req)
	if err != nil {
		pkg.SendError(c, http.StatusUnauthorized, err.Error())
		return
	}

	pkg.SendSuccess(c, http.StatusOK, "Login berhasil", resp)
}
