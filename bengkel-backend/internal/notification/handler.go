package notification

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
	notifs, err := h.service.GetAll()
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, "Gagal ambil data notifikasi")
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", notifs)
}

func (h *Handler) GetByReservationID(c *gin.Context) {
	reservationID := c.Param("reservation_id")
	notifs, err := h.service.GetByReservationID(reservationID)
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, "Gagal ambil data notifikasi")
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", notifs)
}

func (h *Handler) Retry(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.Retry(id); err != nil {
		pkg.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Notifikasi berhasil dikirim ulang", nil)
}
