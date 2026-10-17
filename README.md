# Bengkel Cipendawa

Website profil perusahaan untuk bengkel mobil Cipendawa Motor. Website membantu calon pelanggan mengenal bengkel, memahami layanan, melihat hasil pekerjaan, dan menemukan kontak serta lokasi untuk berkunjung.

## Arah Project

Fokus pengembangan adalah website publik yang memperkenalkan perusahaan dan layanan bengkel mobil. Pelanggan menghubungi bengkel melalui kontak yang tersedia untuk bertanya tentang kebutuhan kendaraan dan rencana kunjungan.

Keputusan scope dikonfirmasi pemilik project pada 17 Oktober 2026:

- Kendaraan yang dilayani: mobil.
- Fokus konten: profil perusahaan dan layanan bengkel.
- WhatsApp, kontak, dan lokasi menjadi jalur pelanggan untuk menghubungi bengkel.
- Tiga WhatsApp tetap dipisahkan berdasarkan Service, Body Repair, dan Sparepart.
- Ringkasan layanan menggunakan konten statis untuk sekarang. Halaman detail layanan belum dibuat.
- Jam operasional Senin sampai Sabtu 08.00 sampai 17.00 WIB; Minggu tutup.
- Reservasi online dan pengecekan status dibatalkan dari scope saat ini.
- Panel admin ditunda tanpa komitmen jadwal pengembangan.
- Integrasi n8n dan notifikasi WhatsApp otomatis tidak diperlukan untuk scope saat ini.
- Katalog produk tidak masuk scope. Informasi sparepart atau variasi dapat menjelaskan layanan yang memang tersedia, tanpa katalog jual beli.

Keputusan ini menjadi acuan ketika dokumentasi lama atau kode yang masih tersimpan menggambarkan rencana reservasi dan admin.

## Konten Website Publik

- Identitas, profil, dan informasi perusahaan.
- Layanan bengkel mobil beserta penjelasan pekerjaan yang ditangani.
- Foto bengkel dan hasil pekerjaan.
- Testimoni atau reputasi bengkel yang sudah tersedia.
- Lokasi, tautan Google Maps, jam operasional, dan kontak.
- Akses ke WhatsApp atau kanal kontak resmi.

Pemilik project mengonfirmasi bahwa informasi perusahaan, kontak, foto, dan materi yang sudah tersedia adalah benar. Materi before-after belum ditambahkan dan menunggu aset dari pemilik. Jangan membuat hasil pekerjaan, angka, atau testimoni pengganti untuk mengisi kekosongan tersebut.

## Alur Pengunjung

1. Mengenal Cipendawa Motor dan jenis layanan mobil yang ditangani.
2. Membaca profil, melihat foto, hasil pekerjaan, dan reputasi bengkel.
3. Memilih layanan yang relevan dengan kebutuhan kendaraan.
4. Menghubungi bengkel atau membuka petunjuk lokasi untuk berkunjung.

Keberhasilan website dinilai dari kemudahan memahami layanan dan menemukan kontak atau lokasi. Pengunjung tidak perlu membuat akun maupun mengisi form reservasi.

## Kondisi Implementasi

Beranda sudah diarahkan ke informasi perusahaan, layanan statis, lokasi, dan pilihan WhatsApp. Repository juga masih memuat kode operasional dari scope sebelumnya.

| Bagian | Kondisi kode | Hubungan dengan scope sekarang |
| --- | --- | --- |
| Landing page | Navbar, hero, profil, testimoni, layanan, lokasi, CTA, dan footer sudah ada | Dasar website profil perusahaan |
| Daftar layanan | ServiceSection menampilkan ringkasan statis | Dapat dibaca tanpa backend; halaman detail belum dibuat |
| Navigasi dan CTA | Anchor layanan, lokasi, dan pilihan tiga WhatsApp | Mengarahkan pengunjung ke informasi dan kontak yang tersedia |
| Login dan layout admin | Login, sidebar, dan dashboard placeholder tersedia | Peninggalan scope sebelumnya; pengembangannya ditunda |
| API backend | Auth, layanan, jadwal, reservasi, notifikasi, dashboard, dan pengaturan tersedia | Tidak diperlukan oleh beranda statis; tersimpan dari implementasi lama |
| n8n | Pemanggilan webhook masih ada dalam kode reservasi/notifikasi | Integrasi otomatis tidak menjadi kebutuhan website saat ini |
| Database dan ERD | Skema operasional tersimpan | Dokumentasi implementasi yang masih ada, bukan target fitur publik |

Kontak, navigasi publik, dan jam operasional menggunakan data bersama di bengkel-frontend/lib/content/workshop.ts. Ringkasan layanan berada di komponen ServiceSection. Tidak ada pengambilan data layanan dari API pada beranda.

### Materi yang Masih Perlu Dilengkapi

