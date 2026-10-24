# Bengkel Cipendawa

Website profil perusahaan untuk bengkel mobil Cipendawa Motor. Website membantu calon pelanggan mengenal bengkel, memahami layanan, melihat hasil pekerjaan, dan menemukan kontak serta lokasi untuk berkunjung.

## Arah Project

Fokus pengembangan adalah website publik yang memperkenalkan perusahaan dan layanan bengkel mobil, dengan reservasi online yang tersimpan di database lokal untuk showcase. Beranda saat ini tetap menyediakan kontak untuk bertanya tentang kebutuhan kendaraan dan rencana kunjungan.

Scope aktif, diperbarui 24 Oktober 2026:

- Kendaraan yang dilayani: mobil.
- Fokus konten: profil perusahaan dan layanan bengkel.
- WhatsApp, kontak, dan lokasi menjadi jalur pelanggan untuk menghubungi bengkel.
- Tiga WhatsApp dipisahkan berdasarkan Service, Body Repair, dan Sparepart & Variasi. Variasi menggunakan nomor Sparepart.
- Ringkasan layanan menggunakan konten statis untuk sekarang. Halaman detail layanan belum dibuat.
- Jam operasional Senin sampai Sabtu 08.00 sampai 17.00 WIB; Minggu tutup.
- Reservasi di `/reservasi` tersambung ke API Go dan PostgreSQL lokal; status awal pending.
- Panel admin masih dipertimbangkan dan belum diputuskan; reservasi tidak otomatis berarti panel admin ikut dibuat.
- WhatsApp menggunakan mock dengan status simulated. Tidak ada pesan keluar, penyedia berbayar, atau workflow n8n aktif.
- Halaman pengecekan status reservasi belum diminta kembali dan belum masuk rencana yang disepakati.
- Katalog produk tidak masuk scope. Informasi sparepart atau variasi dapat menjelaskan layanan yang memang tersedia, tanpa katalog jual beli.

Keputusan terbaru ini menjadi acuan ketika dokumentasi lama menyebut reservasi dibatalkan. Instruksi dokumentasi saja pada sesi sebelumnya telah digantikan oleh permintaan implementasi frontend tanggal 18 Oktober 2026. Backend dikerjakan setelah frontend.

## Konten Website Publik

- Identitas, profil, dan informasi perusahaan.
- Layanan bengkel mobil beserta penjelasan pekerjaan yang ditangani.
- Foto bengkel dan hasil pekerjaan.
- Testimoni atau reputasi bengkel yang sudah tersedia.
- Lokasi, tautan Google Maps, jam operasional, dan kontak.
- Akses ke WhatsApp atau kanal kontak resmi.

Pemilik project mengonfirmasi bahwa informasi perusahaan, kontak, foto, dan materi yang sudah tersedia adalah benar. Tiga pasangan foto before-after sudah tersedia di bengkel-frontend/public/images/before_after/ dan terhubung ke slider: Body Repair, Cat Ulang, dan Dent Removal. Gunakan materi asli; jangan membuat hasil pekerjaan, angka, atau testimoni pengganti.

## Alur Pengunjung

1. Mengenal Cipendawa Motor dan jenis layanan mobil yang ditangani.
2. Membaca profil, melihat foto, hasil pekerjaan, dan reputasi bengkel.
3. Memilih layanan yang relevan dengan kebutuhan kendaraan.
4. Menghubungi bengkel atau membuka petunjuk lokasi untuk berkunjung.

Keberhasilan website dinilai dari kemudahan memahami layanan, menemukan kontak atau lokasi, dan menyusun rencana kunjungan. Tautan Reservasi pada navigasi membuka `/reservasi`. Form memakai backend lokal tanpa akun dengan WhatsApp simulasi; lihat [frontend reservasi](docs/reservation-frontend.md).

## Reservasi dan WhatsApp Simulasi

1. Pelanggan memilih layanan dan cabang yang akan dikunjungi. Semua cabang menerima tiga kategori layanan.
2. Pelanggan mengisi nama, WhatsApp, serta email dan deskripsi mobil opsional.
3. Pelanggan memilih tanggal dan preferensi waktu, menambahkan keluhan opsional, lalu memeriksa ringkasan.
4. Tombol Simpan reservasi mengirim data melalui server Next.js ke API Go. Transaksi menyimpan reservasi beserta catatan notifikasi simulasi di PostgreSQL.
5. Respons menampilkan kode reservasi, status pending, dan penjelasan bahwa WhatsApp tidak dikirim. Jadwal tetap perlu dikonfirmasi tim.

Percobaan ulang identik memakai idempotency key yang sama dan tidak membuat reservasi ganda. API menolak data tidak valid, tanggal lampau, Minggu, serta periode yang telah berakhir pada hari berjalan, menggunakan waktu Jakarta. Jam operasional Senin–Sabtu 08.00–17.00 WIB. Kapasitas slot belum dimodelkan.

Cabang adalah lokasi kunjungan pelanggan. Pemindahan pekerjaan kompleks ke Cianjur dilakukan manual. Panel admin, pengiriman WhatsApp nyata, dan konfirmasi otomatis tidak termasuk tahap showcase lokal.

Screenshot pemilik menjadi referensi alur saja. Klaim garansi, layanan hari yang sama, konfirmasi 24 jam, dan pemesanan minimal 18 jam pada referensi bukan kebijakan bengkel.

