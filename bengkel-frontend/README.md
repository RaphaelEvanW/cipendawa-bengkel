# Cipendawa Motor: Frontend

Website publik untuk memperkenalkan perusahaan dan layanan bengkel mobil Cipendawa Motor. Pengunjung dapat mengenal bengkel, melihat foto serta hasil pekerjaan, membaca informasi layanan, lalu menghubungi bengkel atau membuka petunjuk lokasi.

Keputusan scope dan gambaran seluruh repository tersedia di [README utama](../README.md).

## Scope Aktif

- Profil perusahaan dan layanan bengkel mobil.
- Foto bengkel, hasil pekerjaan, dan testimoni yang tersedia.
- Alamat, Google Maps, jam operasional, dan kontak resmi.
- Akses ke WhatsApp atau kanal kontak yang sudah dipakai bengkel.

Tersedia tiga WhatsApp terpisah untuk Service, Body Repair, dan Sparepart & Variasi. Kebutuhan variasi menggunakan nomor WhatsApp Sparepart. Jam operasional yang dikonfirmasi adalah Senin sampai Sabtu 08.00 sampai 17.00 WIB; Minggu tutup. Informasi layanan menggunakan konten statis untuk sekarang.

Reservasi tersedia di `/reservasi` dengan tiga langkah dan ringkasan. Tanpa konfigurasi backend, form berjalan sebagai simulasi di browser dan tidak menyimpan data. Dengan backend aktif, route server Next.js meneruskan data ke API Go dan PostgreSQL. Respons sukses backend menampilkan kode dan status pending; notifikasi WhatsApp berstatus simulated tanpa pengiriman sungguhan. Panel admin ditunda.

## Reservasi Showcase

- Tiga layanan: Body Repair, Service, dan Sparepart & Variasi. Semua cabang menerima ketiganya.
- Cabang dipilih sebagai lokasi kunjungan. Pemindahan pekerjaan kompleks ke Cianjur ditangani manual.
- Form mengumpulkan nama, WhatsApp, email dan kendaraan opsional, tanggal, preferensi waktu, serta keluhan opsional.
- Ringkasan ditampilkan sebelum langkah akhir. Dalam mode demo, hasil berlabel Simulasi reservasi dan kode berawalan DEMO; tidak ada permintaan ke API, penyimpanan browser, database, atau pengiriman WhatsApp.
- Dalam mode backend, keberhasilan baru muncul setelah API menyimpan reservasi dan catatan notifikasi dalam satu transaksi.
- Status awal pending; preferensi waktu bukan jaminan slot. WhatsApp simulated berarti tidak ada pesan sungguhan.
- Percobaan ulang dengan data dan idempotency key sama mengembalikan kode semula. Isian yang belum disimpan tetap berada di memori halaman.
- Panel admin dan integrasi WhatsApp berbayar tidak termasuk tahap lokal ini.

Detail alur ada di [dokumentasi reservasi](../docs/reservation-frontend.md), setup API dan database di [README backend](../bengkel-backend/README.md).

Pemilik project mengonfirmasi bahwa kontak, foto, dan informasi yang tersedia adalah benar. Materi before-after sudah ditambahkan di public/images/before_after/ dan terhubung ke slider. Gunakan foto asli yang tersedia.

## Identitas Visual

Identitas yang sudah ada mengikuti visual Instagram bengkel: navy gelap, lime, putih, dan brand blue sebagai warna tambahan. Palet ini menjadi acuan untuk menjaga kesinambungan dengan identitas bengkel.

Sumber token: [app/globals.css](app/globals.css).

| Token | Hex | Penggunaan |
| --- | --- | --- |
| navy / background | #0B0F24 | Background utama |
| navy-light | #0F1533 | Variasi permukaan dan section |
| navy-medium | #1A2040 | Permukaan tambahan |
| lime | #BCFF61 | Aksi penting dan aksen brand |
| lime-dark | #A0E040 | Variasi interaksi |
| brand-blue | #2219B4 | Aksen tambahan |
| foreground | #FFFFFF | Teks utama |

Gunakan lime untuk mengarahkan perhatian ke aksi penting. Foto bengkel dan pekerjaan asli membantu pengunjung mengenali perusahaan serta pekerjaan yang ditangani. Layout dan jarak antarelemen perlu membantu pengunjung membaca informasi layanan dan kontak di HP.

