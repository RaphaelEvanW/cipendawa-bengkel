package reservation

import (
	"encoding/json"
	"errors"
	"io"
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
	var req *CreateReservationRequest
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 16*1024)
	decoder := json.NewDecoder(c.Request.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&req); err != nil || req == nil {
		pkg.SendError(c, http.StatusBadRequest, "Data reservasi tidak valid atau terlalu panjang.")
		return
	}
	var extra interface{}
	if err := decoder.Decode(&extra); err != io.EOF {
		pkg.SendError(c, http.StatusBadRequest, "Data reservasi tidak valid atau terlalu panjang.")
		return
	}
	receipt, replay, err := h.service.CreateWithKey(*req, c.GetHeader("Idempotency-Key"))
	if err != nil {
		var fields ValidationError
		switch {
		case errors.As(err, &fields):
			c.JSON(http.StatusUnprocessableEntity, gin.H{"success": false, "message": "Periksa kolom yang ditandai sebelum melanjutkan.", "errors": fields})
		case errors.Is(err, ErrIdempotencyConflict):
			pkg.SendError(c, http.StatusConflict, "Permintaan sebelumnya berisi data yang berbeda. Periksa isian sebelum mencoba lagi.")
		default:
			pkg.SendError(c, http.StatusServiceUnavailable, "Reservasi belum dapat disimpan. Coba lagi dengan data yang sama.")
		}
		return
	}
	status := http.StatusCreated
	if replay {
		status = http.StatusOK
	}
	pkg.SendSuccess(c, status, "Reservasi tersimpan. Pesan WhatsApp hanya berupa simulasi dan tidak dikirim.", receipt)
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