## Kondisi Implementasi

Beranda sudah diarahkan ke informasi perusahaan, layanan statis, lokasi, dan pilihan WhatsApp. Repository juga masih memuat kode operasional dari scope sebelumnya.

| Bagian | Kondisi kode | Hubungan dengan scope sekarang |
| --- | --- | --- |
| Landing page | Navbar, hero, profil, Instagram, layanan, testimoni, lokasi, CTA, dan footer | Dasar website profil perusahaan |
| Daftar layanan | ServiceSection menampilkan ringkasan statis | Dapat dibaca tanpa backend; halaman detail belum dibuat |
| Navigasi dan CTA | Anchor layanan, lokasi, dan pilihan tiga WhatsApp | Mengarahkan pengunjung ke informasi dan kontak yang tersedia |
| Login dan layout admin | Login, sidebar, dan dashboard placeholder tersedia | Kode lama; keputusan panel admin masih terbuka |
| API backend | GET /ping dan POST /api/reservations aktif | Reservasi publik tersimpan; route operasional lama tidak didaftarkan |
| WhatsApp | Catatan notifikasi simulated disimpan dalam transaksi | Tidak ada webhook atau pengiriman nyata dari reservasi publik |
| Database dan ERD | PostgreSQL, migration 001 dan 002 | Penyimpanan reservasi, cabang, idempotency key, dan notifikasi simulasi |

Kontak, navigasi publik, dan jam operasional menggunakan data bersama di bengkel-frontend/lib/content/workshop.ts. Ringkasan layanan berada di komponen ServiceSection. Tidak ada pengambilan data layanan dari API pada beranda.

Feed Instagram menggunakan widget Elfsight 20629220-dcc2-4ddb-9846-817bfe7e1f51 dari pemilik project. Urutan konten setelah profil adalah Instagram, layanan, lalu testimoni. Feed membutuhkan JavaScript dan koneksi ke Elfsight.

Section testimoni menggunakan Google Reviews melalui widget Elfsight 2bb9cb75-042f-4397-aaf8-042019b45792 dari pemilik project. Daftar testimoni statis telah diganti; pengelolaan ulasan dan konfigurasi widget dilakukan di Elfsight.

### Materi yang Masih Perlu Dilengkapi

- Foto sebelum dan sesudah sudah terhubung dari folder Body_repair, Repaint, dan Dent di bengkel-frontend/public/images/before_after/. Frame portrait menampilkan foto utuh; lapisan sebelum menggunakan clipping agar skala tidak berubah saat digeser.
- Komponen perbandingan menyediakan kendali keyboard dan sentuh. Periksa kesesuaian pasangan foto dan tampilan di perangkat target setiap kali materi diganti.
- Halaman detail layanan masih merupakan pekerjaan berikutnya. Beranda mengarahkan pertanyaan ke WhatsApp yang sesuai.

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

Buka http://localhost:3000. Beranda dapat ditampilkan tanpa backend. Penyimpanan reservasi membutuhkan backend dan PostgreSQL. Contoh environment server frontend:

```dotenv
BACKEND_API_URL=http://127.0.0.1:8080/api
```

### Backend Reservasi Showcase

Pada 24 Oktober 2026, pemilik memilih penyimpanan reservasi sungguhan di PostgreSQL lokal dan WhatsApp simulasi. Semua cabang menerima semua kategori layanan. Cabang adalah lokasi kunjungan pelanggan; pemindahan pekerjaan ke Cianjur ditangani manual. Panel admin ditunda.

Form `/reservasi` menampilkan ringkasan sebelum tombol Simpan reservasi. Server Next.js meneruskan permintaan ke API Go; keberhasilan baru ditampilkan setelah transaksi database berhasil. Status awal pending. Percobaan ulang identik mengembalikan kode yang sama. Notifikasi berstatus simulated dan tidak dikirim ke WhatsApp atau n8n.

Cara menjalankan, migration 001+002, environment, kontrak API, dan tes ada di [README backend](bengkel-backend/README.md). Route aktif hanya GET /ping dan POST /api/reservations. Route operasional lama tetap tersimpan sebagai kode tetapi tidak didaftarkan.

## Prioritas Pengembangan

1. Evaluasi alur showcase dengan data uji dan aturan konfirmasi manual.
2. Siapkan konten rinci serta halaman detail layanan ketika materi siap.
3. Periksa tampilan HP, keyboard, pemuatan gambar, dan metadata sebelum rilis.
4. Tentukan database hosting, pembatasan trafik, dan perlindungan spam sebelum API dibuka ke publik.
5. Evaluasi WhatsApp nyata dan panel admin hanya ketika diperlukan.

Domain, hosting, dan cara pengelolaan konten setelah rilis belum diputuskan. Penundaan panel admin tidak berarti backend harus langsung dihapus; keputusan arsitektur mengikuti kebutuhan website publik.

## Di Luar Scope Saat Ini

Cek status reservasi publik, dashboard/kalender operasional, katalog produk, keranjang, checkout, pembayaran online, kasir, invoice, akuntansi, dan inventori belum masuk rencana yang disepakati. Panel admin masih belum diputuskan. Reservasi sudah tersimpan di backend lokal. Pengiriman WhatsApp nyata belum diaktifkan.

## Lisensi

Lihat [LICENSE](LICENSE).