- Pemilik perlu menambahkan tiga pasangan foto asli sebelum dan sesudah di bengkel-frontend/public/photos/beforeafter/: before1.jpg dan after1.jpg, before2.jpg dan after2.jpg, before3.jpg dan after3.jpg.
- Komponen perbandingan tetap tersedia untuk materi tersebut, dengan kendali keyboard dan sentuh. Foto belum lengkap; jangan menganggap galeri siap produksi sebelum seluruh pasangan tersedia dan diperiksa.
- Halaman detail layanan masih merupakan pekerjaan berikutnya. Beranda menjelaskan bahwa halaman tersebut belum tersedia dan mengarahkan pertanyaan ke WhatsApp yang sesuai.

## Teknologi dan Struktur

| Bagian | Teknologi |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| HTTP client | Axios |
| Backend yang masih tersedia | Go, Gin, GORM |
| Database backend | PostgreSQL |
| Auth admin yang masih tersedia | JWT dan bcrypt |

Versi dependensi mengacu pada bengkel-frontend/package.json, lockfile, dan bengkel-backend/go.mod. React Query dan shadcn tercantum sebagai dependensi frontend; keberadaannya tidak menjadikan panel admin atau alur data lain bagian dari scope aktif.

- bengkel-frontend/app/: halaman publik serta route admin lama.
- bengkel-frontend/components/layout/: section website publik.
- bengkel-frontend/lib/api/: API client, termasuk modul scope lama.
- bengkel-frontend/lib/content/workshop.ts: kontak, navigasi publik, dan jam operasional bersama.
- bengkel-frontend/public/: logo dan foto.
- bengkel-backend/cmd/main.go: entry point dan route API.
- bengkel-backend/internal/: modul backend.
- migrations/001_init.sql: skema dan seed database.
- bengkel_erd.html: diagram database.
- .opencode/skills/: skill antislop yang dipasang di project.

Backend umumnya memakai pola handler -> service -> repository. Dokumentasi frontend dan identitas visual tersedia di [README frontend](bengkel-frontend/README.md).

## Menjalankan Website Secara Lokal

Dari folder bengkel-frontend, jalankan:

```sh
npm install
npm run dev
```

Buka http://localhost:3000. Beranda dan ringkasan layanan dapat ditampilkan tanpa backend atau database. Jika menjalankan route lama yang masih memakai API, buat bengkel-frontend/.env.local:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### Menjalankan Backend yang Masih Ada

Backend memerlukan Go yang kompatibel dengan go.mod (deklarasi saat ini: Go 1.25.5), PostgreSQL, dan client psql.

Buat database bengkel_db, lalu jalankan dari root repository:

```sh
psql -U postgres -d bengkel_db -f migrations/001_init.sql
```

Migration ditujukan untuk database baru dan tidak idempotent. Backend tidak menjalankan migration otomatis. Seed mencakup akun admin dengan hash password bawaan dan pengaturan WhatsApp placeholder.

Buat bengkel-backend/.env:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=isi_password_database
DB_NAME=bengkel_db
JWT_SECRET=ganti_dengan_secret_yang_kuat
PORT=8080
```

Dari folder bengkel-backend, jalankan:

```sh
go run ./cmd
```

Backend berjalan di http://localhost:8080 dengan health check GET /ping. CORS saat ini mengizinkan origin http://localhost:3000.

Endpoint layanan publik adalah GET /api/services dan GET /api/services/:id. Backend juga masih mendaftarkan endpoint /api/auth/login, /api/book/*, /api/reservations*, dan /api/admin/* dari scope lama. Semua response menggunakan wrapper success, message, dan data.

n8n tidak diperlukan untuk website profil perusahaan. Pemanggilan webhook hardcoded http://localhost:5678/webhook/reservasi-baru masih terdapat dalam kode lama. Keberadaan route dan integrasi tersebut perlu diperhitungkan jika backend ikut dideploy.

## Prioritas Pengembangan

1. Lengkapi hasil pekerjaan dengan foto sebelum dan sesudah asli dari pemilik.
2. Siapkan konten rinci dan halaman detail layanan ketika materi siap.
3. Periksa tampilan di HP, akses keyboard, pemuatan gambar, dan metadata pencarian sebelum rilis.
4. Tentukan kebutuhan backend dan route yang akan disertakan sebelum deployment.

Domain, hosting, dan cara pengelolaan konten setelah rilis belum diputuskan. Penundaan panel admin tidak berarti backend harus langsung dihapus; keputusan arsitektur mengikuti kebutuhan website publik.

## Di Luar Scope Saat Ini

Reservasi online, cek status reservasi, kalender operasional untuk booking, panel admin, n8n, notifikasi otomatis, katalog produk, keranjang, checkout, pembayaran online, kasir, invoice, akuntansi, dan inventori.

## Lisensi

Lihat [LICENSE](LICENSE).
