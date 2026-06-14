package settings

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

func (h *Handler) GetAll(c *gin.Context) {
	settings, err := h.service.GetAll()
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, "Gagal ambil settings")
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", settings)
}

func (h *Handler) GetByKey(c *gin.Context) {
	key := c.Param("key")
	setting, err := h.service.GetByKey(key)
	if err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", setting)
}

func (h *Handler) Update(c *gin.Context) {
	key := c.Param("key")
	var req UpdateSettingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	setting, err := h.service.Update(key, req.Value)
	if err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Setting berhasil diupdate", setting)
}
