# Bengkel Cipendawa

Website Bengkel Cipendawa untuk memperkenalkan bengkel, membangun kepercayaan pelanggan, menampilkan layanan dan produk, serta menerima pengajuan reservasi. Panel admin membantu bengkel mengelola reservasi dan jadwal operasional, sementara WhatsApp menjadi kanal komunikasi dengan pelanggan.

## Arah Project

**Kenali bengkelnya, percaya kualitasnya, lalu ajukan reservasi dengan mudah.**

Project ini bukan aplikasi kasir atau e-commerce. Tidak ada payment gateway, checkout, atau pembayaran online dalam scope saat ini. Produk ditampilkan sebagai katalog; pelanggan dapat bertanya atau membeli melalui komunikasi dengan bengkel atau datang langsung.

## Fitur Website Publik

Fitur yang dituju:

- Profil bengkel, lokasi/Google Maps, kontak, dan jam operasional.
- Foto bengkel dan galeri hasil pekerjaan.
- Reputasi melalui testimoni asli dan tautan review Google Maps.
- Daftar layanan dengan deskripsi dan estimasi harga.
- Katalog produk dengan foto, deskripsi, harga, dan status tersedia/habis.
- Form pengajuan reservasi tanpa akun pelanggan.
- Pengecekan status reservasi menggunakan kode booking atau nomor HP.
- Tombol chat WhatsApp.

Estimasi harga layanan bukan harga final. Harga akhir menyesuaikan kondisi kendaraan dan pekerjaan yang disepakati dengan pelanggan. Tampilan estimasi berupa rentang harga atau "mulai dari" masih perlu dikembangkan; model saat ini menyimpan satu nilai estimasi.

## Alur Reservasi

1. Pelanggan memilih layanan, tanggal, dan jam yang diinginkan.
2. Website memeriksa hari operasional, tanggal libur, dan kepadatan jadwal.
3. Pelanggan mengisi nama, nomor WhatsApp, kendaraan, dan catatan/keluhan.
4. Pengajuan disimpan dengan status `pending` dan kode booking.
5. Sistem mengirim pemberitahuan ke WhatsApp admin melalui integrasi n8n.
6. Admin menghubungi pelanggan untuk memastikan apakah jadwal bisa diterima atau menawarkan jadwal lain.
7. Setelah ada kesepakatan, admin memperbarui jadwal dan status di panel.

**Mengirim pengajuan tidak berarti jadwal langsung terkonfirmasi.** Konfirmasi dilakukan admin melalui WhatsApp. Data reservasi di panel admin tetap menjadi sumber data utama; kegagalan pengiriman notifikasi tidak boleh menghilangkan pengajuan.

### Jadwal Sibuk dan Tanggal Tutup

- **Normal:** pelanggan dapat mengajukan reservasi.
- **Sibuk/penuh:** pelanggan tetap boleh mengajukan, dengan peringatan bahwa jadwal belum pasti dan perlu konfirmasi admin.
- **Tutup/libur:** tanggal tidak tersedia untuk reservasi.

Contoh peringatan saat jadwal sibuk:

> Jadwal tanggal ini sedang padat. Kamu tetap bisa mengajukan reservasi. Admin akan menghubungi melalui WhatsApp untuk memastikan apakah masih bisa dilayani atau menawarkan jadwal lain.

Contoh pesan setelah pengajuan berhasil:

> Pengajuan berhasil. Jadwal belum dikonfirmasi. Tunggu admin menghubungi kamu melalui WhatsApp.

Backend saat ini tetap menerima pengajuan ketika kapasitas harian penuh dan mengirim penanda `is_over_capacity` ke webhook. Fitur penandaan sibuk secara manual masih merupakan rencana pengembangan.

### Status Reservasi

| Status | Arti |
| --- | --- |
| `pending` | Menunggu konfirmasi admin |
| `confirmed` | Jadwal sudah disepakati |
| `in_progress` | Kendaraan sedang dikerjakan |
| `done` | Pekerjaan selesai |
| `rejected` | Pengajuan ditolak |
| `cancelled` | Reservasi dibatalkan |

Alur umum: `pending → confirmed → in_progress → done`, dengan kemungkinan ditolak atau dibatalkan. Kode saat ini memvalidasi nilai status, tetapi belum membatasi transisi antarstatus.

## Rencana Panel Admin

### 1. Dashboard

- Jumlah pengajuan dan booking terkonfirmasi untuk hari ini, ditampilkan terpisah.
- Ringkasan reservasi menunggu, dikonfirmasi, dikerjakan, dan selesai.
- Daftar pelanggan yang dijadwalkan datang hari ini.
- Pengajuan yang belum dihubungi.
- Peringatan notifikasi WhatsApp gagal.