Font website memakai Arial dengan fallback Helvetica Neue dan sans-serif, tanpa bergantung pada font eksternal. Radius dasar 8px. Token warna status reservasi masih tersimpan dari implementasi sebelumnya; penggunaannya pada rencana baru belum ditetapkan.

## Implementasi Saat Ini

Beranda pada app/page.tsx merangkai navbar, hero, profil, Instagram, layanan, testimoni, lokasi, CTA, dan footer. InstagramSection memuat widget Elfsight 20629220-dcc2-4ddb-9846-817bfe7e1f51 melalui https://elfsightcdn.com/platform.js setelah hidrasi. Script yang sama juga digunakan section Google Reviews. Feed membutuhkan koneksi ke Elfsight dan JavaScript pengunjung.

TestimonialSection menampilkan Google Reviews melalui widget Elfsight 2bb9cb75-042f-4397-aaf8-042019b45792 dari pemilik project, menggantikan daftar testimoni statis. Script https://elfsightcdn.com/platform.js dimuat setelah hidrasi dan widget menggunakan pemuatan lazy bawaan Elfsight. Konten ulasan serta tampilannya dikelola melalui Elfsight; widget membutuhkan JavaScript dan koneksi ke layanan tersebut.

ServiceSection menampilkan tiga ringkasan statis: Body Repair, Service, serta Sparepart & Variasi. Beranda tidak mengambil layanan dari API dan tidak memerlukan backend atau database. Kontak, navigasi publik, serta jam operasional bersumber dari lib/content/workshop.ts.

Foto layanan menggunakan public/images/layanan/body_repair.png, service.png, dan sparepart_variasi.png. Pada desktop, pengantar section mengikuti scroll di kolom kiri, sementara foto dan informasi tiap layanan tampil di kanan. Pada HP, foto tetap menjadi latar dengan teks di atasnya seperti desktop; ukuran dan susunan menyesuaikan ruang. Foto dimuat melalui next/image sesuai ukuran layar.

Navbar dan footer menyediakan tautan `/reservasi` melalui navigasi bersama. Hero dan CTA kontak tetap menyediakan jalur layanan, lokasi, serta tiga WhatsApp. Halaman detail /layanan belum dibuat; informasi layanan tersedia di beranda. Cek status publik belum diminta kembali.

Menu mobile memiliki nama aksesibel, status buka/tutup, dan kendali Escape. Perbandingan foto dapat dioperasikan dengan tombol arah, Page Up/Down, Home, serta End; tombol pemilih foto memiliki label dan target sentuh yang lebih besar. Pemeriksaan tampilan dan interaksi di browser tetap diperlukan sebelum rilis.

Halaman /login, layout admin, sidebar, dashboard placeholder, hook auth, serta API client modul operasional masih tersimpan. Panel admin belum diputuskan. Reservasi publik memakai lib/api/booking.ts dan route server app/api/reservations/route.ts. Modul admin lama tidak digunakan oleh alur ini.

## Teknologi

- Next.js dengan App Router; package.json saat ini mendeklarasikan ^16.4.3.
- React dan React DOM 19.2.4, serta TypeScript.
- Tailwind CSS 4 dan Lucide React.
- Axios masih tersedia untuk API client dari scope lama; beranda memakai konten statis.
- TanStack React Query dan shadcn tercantum sebagai dependensi; lihat penggunaan nyata sebelum menambah pola baru.

Versi dependensi terpasang mengacu pada lockfile. Perubahan versi perlu mengikuti kebutuhan implementasi dan kompatibilitas project.

## Struktur Frontend

| Lokasi | Isi |
| --- | --- |
| app/page.tsx | Beranda publik |
| app/layout.tsx | Root layout, metadata, dan bahasa dokumen |
| app/globals.css | Token warna dan style global |
| app/(public)/layout.tsx | Layout route publik |
| components/layout/ | Section website publik |
| public/logo/ dan public/photos/ | Logo dan materi visual |
| public/images/before_after/ | Pasangan foto Body_repair, Repaint, dan Dent |
| lib/content/workshop.ts | Kontak, jam operasional, dan navigasi publik bersama |
| components/layout/ServiceSection.tsx | Ringkasan layanan statis |
| lib/api/services.ts | API client layanan dari implementasi lama |
| lib/api/axios.ts dan lib/types/ | Konfigurasi HTTP client dan kontrak data |
| app/login/, app/(admin)/, components/admin/ | Login, layout, dashboard, dan sidebar dari scope lama |
| lib/api/ | Juga memuat API client scope lama |

