package service

import (
	"net/http"

	"bengkel-backend/pkg"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *ServiceUsecase
}

func NewHandler(service *ServiceUsecase) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetAll(c *gin.Context) {
	services, err := h.service.GetAll()
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", services)
}

func (h *Handler) GetByID(c *gin.Context) {
	id := c.Param("id")
	service, err := h.service.GetByID(id)
	if err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", service)
}

func (h *Handler) GetAllAdmin(c *gin.Context) {
	services, err := h.service.GetAllAdmin()
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", services)
}

func (h *Handler) Create(c *gin.Context) {
	var req CreateServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	service, err := h.service.Create(req)
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusCreated, "Layanan berhasil dibuat", service)
}

func (h *Handler) Update(c *gin.Context) {
	id := c.Param("id")
	var req UpdateServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	service, err := h.service.Update(id, req)
	if err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Layanan berhasil diupdate", service)
}

func (h *Handler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.Delete(id); err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Layanan berhasil dihapus", nil)
}
