package config

import (
	"errors"
	"net"
	"net/url"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost           string
	DBPort           string
	DBUser           string
	DBPassword       string
	DBName           string
	DBSSLMode        string
	JWTSecret        string
	Port             string
	ListenHost       string
	CORSOrigins      []string
	NotificationMode string
}

func Load() *Config {
	_ = godotenv.Load(getEnv("ENV_FILE", ".env"))
	origins := strings.Split(getEnv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"), ",")
	for i := range origins {
		origins[i] = strings.TrimSpace(origins[i])
	}

	return &Config{
		DBHost:           getEnv("DB_HOST", "localhost"),
		DBPort:           getEnv("DB_PORT", "5432"),
		DBUser:           getEnv("DB_USER", "postgres"),
		DBPassword:       getEnv("DB_PASSWORD", ""),
		DBName:           getEnv("DB_NAME", "bengkel_db"),
		DBSSLMode:        getEnv("DB_SSLMODE", "disable"),
		JWTSecret:        getEnv("JWT_SECRET", "secret"),
		Port:             getEnv("PORT", "8080"),
		ListenHost:       getEnv("LISTEN_HOST", "127.0.0.1"),
		CORSOrigins:      origins,
		NotificationMode: getEnv("NOTIFICATION_MODE", "mock"),
	}
}

func (c *Config) DBConnectionString() string {
	databaseURL := url.URL{
		Scheme: "postgres",
		User:   url.UserPassword(c.DBUser, c.DBPassword),
		Host:   net.JoinHostPort(c.DBHost, c.DBPort),
		Path:   "/" + c.DBName,
	}
	query := url.Values{}
	query.Set("sslmode", c.DBSSLMode)
	query.Set("connect_timeout", "5")
	databaseURL.RawQuery = query.Encode()
	return databaseURL.String()
}

func (c *Config) Validate() error {
	if c.NotificationMode != "mock" {
		return errors.New("NOTIFICATION_MODE must be mock for this showcase")
	}
	if c.DBHost == "" || c.DBUser == "" || c.DBName == "" {
		return errors.New("DB_HOST, DB_USER and DB_NAME are required")
	}
	for _, port := range []string{c.Port, c.DBPort} {
		n, err := strconv.Atoi(port)
		if err != nil || n < 1 || n > 65535 {
			return errors.New("PORT and DB_PORT must be valid port numbers")
		}
	}
	switch c.DBSSLMode {
	case "disable", "allow", "prefer", "require", "verify-ca", "verify-full":
	default:
		return errors.New("DB_SSLMODE is invalid")
	}
	for _, origin := range c.CORSOrigins {
		parsed, err := url.Parse(origin)
		if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") || parsed.Host == "" || parsed.User != nil || parsed.Path != "" || parsed.RawQuery != "" || parsed.Fragment != "" {
			return errors.New("CORS_ORIGINS must contain explicit HTTP(S) origins")
		}
	}
	return nil
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
