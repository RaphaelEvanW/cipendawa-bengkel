# Bengkel Cipendawa

Website profil perusahaan untuk bengkel mobil Cipendawa Motor. Website membantu calon pelanggan mengenal bengkel, memahami layanan, melihat hasil pekerjaan, dan menemukan kontak serta lokasi untuk berkunjung.

## Arah Project

Fokus pengembangan adalah website publik yang memperkenalkan perusahaan dan layanan bengkel mobil, dengan reservasi online sebagai fitur yang direncanakan berikutnya. Beranda saat ini tetap menyediakan kontak untuk bertanya tentang kebutuhan kendaraan dan rencana kunjungan.

Keputusan scope dikonfirmasi pemilik project pada 17 Oktober 2026:

- Kendaraan yang dilayani: mobil.
- Fokus konten: profil perusahaan dan layanan bengkel.
- WhatsApp, kontak, dan lokasi menjadi jalur pelanggan untuk menghubungi bengkel.
- Tiga WhatsApp dipisahkan berdasarkan Service, Body Repair, dan Sparepart & Variasi. Variasi menggunakan nomor Sparepart.
- Ringkasan layanan menggunakan konten statis untuk sekarang. Halaman detail layanan belum dibuat.
- Jam operasional Senin sampai Sabtu 08.00 sampai 17.00 WIB; Minggu tutup.
- Reservasi online masuk kembali ke rencana pengembangan. Keputusan ini menggantikan pembatalan reservasi sebelumnya; form belum diimplementasikan di website publik.
- Panel admin masih dipertimbangkan dan belum diputuskan; reservasi tidak otomatis berarti panel admin ikut dibuat.
- Automation reservasi direncanakan mengirim informasi ke WhatsApp. Pada tahap testing, tujuan pengiriman adalah WA pribadi pemilik project; nomor dan penyedia integrasi belum diberikan.
- Halaman pengecekan status reservasi belum diminta kembali dan belum masuk rencana yang disepakati.
- Katalog produk tidak masuk scope. Informasi sparepart atau variasi dapat menjelaskan layanan yang memang tersedia, tanpa katalog jual beli.

Keputusan terbaru ini menjadi acuan ketika dokumentasi lama menyebut reservasi dibatalkan. Pembaruan saat ini hanya dokumentasi; CSS, JavaScript/TypeScript, HTML/JSX, backend, dan konfigurasi aplikasi tetap seperti sebelumnya.

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

Keberhasilan website saat ini dinilai dari kemudahan memahami layanan dan menemukan kontak atau lokasi. Beranda saat ini belum memiliki form reservasi dan tidak memerlukan akun. Form reservasi menjadi pengembangan berikutnya, mengikuti arah di bawah.

## Rencana Reservasi dan Automation WhatsApp

### Keputusan yang Sudah Dikonfirmasi

- Reservasi online akan dikembangkan untuk layanan bengkel mobil.
- Tiga screenshot dari pemilik menjadi referensi alur form tiga langkah. Screenshot adalah gambaran, bukan keputusan untuk menyalin warna, teks, daftar layanan, atau ketentuan bisnis contoh.
- Automation mengirim informasi reservasi ke WhatsApp; untuk testing, kirim ke WA pribadi pemilik project. Nomor testing belum diberikan dan tidak boleh diasumsikan sama dengan tiga nomor layanan publik.
- Panel admin masih dipertimbangkan. Belum ada keputusan untuk membuat dashboard maupun mewajibkan admin sebagai bagian dari alur reservasi.
- Pekerjaan saat ini hanya memperbarui Markdown. Jangan membuat form, route, CTA reservasi, automation, atau perubahan tampilan sebelum ada instruksi implementasi berikutnya.

### Gambaran Alur dari Referensi

| Langkah | Isi yang terlihat pada referensi | Status |
| --- | --- | --- |
| 1. Pilih layanan | Pilihan layanan dan opsi kebutuhan lain | Arah alur disetujui secara umum; jenis layanan rinci dan pilihan tunggal/jamak belum ditetapkan |
| 2. Data pelanggan | Nama, nomor telepon/WhatsApp, email opsional | Acuan field; validasi final belum ditentukan |
| 3. Kendaraan dan jadwal | Tahun, merek, model, tanggal/jam pilihan, keluhan opsional, ringkasan dan tombol kirim | Acuan field dan konfirmasi; field wajib serta aturan jadwal belum ditentukan |

Tombol kembali dan lanjut pada referensi menunjukkan perpindahan antar langkah. Reservasi yang dikirim perlu dibedakan dari jadwal yang sudah dikonfirmasi; mekanisme penerimaan dan konfirmasi bengkel masih perlu ditetapkan.

Identitas navy/lime website tetap menjadi acuan desain nanti. Klaim garansi, layanan hari yang sama, konfirmasi 24 jam, durasi pekerjaan, nomor telepon contoh, serta aturan pemesanan minimal 18 jam pada screenshot bukan kebijakan Cipendawa yang sudah disepakati.

### Arah Automation untuk Testing

Alur yang diinginkan: pelanggan mengirim form reservasi → data diterima sistem → automation mengirim ringkasan ke WA pribadi pemilik untuk testing. Alur ini masih rencana dan belum tersambung ke beranda.

Kebutuhan yang belum diputuskan:

