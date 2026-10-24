package reservation

import (
	"database/sql"
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"testing"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/stdlib"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func integrationDB(t *testing.T) *gorm.DB {
	t.Helper()
	dsn := os.Getenv("TEST_DATABASE_URL")
	if dsn == "" {
		t.Skip("TEST_DATABASE_URL is required for PostgreSQL integration")
	}
	cfg, err := pgx.ParseConfig(dsn)
	if err != nil {
		t.Fatal("invalid test database configuration")
	}
	rootSQL := sql.OpenDB(stdlib.GetConnector(*cfg))
	t.Cleanup(func() { rootSQL.Close() })
	schema := "reservation_test_" + uuid.New().String()[:8]
	if _, err = rootSQL.Exec("CREATE SCHEMA " + schema); err != nil {
		t.Fatal("cannot create isolated test schema:", err)
	}
	t.Cleanup(func() { rootSQL.Exec("DROP SCHEMA " + schema + " CASCADE") })
	cfg.RuntimeParams["search_path"] = schema + ",public"
	conn := sql.OpenDB(stdlib.GetConnector(*cfg))
	t.Cleanup(func() { conn.Close() })
	db, err := gorm.Open(postgres.New(postgres.Config{Conn: conn}), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})
	if err != nil {
		t.Fatal(err)
	}
	for _, file := range []string{"001_init.sql", "002_reservation_showcase.sql"} {
		body, err := os.ReadFile(filepath.Join("..", "..", "..", "migrations", file))
		if err != nil {
			t.Fatal(err)
		}
		if err = db.Exec(string(body)).Error; err != nil {
			t.Fatalf("migration %s: %v", file, err)
		}
	}
	return db
}
func TestPostgresAtomicStorageAndConcurrentReplay(t *testing.T) {
	db := integrationDB(t)
	repo := NewRepository(db)
	s := NewService(repo, nil, nil)
	s.now = fixedNow
	key := uuid.NewString()
	const attempts = 8
	var wg sync.WaitGroup
	receipts := make(chan *Receipt, attempts)
	errs := make(chan error, attempts)
	for i := 0; i < attempts; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			receipt, _, err := s.CreateWithKey(validRequest(), key)
			if err != nil {
				errs <- err
				return
			}
			receipts <- receipt
		}()
	}
	wg.Wait()
	close(errs)
	close(receipts)
	for err := range errs {
		t.Fatal(err)
	}
	code := ""
	for receipt := range receipts {
		if code == "" {
			code = receipt.BookingCode
		}
		if receipt.BookingCode != code {
			t.Fatal("concurrent retry returned another reservation")
		}
	}
	var count int64
	if err := db.Table("reservation").Count(&count).Error; err != nil || count != 1 {
		t.Fatalf("reservations: %d %v", count, err)
	}
	var notification struct {
		Status  string
		Payload string
		SentAt  sql.NullTime
	}
	if err := db.Table("notification").Take(&notification).Error; err != nil {
		t.Fatal(err)
	}
	var payload NotificationReceipt
	if err := json.Unmarshal([]byte(notification.Payload), &payload); err != nil {
		t.Fatal(err)
	}
	if notification.Status != "simulated" || payload.Mode != "mock" || notification.SentAt.Valid {
		t.Fatalf("notification is not explicitly simulated: %+v", notification)
	}
	changed := validRequest()
	changed.Notes = "changed"
	if _, _, err := s.CreateWithKey(changed, key); err != ErrIdempotencyConflict {
		t.Fatalf("want conflict, got %v", err)
	}
	if err := db.Exec(`CREATE FUNCTION fail_notification() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test notification failure'; END $$; CREATE TRIGGER fail_notification BEFORE INSERT ON notification FOR EACH ROW EXECUTE FUNCTION fail_notification();`).Error; err != nil {
		t.Fatal(err)
	}
	if _, _, err := s.CreateWithKey(validRequest(), uuid.NewString()); err != ErrStorage {
		t.Fatalf("want storage failure, got %v", err)
	}
	if err := db.Table("reservation").Count(&count).Error; err != nil || count != 1 {
		t.Fatalf("rollback failed: %d %v", count, err)
	}
}
