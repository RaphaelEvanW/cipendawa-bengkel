# Backend reservasi showcase

Go/Gin dan PostgreSQL menyimpan reservasi sungguhan. Notifikasi WhatsApp dicatat sebagai `simulated`, dengan `sent_at` kosong. Tidak ada pesan, biaya penyedia WhatsApp, atau panggilan n8n pada alur ini.

Semua cabang menerima Body Repair, Service, dan Sparepart & Variasi. Cabang adalah lokasi yang ingin dikunjungi pelanggan. Pekerjaan yang diteruskan ke Cianjur ditangani manual, tanpa mengubah cabang pilihan pada reservasi.

## Persiapan

- Go sesuai `go.mod` dan PostgreSQL lokal.
- Buat database kosong khusus showcase.
- Salin `.env.example` menjadi `.env`, lalu isi kredensial database lokal. Jangan commit file berisi password.
- Jalankan migration dari root repository dengan akun database yang sesuai:

```bash
psql -h localhost -U postgres -d cipendawa_showcase -v ON_ERROR_STOP=1 -f migrations/001_init.sql
psql -h localhost -U postgres -d cipendawa_showcase -v ON_ERROR_STOP=1 -f migrations/002_reservation_showcase.sql
```

`001` hanya untuk database kosong. Jika database sudah menggunakan `001`, jalankan `002` saja. `002` menambahkan cabang, layanan standar, field reservasi dan status simulasi; tidak menghapus reservasi lama. Migration dijalankan manual sekali, bukan setiap startup.

## Menjalankan

Dari `bengkel-backend`:

```bash
go run ./cmd
```

API default berada di `http://127.0.0.1:8080`. `GET /ping` memeriksa proses server. Hentikan menggunakan Ctrl+C.

Jika memakai instance terpisah yang disiapkan pada sesi pengembangan ini, kredensialnya ada di `.env.showcase` dan data PostgreSQL di root `.local/postgres`. Dari Git Bash:

```bash
ENV_FILE=.env.showcase go run ./cmd
```

File tersebut diabaikan Git. Instance ini hanya mendengarkan localhost pada port 55432. Hentikan database terpisah dengan:

```bash
"/c/Program Files/PostgreSQL/18/bin/pg_ctl.exe" -D ../.local/postgres stop -m fast
```

Frontend Next.js menggunakan route server `/api/reservations`. `BACKEND_API_URL` adalah konfigurasi server, default `http://127.0.0.1:8080/api`. Restart frontend setelah mengganti environment. Proxy membatasi body 16 KiB dan timeout 10 detik.

## API

`POST /api/reservations`, `Content-Type: application/json`, header `Idempotency-Key` berupa UUID baru untuk satu permintaan. Gunakan kembali UUID yang sama ketika mencoba ulang isian yang sama.

```json
{
  "service_code": "body_repair",
  "branch_code": "utama",
  "reservation_date": "2027-01-04",
  "preferred_period": "pagi",
  "customer_name": "Pelanggan Demo",
  "customer_phone": "081234567890",
  "customer_email": "",
  "customer_vehicle": "Toyota Avanza 2020",
  "notes": "Contoh kebutuhan perbaikan bodi"
}
```

Ganti tanggal contoh dengan Senin–Sabtu yang belum lewat. Kode layanan: `body_repair`, `service`, `sparepart`. Cabang: `utama`, `cianjur2`, `sukabumi`. Preferensi WIB: `pagi` 08.00–11.00, `siang` 11.00–14.00, `sore` 14.00–17.00. Rentang yang sudah berakhir hari ini ditolak. Tidak ada klaim kapasitas atau kepastian slot; status awal selalu `pending`.

```json
{
  "success": true,
  "message": "Reservasi tersimpan",
  "data": {
    "booking_code": "CPD...",
    "status": "pending",
    "notification": {
      "mode": "mock",
      "status": "simulated",
      "message": "Simulasi pesan WhatsApp ..."
    }
  }
}
```

Penyimpanan baru menghasilkan 201. Percobaan ulang identik menghasilkan 200 dan kode lama, tanpa menambah reservasi/notifikasi. UUID yang dipakai untuk isian berbeda menghasilkan 409. Validasi menghasilkan 422 dengan map `errors` per field; kegagalan penyimpanan menghasilkan 503 generik. JSON rusak, field tak dikenal, dan body terlalu besar ditolak.

Reservasi dan notifikasi simulasi disimpan dalam satu transaksi. Jika salah satu gagal, keduanya dibatalkan. Idempotensi disimpan di database, sehingga tetap berlaku setelah server dimuat ulang.

## Verifikasi

```bash
go test ./...
go vet ./...
```

Tes integrasi membutuhkan `TEST_DATABASE_URL` ke database PostgreSQL khusus testing yang sudah memakai kedua migration. Jangan gunakan database berisi data pribadi/produksi. Tes tanpa variabel tersebut melewati bagian integrasi secara eksplisit.

## Batas showcase

Hanya `/ping` dan `POST /api/reservations` terdaftar. Route login, admin, lookup reservasi berdasarkan nomor HP, jadwal lama, dan pengiriman notifikasi lama tidak diaktifkan. Kodenya dipertahankan sebagai riwayat, bukan fitur aktif. `NOTIFICATION_MODE` selain `mock` ditolak saat startup.

Database dan API lokal tidak membutuhkan penyedia berbayar. Hosting produksi, API WhatsApp sungguhan, panel admin, proteksi spam untuk layanan publik, dan proses konfirmasi tim belum termasuk tahap ini.