- Nomor WA pribadi tujuan testing, penyedia/API WhatsApp, dan alat automation. n8n yang sudah ada di kode dapat dievaluasi; pengguna belum menetapkannya sebagai pilihan final.
- Penyimpanan data reservasi, kontrak API, format pesan, penanganan kegagalan kirim, serta pencegahan notifikasi ganda.
- Daftar layanan yang dapat direservasi, pilihan cabang, slot/kapasitas, jeda pemesanan, dan proses konfirmasi, perubahan, atau pembatalan.
- Perlu atau tidaknya balasan otomatis ke pelanggan dan tujuan WhatsApp saat produksi. Saat ini yang disepakati hanya tujuan pribadi pemilik untuk testing.

Jam operasional yang sudah dikonfirmasi tetap Senin sampai Sabtu 08.00 sampai 17.00 WIB, Minggu tutup. Aturan ketersediaan slot reservasi belum ditetapkan dan tidak boleh disimpulkan hanya dari jam operasional.

## Kondisi Implementasi

Beranda sudah diarahkan ke informasi perusahaan, layanan statis, lokasi, dan pilihan WhatsApp. Repository juga masih memuat kode operasional dari scope sebelumnya.

| Bagian | Kondisi kode | Hubungan dengan scope sekarang |
| --- | --- | --- |
| Landing page | Navbar, hero, profil, Instagram, layanan, testimoni, lokasi, CTA, dan footer | Dasar website profil perusahaan |
| Daftar layanan | ServiceSection menampilkan ringkasan statis | Dapat dibaca tanpa backend; halaman detail belum dibuat |
| Navigasi dan CTA | Anchor layanan, lokasi, dan pilihan tiga WhatsApp | Mengarahkan pengunjung ke informasi dan kontak yang tersedia |
| Login dan layout admin | Login, sidebar, dan dashboard placeholder tersedia | Kode lama; keputusan panel admin masih terbuka |
| API backend | Auth, layanan, jadwal, reservasi, notifikasi, dashboard, dan pengaturan tersedia | Beranda belum memakainya; perlu ditinjau sebelum digunakan untuk reservasi baru |
| n8n | Pemanggilan webhook masih ada dalam kode reservasi/notifikasi | Kandidat integrasi untuk rencana automation WhatsApp; belum dipilih atau diuji untuk alur baru |
| Database dan ERD | Skema operasional tersimpan | Bahan evaluasi penyimpanan reservasi; bukan bukti integrasi sudah berjalan |

Kontak, navigasi publik, dan jam operasional menggunakan data bersama di bengkel-frontend/lib/content/workshop.ts. Ringkasan layanan berada di komponen ServiceSection. Tidak ada pengambilan data layanan dari API pada beranda.

Feed Instagram menggunakan widget Zyff lbwI2zYe3hkE2g dari pemilik project. Urutan konten setelah profil adalah Instagram, layanan, lalu testimoni. Feed membutuhkan JavaScript dan koneksi ke Zyff.

Section testimoni menggunakan Google Reviews melalui widget Elfsight 2bb9cb75-042f-4397-aaf8-042019b45792 dari pemilik project. Daftar testimoni statis telah diganti; pengelolaan ulasan dan konfigurasi widget dilakukan di Elfsight.

### Materi yang Masih Perlu Dilengkapi

- Foto sebelum dan sesudah sudah terhubung dari folder Body_repair, Repaint, dan Dent di bengkel-frontend/public/images/before_after/. Frame portrait menampilkan foto utuh; lapisan sebelum menggunakan clipping agar skala tidak berubah saat digeser.
- Komponen perbandingan menyediakan kendali keyboard dan sentuh. Periksa kesesuaian pasangan foto dan tampilan di perangkat target setiap kali materi diganti.
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

Beranda saat ini dapat berjalan tanpa n8n. Pemanggilan webhook hardcoded http://localhost:5678/webhook/reservasi-baru masih terdapat dalam kode lama. Integrasi tersebut perlu dievaluasi sebelum dipakai untuk rencana automation WhatsApp; keberadaannya bukan bukti pesan sudah terkirim ke nomor testing. Keberadaan route dan integrasi tersebut juga perlu diperhitungkan jika backend ikut dideploy.

## Prioritas Pengembangan

1. Pada sesi implementasi berikutnya, tetapkan rincian form reservasi, jadwal, dan tujuan WA pribadi untuk testing berdasarkan referensi di atas.
2. Tinjau API reservasi dan integrasi lama, lalu tentukan penyimpanan serta jalur automation WhatsApp.
3. Siapkan konten rinci dan halaman detail layanan ketika materi siap.
4. Periksa tampilan di HP, akses keyboard, pemuatan gambar, dan metadata pencarian sebelum rilis.
5. Tentukan kebutuhan backend dan route yang akan disertakan sebelum deployment.

Domain, hosting, dan cara pengelolaan konten setelah rilis belum diputuskan. Penundaan panel admin tidak berarti backend harus langsung dihapus; keputusan arsitektur mengikuti kebutuhan website publik.

## Di Luar Scope Saat Ini

Cek status reservasi publik, dashboard/kalender operasional, katalog produk, keranjang, checkout, pembayaran online, kasir, invoice, akuntansi, dan inventori belum masuk rencana yang disepakati. Panel admin masih belum diputuskan. Reservasi online dan automation WhatsApp sudah masuk rencana, tetapi implementasinya belum dimulai pada pembaruan dokumentasi ini.

## Lisensi

Lihat [LICENSE](LICENSE).
