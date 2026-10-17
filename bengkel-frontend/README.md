# Cipendawa Motor: Frontend

Website publik untuk memperkenalkan perusahaan dan layanan bengkel mobil Cipendawa Motor. Pengunjung dapat mengenal bengkel, melihat foto serta hasil pekerjaan, membaca informasi layanan, lalu menghubungi bengkel atau membuka petunjuk lokasi.

Keputusan scope dan gambaran seluruh repository tersedia di [README utama](../README.md).

## Scope Aktif

- Profil perusahaan dan layanan bengkel mobil.
- Foto bengkel, hasil pekerjaan, dan testimoni yang tersedia.
- Alamat, Google Maps, jam operasional, dan kontak resmi.
- Akses ke WhatsApp atau kanal kontak yang sudah dipakai bengkel.

Tersedia tiga WhatsApp terpisah untuk Service, Body Repair, dan Sparepart. Jam operasional yang dikonfirmasi adalah Senin sampai Sabtu 08.00 sampai 17.00 WIB; Minggu tutup. Informasi layanan menggunakan konten statis untuk sekarang.

Reservasi, cek status, panel admin, n8n, dan katalog produk berada di luar scope saat ini. Kontak pelanggan dilakukan melalui kanal yang sudah tersedia. Pengunjung tidak perlu akun.

Pemilik project mengonfirmasi bahwa kontak, foto, dan informasi yang tersedia adalah benar. Materi before-after belum ditambahkan. Jangan menggantinya dengan foto atau hasil pekerjaan rekaan.

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

CSS mendeklarasikan Inter dengan fallback Arial, sans-serif dan radius dasar 8px. Deklarasi ini belum berarti font Inter sudah dimuat. Token warna status reservasi masih ada sebagai peninggalan scope sebelumnya.

## Implementasi Saat Ini

Beranda pada app/page.tsx merangkai navbar, hero, profil, testimoni, layanan, lokasi, CTA, dan footer.

ServiceSection menampilkan ringkasan statis Body Repair, Service, Sparepart, dan Variasi. Beranda tidak mengambil layanan dari API dan tidak memerlukan backend atau database. Kontak, navigasi publik, serta jam operasional bersumber dari lib/content/workshop.ts.

Navbar, hero, dan footer mengarah ke section layanan, lokasi, dan kontak yang tersedia. CTA menampilkan tiga WhatsApp berdasarkan layanan. Halaman detail /layanan belum dibuat; ringkasan di beranda menyebutkan keterbatasan tersebut dan mengarahkan pengunjung ke kontak yang sesuai. Reservasi dan cek status tidak dipromosikan pada website publik.

Menu mobile memiliki nama aksesibel, status buka/tutup, dan kendali Escape. Perbandingan foto dapat dioperasikan dengan tombol arah, Page Up/Down, Home, serta End; tombol pemilih foto memiliki label dan target sentuh yang lebih besar. Pemeriksaan tampilan dan interaksi di browser tetap diperlukan sebelum rilis.

Halaman /login, layout admin, sidebar, dashboard placeholder, hook auth, serta API client modul operasional masih tersimpan. Keberadaan file-file itu tidak menjadikannya target pengembangan aktif.

## Teknologi

- Next.js dengan App Router; package.json saat ini mendeklarasikan ^16.4.2.
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

Buka http://localhost:3000. Beranda dan informasi layanan dapat ditampilkan tanpa backend. Jika menjalankan route lama yang memakai API, jalankan backend mengikuti README utama dan buat .env.local:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

Backend saat ini mengizinkan CORS dari http://localhost:3000. Origin lain memerlukan konfigurasi yang sesuai.

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

- Baca [AGENTS.md](AGENTS.md) dan instruksi di root repository. Untuk API atau perilaku Next.js, baca panduan versi terpasang di node_modules/next/dist/docs/.
- Gunakan keputusan scope dalam README utama sebagai acuan ketika menemukan kode reservasi atau admin.
- Pertahankan informasi perusahaan, kontak, dan aset yang sudah dikonfirmasi pemilik.
- Buat CTA yang menjelaskan tindakan sebenarnya, seperti menghubungi bengkel atau membuka lokasi.
- Arahkan navigasi hanya ke halaman, section, atau kontak yang tersedia.
- Jelaskan jenis pekerjaan dan kebutuhan mobil yang dapat ditangani; katalog produk tidak diperlukan.
- Jika harga ditampilkan, jelaskan bahwa nilai itu estimasi dan dapat menyesuaikan kondisi kendaraan serta pekerjaan yang disepakati.
- Edit ringkasan layanan statis pada ServiceSection; kontak, navigasi, dan jam operasional pada lib/content/workshop.ts.
- Jaga keterbacaan, fokus keyboard, ukuran target sentuh, dan layout di HP.

## Pengingat Materi dan Halaman yang Belum Selesai

- Tambahkan foto asli before1.jpg/after1.jpg, before2.jpg/after2.jpg, dan before3.jpg/after3.jpg ke public/photos/beforeafter/. Path pada AboutSection sudah disiapkan untuk ketiga pasangan tersebut; materi masih menunggu pemilik.
- Periksa seluruh pasangan foto dan kendali perbandingan setelah aset ditambahkan. Galeri belum lengkap sebelum langkah ini selesai.
- Siapkan halaman detail layanan dan konten rinci ketika materi tersedia. Untuk sekarang, gunakan ringkasan pada section layanan dan kontak WhatsApp.
