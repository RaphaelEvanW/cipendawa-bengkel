package schedule

import (
	"net/http"
	"strconv"
	"time"

	"bengkel-backend/pkg"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetConfig(c *gin.Context) {
	config, err := h.service.GetConfig()
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, "Gagal ambil config")
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", config)
}

func (h *Handler) UpdateConfig(c *gin.Context) {
	var req UpdateConfigRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	config, err := h.service.UpdateConfig(req)
	if err != nil {
		pkg.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Config berhasil diupdate", config)
}

func (h *Handler) GetClosures(c *gin.Context) {
	closures, err := h.service.GetClosures()
	if err != nil {
		pkg.SendError(c, http.StatusInternalServerError, "Gagal ambil data closure")
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", closures)
}

func (h *Handler) CreateClosure(c *gin.Context) {
	var req CreateClosureRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	closure, err := h.service.CreateClosure(req)
	if err != nil {
		pkg.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusCreated, "Tanggal tutup berhasil ditambahkan", closure)
}

func (h *Handler) CreateClosureBulk(c *gin.Context) {
	var req CreateClosureBulkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	closures, err := h.service.CreateClosureBulk(req)
	if err != nil {
		pkg.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusCreated, "Tanggal tutup berhasil ditambahkan", closures)
}

func (h *Handler) CreateClosureRange(c *gin.Context) {
	var req CreateClosureRangeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	if err := h.service.CreateClosureRange(req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusCreated, "Range tanggal tutup berhasil ditambahkan", nil)
}

func (h *Handler) UpdateClosure(c *gin.Context) {
	id := c.Param("id")
	var req UpdateClosureRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	closure, err := h.service.UpdateClosure(id, req)
	if err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Closure berhasil diupdate", closure)
}

func (h *Handler) DeleteClosure(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.DeleteClosure(id); err != nil {
		pkg.SendError(c, http.StatusNotFound, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Closure berhasil dihapus", nil)
}

func (h *Handler) CheckAvailability(c *gin.Context) {
	var req CheckAvailabilityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		pkg.SendError(c, http.StatusBadRequest, "Input tidak valid: "+err.Error())
		return
	}
	result, err := h.service.CheckAvailability(req)
	if err != nil {
		pkg.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Berhasil", result)
}

func (h *Handler) SyncNationalHolidays(c *gin.Context) {
	yearStr := c.Query("year")
	year := time.Now().Year()
	if yearStr != "" {
		if y, err := strconv.Atoi(yearStr); err == nil {
			year = y
		}
	}
	if err := h.service.SyncNationalHolidays(year); err != nil {
		pkg.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	pkg.SendSuccess(c, http.StatusOK, "Libur nasional berhasil disync", nil)
}
