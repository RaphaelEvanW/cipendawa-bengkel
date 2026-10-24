package config

import (
	"net/url"
	"strings"
	"testing"
)

func TestConfigUsesExplicitShowcaseDefaults(t *testing.T) {
	t.Setenv("ENV_FILE", "does-not-exist.env")
	t.Setenv("NOTIFICATION_MODE", "")
	t.Setenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
	cfg := Load()
	if cfg.NotificationMode != "mock" {
		t.Fatalf("notification mode = %q, want mock", cfg.NotificationMode)
	}
	if len(cfg.CORSOrigins) != 2 || cfg.CORSOrigins[1] != "http://127.0.0.1:3000" {
		t.Fatalf("unexpected origins: %v", cfg.CORSOrigins)
	}
}

func TestConfigRejectsUnsupportedNotificationMode(t *testing.T) {
	cfg := &Config{DBHost: "localhost", DBPort: "5432", DBName: "test", DBUser: "test", DBSSLMode: "disable", Port: "8080", NotificationMode: "live", CORSOrigins: []string{"http://localhost:3000"}}
	if err := cfg.Validate(); err == nil || !strings.Contains(err.Error(), "NOTIFICATION_MODE") {
		t.Fatalf("expected mock-only configuration error, got %v", err)
	}
}

func TestDatabaseURLPreservesSpecialCharacters(t *testing.T) {
	cfg := &Config{DBHost: "127.0.0.1", DBPort: "5432", DBUser: "user", DBPassword: "secret @:'\\&?", DBName: "showcase", DBSSLMode: "require"}
	parsed, err := url.Parse(cfg.DBConnectionString())
	if err != nil {
		t.Fatal(err)
	}
	password, _ := parsed.User.Password()
	if password != cfg.DBPassword || parsed.Query().Get("sslmode") != "require" {
		t.Fatal("database URL did not preserve password or TLS setting")
	}
}

func TestConfigRejectsWildcardCORS(t *testing.T) {
	cfg := &Config{DBHost: "localhost", DBPort: "5432", DBName: "test", DBUser: "test", DBSSLMode: "disable", Port: "8080", NotificationMode: "mock", CORSOrigins: []string{"*"}}
	if err := cfg.Validate(); err == nil {
		t.Fatal("expected explicit CORS origins")
	}
}