## Menjalankan Secara Lokal

Dari direktori bengkel-frontend:

```sh
npm install
npm run dev
```

Buka http://localhost:3000. Beranda dan simulasi reservasi dapat digunakan tanpa backend. Untuk memaksa demo meskipun URL backend sudah ada di `.env.local`, gunakan:

```dotenv
RESERVATION_MODE=demo
```

Untuk menyimpan reservasi, jalankan backend dan PostgreSQL mengikuti README backend, lalu atur `.env.local`:

```dotenv
RESERVATION_MODE=backend
BACKEND_API_URL=http://127.0.0.1:8080/api
```

URL backend hanya digunakan di server Next.js. Dalam mode backend, browser mengirim ke route same-origin `/api/reservations`. Jika backend tidak tersedia, form mempertahankan isian dan menampilkan error; tidak ada pengalihan diam-diam ke demo.

### Deploy frontend di Vercel

Pilih Root Directory `bengkel-frontend`. Untuk showcase tanpa server Go atau PostgreSQL, atur `RESERVATION_MODE=demo` di environment Vercel lalu deploy. Jika kedua variabel belum diatur, mode demo juga aktif secara otomatis. Jika hanya `BACKEND_API_URL` yang diatur, form memakai backend untuk menjaga kompatibilitas konfigurasi lokal sebelumnya. Setelah mengubah mode atau URL pada Vercel, lakukan redeploy.

Perintah yang tersedia:

```sh
npm run lint
npm run build
npm run start
```

npm run start digunakan setelah build berhasil.

Jika Turbopack gagal memulai atau menghubungkan proses CSS pada lingkungan lokal, gunakan opsi build Webpack bawaan Next.js:

```sh
npm run build -- --webpack
```

## Acuan Pengembangan

- Untuk API atau perilaku Next.js, baca panduan versi terpasang di node_modules/next/dist/docs/.
- Gunakan keputusan scope dalam README utama sebagai acuan ketika menemukan kode reservasi atau admin.
- Pertahankan informasi perusahaan, kontak, dan aset yang sudah dikonfirmasi pemilik.
- Buat CTA yang menjelaskan tindakan sebenarnya, seperti menghubungi bengkel atau membuka lokasi.
- Arahkan navigasi hanya ke halaman, section, atau kontak yang tersedia.
- Jelaskan jenis pekerjaan dan kebutuhan mobil yang dapat ditangani; katalog produk tidak diperlukan.
- Jika harga ditampilkan, jelaskan bahwa nilai itu estimasi dan dapat menyesuaikan kondisi kendaraan serta pekerjaan yang disepakati.
- Edit ringkasan layanan statis pada ServiceSection; kontak, navigasi, dan jam operasional pada lib/content/workshop.ts.
- Jaga keterbacaan, fokus keyboard, ukuran target sentuh, dan layout di HP.

## Foto Before-After dan Pekerjaan Berikutnya

- Body Repair memakai Body_repair/repair_before.jpg dan Body_repair/repair_after.jpg.
- Cat Ulang memakai Repaint/before_repaint.jpg dan Repaint/after_repaint.jpg.
- Dent Removal memakai Dent/dent_before.jpg dan Dent/dent_after.jpg.
- Semua path di atas relatif terhadap public/images/before_after/. Pasangan diatur pada AboutSection, dengan frame portrait 4:5 dan object-contain agar foto tidak terpotong. Lapisan sebelum memakai clip-path sehingga gambar tidak mengecil ketika slider digeser.
- Section dapat dibuka langsung melalui /#hasil-pekerjaan. Periksa kontrol geser, keyboard, dan pergantian kategori setelah mengganti materi.
- Siapkan halaman detail layanan dan konten rinci ketika materi tersedia. Untuk sekarang, gunakan ringkasan pada section layanan dan kontak WhatsApp.
