# Company Profile Alignment Implementation Plan

> Catatan keputusan terbaru: dokumen ini merekam pekerjaan penyelarasan profil perusahaan yang sudah dilakukan. Pemilik kemudian memasukkan kembali reservasi online dan automation WhatsApp ke rencana, dengan WA pribadi sebagai tujuan testing; panel admin masih dipertimbangkan. Keputusan menghapus promosi reservasi di bawah adalah konteks historis, bukan pembatalan rencana terbaru. Lihat README utama untuk scope terkini. Pembaruan terbaru hanya dokumentasi dan tidak mengubah implementasi website.

**Goal:** Selaraskan website publik dengan keputusan pemilik: profil bengkel mobil, informasi layanan statis, dan tiga kontak WhatsApp sesuai layanan.

**Architecture:** Gunakan komponen Next.js yang sudah ada. Kontak, navigasi publik, dan jam operasional menggunakan satu modul data statis bersama. Informasi layanan tampil tanpa API; state client dibatasi pada menu dan perbandingan foto.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS.

**Spec:** Keputusan pemilik dalam percakapan 17 Oktober 2026 dan scope di README.md.

## Constraints

- Pertahankan identitas navy/lime dan data perusahaan yang sudah dikonfirmasi.
- Hapus promosi reservasi serta cek status dari website publik.
- Pertahankan tiga nomor WhatsApp Service, Body Repair, dan Sparepart yang sudah ada.
- Jam operasional Senin sampai Sabtu 08.00 sampai 17.00 WIB; Minggu tutup.
- Informasi layanan statis untuk sekarang; halaman detail layanan belum dibuat.
- Materi before-after menunggu pemilik; catat pengingat di dokumentasi tanpa membuat foto pengganti.
- Admin, backend lama, dan dependensi yang sudah diubah pemilik bukan target perubahan ini.

## Review Focus

- Tautan anchor harus menunjuk ke section nyata meskipun dibuka dari route lain.
- Tiga kontak harus mempertahankan label dan nomor masing-masing.
- Beranda harus menampilkan layanan tanpa backend, termasuk saat API tidak tersedia.
- Menu mobile harus punya nama, status, target sentuh, serta bisa ditutup lewat Escape.
- Perbandingan foto harus bisa dipakai dengan keyboard dan sentuh; foto tetap merupakan materi yang belum lengkap.

## Tasks

- [x] Tambahkan data bersama untuk kontak, navigasi publik, dan jam operasional.
- [x] Ganti layanan API dengan ringkasan statis berdasarkan kategori layanan yang sudah ada; jelaskan status halaman detail dan arahkan pertanyaan ke kontak.
- [x] Sesuaikan navbar, hero, CTA, footer, dan anchor; gunakan tiga WhatsApp pada section kontak.
- [x] Samakan jam di lokasi dan footer; rapikan aksesibilitas menu dan kendali foto.
- [x] Perbarui kedua README dengan keputusan terbaru dan pengingat foto.
- [x] Jalankan lint, TypeScript/build yang tersedia, pemeriksaan markup hasil render dan tautan, lalu review subagent pada diff yang relevan.

## Verification Approach

Perubahan berfokus pada konten, tautan, data statis, dan kontrol native. Tidak menambah framework atau tes yang menyalin struktur implementasi. Periksa output render nyata tanpa API, konsistensi WhatsApp/jam, dan kompilasi. Pemeriksaan browser hanya dilakukan jika permukaan browser dapat menjangkau localhost; jangan mengklaim hasil visual ketika tidak teramati.

## Verification Results

- Lint: exit 0, tanpa error; dua warning lama pada navigasi lib/api/auth.ts dan lib/api/axios.ts.
- TypeScript: tsc --noEmit --incremental false exit 0.
- Render beranda: layanan statis tampil, semua anchor menuju section yang tersedia, tepat tiga tujuan WhatsApp yang dikonfirmasi, jam lokasi/footer konsisten 17.00, dan semantik menu/slider tersedia.
- Kontras warna sumber: teks sekunder footer 9.13:1 dan teks navy pada tombol lime 15.90:1; keduanya lolos ambang teks normal. Kontras foto belum diukur dari hasil render browser.
- Build default Turbopack gagal menghubungkan proses CSS, baik di sandbox maupun di luar sandbox.
- Build Webpack: npm run build -- --webpack exit 0 di luar sandbox; kompilasi, TypeScript, dan prerender halaman statis berhasil. Percobaan Webpack di sandbox sempat ditolak ketika membuat direktori output .next/server/app/login.
- Review kode subagent: tidak ada temuan P1/P2 pada perubahan yang diperiksa.
- Visual dan interaksi browser belum diverifikasi; localhost tidak dapat dijangkau pada pemeriksaan sesi ini. Foto before-after tetap belum tersedia dan menunggu pemilik.
