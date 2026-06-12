package dashboard

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

func (h *Handler) GetSummary(c *gin.Context) {
	summary, err := h.service.GetSummary()
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, "Gagal ambil data summary")
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", summary)
}

func (h *Handler) GetChartData(c *gin.Context) {
	data, err := h.service.GetChartData()
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, "Gagal ambil data chart")
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", data)
}
