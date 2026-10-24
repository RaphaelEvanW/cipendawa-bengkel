package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"bengkel-backend/config"
)

func TestShowcaseDoesNotExposeLegacyAdminOrPersonalLookup(t *testing.T) {
	router := buildRouter(&config.Config{CORSOrigins: []string{"http://localhost:3000"}}, nil)
	for _, route := range []struct{ method, path string }{
		{http.MethodPost, "/api/auth/login"},
		{http.MethodGet, "/api/admin/reservations"},
		{http.MethodPost, "/api/reservations/status"},
	} {
		response := httptest.NewRecorder()
		router.ServeHTTP(response, httptest.NewRequest(route.method, route.path, nil))
		if response.Code != http.StatusNotFound {
			t.Fatalf("%s %s returned %d, want 404", route.method, route.path, response.Code)
		}
	}
}

func TestShowcaseHealthAndCORS(t *testing.T) {
	router := buildRouter(&config.Config{CORSOrigins: []string{"http://localhost:3000"}}, nil)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/ping", nil))
	if response.Code != http.StatusOK {
		t.Fatalf("health check returned %d", response.Code)
	}
	for _, origin := range []string{"http://localhost:3000", "https://untrusted.example"} {
		request := httptest.NewRequest(http.MethodOptions, "/api/reservations", nil)
		request.Header.Set("Origin", origin)
		request.Header.Set("Access-Control-Request-Method", "POST")
		request.Header.Set("Access-Control-Request-Headers", "Content-Type,Idempotency-Key")
		response = httptest.NewRecorder()
		router.ServeHTTP(response, request)
		if origin == "http://localhost:3000" && response.Code != http.StatusNoContent {
			t.Fatalf("allowed preflight returned %d", response.Code)
		}
		if origin != "http://localhost:3000" && response.Code != http.StatusForbidden {
			t.Fatalf("untrusted preflight returned %d", response.Code)
		}
	}
}
