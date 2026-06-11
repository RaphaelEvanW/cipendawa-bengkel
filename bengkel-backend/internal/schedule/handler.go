package schedule

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

func (h *Handler) GetAvailable(c *gin.Context) {
	date := c.Query("date")
	slots, err := h.service.GetAvailable(date)
	if err != nil {
		pkg.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", slots)
}

func (h *Handler) GetAll(c *gin.Context) {
	slots, err := h.service.GetAll()
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", slots)
}

func (h *Handler) GetByID(c *gin.Context) {
	id := c.Param("id")
	slot, err := h.service.GetByID(id)
	if err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", slot)
}

func (h *Handler) Create(c *gin.Context) {
	var req CreateSlotRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	slot, err := h.service.Create(req)
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusCreated, "Slot berhasil dibuat", slot)
}

func (h *Handler) Update(c *gin.Context) {
	id := c.Param("id")
	var req UpdateSlotRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	slot, err := h.service.Update(id, req)
	if err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Slot berhasil diupdate", slot)
}

func (h *Handler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.Delete(id); err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Slot berhasil dihapus", nil)
}