### 2. Reservasi

- Filter tanggal dan status.
- Detail pelanggan, kendaraan, layanan, dan keluhan.
- Penanda pengajuan yang masuk saat jadwal padat.
- Tombol chat WhatsApp dengan pesan awal.
- Konfirmasi, ubah jadwal, ubah status, dan tolak/batalkan reservasi.
- Catatan internal dan riwayat perubahan.
- Penanda "sudah dihubungi" yang terpisah dari status reservasi.

### 3. Kalender & Jadwal

- Jumlah pengajuan dan booking terkonfirmasi per tanggal.
- Detail reservasi saat tanggal dipilih.
- Penanda tanggal normal, sibuk, atau tutup.
- Pengaturan hari/jam operasional dan ambang kapasitas harian.
- Pengaturan libur per tanggal atau rentang tanggal.
- Penandaan sibuk manual, misalnya karena banyak pelanggan datang langsung.

### 4. Layanan

- Kelola nama, deskripsi, foto, estimasi harga, dan durasi layanan.
- Aktif/nonaktif layanan dan pengaturan urutan tampil.

### 5. Produk

- Kelola nama, kategori, foto, deskripsi, dan harga produk.
- Status tersedia/habis dan tampil/sembunyikan.
- Penanda produk unggulan.
- Tidak memerlukan stok angka, keranjang, checkout, atau pencatatan transaksi untuk versi awal.

### 6. Website & Pengaturan

- Profil, alamat, Maps, kontak, dan nomor WhatsApp admin.
- Banner, tentang bengkel, dan galeri.
- Testimoni dan tautan review.
- Pemantauan notifikasi dan pengiriman ulang yang gagal.
- Pengaturan akun/password admin.

Bagian di atas adalah arah fitur, bukan daftar fitur yang semuanya sudah selesai.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Backend | Go, Gin, GORM |
| Database | PostgreSQL |
| Autentikasi admin | JWT dan bcrypt |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| HTTP client | Axios |
| Dependensi pengelolaan data frontend | TanStack React Query (belum terpasang sebagai provider di aplikasi) |
| Integrasi notifikasi | Webhook n8n; workflow WhatsApp berada di luar repo |

## Struktur Repository

```text
.
├── bengkel-backend/
│   ├── cmd/main.go          # Entry point dan route API
│   ├── config/              # Konfigurasi environment
│   ├── internal/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── notification/
│   │   ├── reservation/
│   │   ├── schedule/
│   │   ├── service/
│   │   └── settings/
│   └── pkg/                 # Database, JWT, response helper
├── bengkel-frontend/
│   ├── app/                 # Halaman dan layout Next.js
│   └── lib/
│       ├── api/             # API client
│       └── types/           # Tipe data TypeScript
├── migrations/001_init.sql  # Skema dan seed database
└── bengkel_erd.html         # Diagram relasi database
```

Backend umumnya memakai pola `handler → service → repository`. Route admin dilindungi middleware JWT.

## Kondisi Implementasi Saat Ini

### Sudah Ada di Kode

- Login admin berbasis JWT.
- API pengelolaan layanan dan estimasi harga.
- Konfigurasi hari/jam operasional dan kapasitas harian.
- Pengelolaan tanggal tutup, termasuk bulk/rentang tanggal dan endpoint sinkronisasi libur nasional.
- Pengajuan reservasi, cek status, filter reservasi, perubahan status, dan log perubahan status.
- Penyimpanan preferensi alternatif jadwal pelanggan.
- Ringkasan dashboard dan grafik tujuh hari.
- Modul notifikasi dengan status dan retry.
- Pemanggilan webhook n8n saat reservasi dibuat.
- API client dan tipe data frontend.

### Belum Selesai / Perlu Dikembangkan

- UI publik dan panel admin; halaman utama masih template Next.js.
- Profil, galeri, dan pengelolaan reputasi/testimoni.
- Modul katalog produk.
- Kalender admin dan indikator sibuk manual.
- Perubahan jadwal reservasi setelah kesepakatan.
- Penanda pelanggan sudah dihubungi.
- Estimasi harga berbentuk rentang dan foto layanan.
- Integrasi notifikasi end-to-end ke WhatsApp admin.
- Penyatuan pemanggilan webhook reservasi dengan pencatatan di modul notifikasi.
- Pengaturan akun/password admin.

Keberadaan endpoint belum berarti seluruh fitur sudah diuji atau siap produksi.

