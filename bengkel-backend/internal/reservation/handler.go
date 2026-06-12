package reservation

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

func (h *Handler) Create(c *gin.Context) {
	var req CreateReservationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	reservation, err := h.service.Create(req)
	if err != nil {
		pkg.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusCreated, "Reservasi berhasil dibuat", reservation)
}

func (h *Handler) CheckStatus(c *gin.Context) {
	var req CheckStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	result, err := h.service.CheckStatus(req)
	if err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", result)
}

func (h *Handler) GetAll(c *gin.Context) {
	status := c.Query("status")
	date := c.Query("date")
	reservations, err := h.service.GetAll(status, date)
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", reservations)
}

func (h *Handler) GetByID(c *gin.Context) {
	id := c.Param("id")
	reservation, err := h.service.GetByID(id)
	if err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", reservation)
}

func (h *Handler) UpdateStatus(c *gin.Context) {
	id := c.Param("id")
	adminID := c.GetString("admin_id")
	var req UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	if err := h.service.UpdateStatus(id, adminID, req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Status berhasil diupdate", nil)
}

func (h *Handler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.Delete(id); err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Reservasi berhasil dihapus", nil)
}

func (h *Handler) GetLogs(c *gin.Context) {
	id := c.Param("id")
	logs, err := h.service.GetLogs(id)
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", logs)
}