## Menjalankan Secara Lokal

### Prasyarat

- Go yang kompatibel dengan `bengkel-backend/go.mod` (deklarasi saat ini: Go 1.25.5).
- Node.js yang kompatibel dengan Next.js 16 dan npm.
- PostgreSQL dan client `psql`.
- n8n beserta workflow WhatsApp jika ingin menguji notifikasi.

### 1. Database

Buat database `bengkel_db`, kemudian jalankan dari root repository:

```sh
psql -U postgres -d bengkel_db -f migrations/001_init.sql
```

Migration ini ditujukan untuk database baru dan tidak idempotent. Backend tidak menjalankan migration otomatis. Seed mencakup konfigurasi bengkel, pengaturan WhatsApp placeholder, dan akun admin dengan hash password bawaan; ganti kredensial tersebut sebelum deployment.

### 2. Backend

Buat file `bengkel-backend/.env`:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=isi_password_database
DB_NAME=bengkel_db
JWT_SECRET=ganti_dengan_secret_yang_kuat
PORT=8080
```

Jalankan dari direktori `bengkel-backend`:

```sh
go run ./cmd
```

Backend tersedia di `http://localhost:8080`. Health check: `GET /ping`.

### 3. Frontend

Buat file `bengkel-frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

Jalankan dari direktori `bengkel-frontend`:

```sh
npm install
npm run dev
```

Frontend tersedia di `http://localhost:3000`.

> Middleware CORS belum dikonfigurasi di backend. Integrasi API dari browser pada origin berbeda perlu konfigurasi CORS atau proxy sebelum dapat digunakan.

### 4. Notifikasi

URL webhook saat ini masih hardcoded:

```text
http://localhost:5678/webhook/reservasi-baru
```

Workflow n8n, kredensial/provider WhatsApp, dan penentuan penerima admin tidak disertakan dalam repository. Pengiriman WhatsApp harus dikonfigurasi dan diuji secara terpisah. URL webhook perlu dipindahkan ke konfigurasi environment sebelum deployment.

## Ringkasan API

Base path: `/api`.

### Publik

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `POST` | `/auth/login` | Login admin |
| `GET` | `/services` | Daftar layanan aktif |
| `GET` | `/services/:id` | Detail layanan |
| `GET` | `/book/config` | Konfigurasi operasional |
| `POST` | `/book/availability` | Cek ketersediaan/kepadatan |
| `POST` | `/reservations` | Ajukan reservasi |
| `POST` | `/reservations/status` | Cek status dengan kode booking/nomor HP |

### Admin

Endpoint di bawah `/api/admin` memerlukan header `Authorization: Bearer <access_token>` dan mencakup:

- `/services`: pengelolaan layanan.
- `/book/config`, `/book/closures`, `/book/sync-holidays`: jadwal dan libur.
- `/reservations`: daftar/detail reservasi, perubahan status, hapus, dan log.
- `/notifications`: daftar, notifikasi per reservasi, dan retry.
- `/dashboard/summary`, `/dashboard/chart`: ringkasan dan grafik.
- `/settings`: baca dan ubah pengaturan.

Response menggunakan wrapper `success`, `message`, dan `data`.

## Prioritas Pengembangan

1. Website publik: profil/reputasi, layanan, form reservasi, dan cek status.
2. Panel admin: dashboard, reservasi, kalender, dan pengaturan jadwal.
3. Konfirmasi lewat WhatsApp, perubahan jadwal, dan notifikasi yang dapat dipantau.
4. Katalog produk tanpa checkout.
5. Pengelolaan konten website dan penguatan keamanan, validasi, serta pengujian.

## Catatan Sebelum Produksi

- Ganti JWT secret default dan kredensial admin bawaan.
- Perbaiki parsing jam pada cek availability dan validasi jam operasional saat membuat reservasi.
- Samakan perilaku waktu/tanggal dengan zona waktu operasional bengkel.
- Konfigurasikan CORS/proxy, koneksi database aman, dan URL integrasi.
- Lengkapi penanganan error, timeout HTTP, pencatatan notifikasi, dan pengujian.
- Tinjau privasi endpoint cek status berbasis nomor HP serta perlindungan terhadap spam/penyalahgunaan.

## Di Luar Scope Saat Ini

- Payment gateway dan pembayaran online.
- Keranjang belanja dan checkout produk.
- Kasir, invoice, serta akuntansi.
- Manajemen stok/inventori detail.
- Penugasan mekanik dan multi-cabang.

## Lisensi

Lihat [LICENSE](LICENSE).
