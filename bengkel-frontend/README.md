# Cipendawa Motor — Frontend

Frontend website Bengkel Cipendawa untuk memperkenalkan bengkel, menampilkan reputasi, layanan dan katalog produk, serta menerima pengajuan reservasi. Panel admin membantu mengelola pengajuan dan jadwal operasional; komunikasi dan konfirmasi pelanggan dilakukan melalui WhatsApp.

Gambaran seluruh project dan setup backend tersedia di [README utama](../README.md).

## Arah Produk

**Kenali bengkelnya, percaya kualitasnya, lalu ajukan reservasi dengan mudah.**

- Website publik mengutamakan kepercayaan pelanggan dan kemudahan reservasi.
- Layanan menampilkan estimasi harga, bukan harga final pekerjaan.
- Produk ditampilkan sebagai katalog dengan keterangan tersedia/habis. Pembelian atau pertanyaan diarahkan ke WhatsApp atau kunjungan langsung.
- Reservasi tidak memerlukan akun pelanggan.
- Tidak ada payment gateway, keranjang, checkout, atau pembayaran online dalam scope saat ini.

## Identitas Visual

Palet yang sudah ada menjadi dasar pengembangan berikutnya. Arahnya mengikuti identitas visual Instagram bengkel: **navy gelap, aksen lime, putih, dan brand blue sebagai warna tambahan**. Jangan mengganti palet dengan tema generik tanpa kesepakatan.

Sumber token warna: [`app/globals.css`](app/globals.css).

| Token | Hex | Panduan penggunaan |
| --- | --- | --- |
| `navy` / `background` | `#0B0F24` | Background utama |
| `navy-light` | `#0F1533` | Section, card, dan variasi permukaan |
| `navy-medium` | `#1A2040` | Permukaan tambahan dan pembeda elemen |
| `lime` | `#BCFF61` | CTA utama, highlight, dan aksen brand |
| `lime-dark` | `#A0E040` | Variasi aksen/interaksi |
| `brand-blue` | `#2219B4` | Aksen tambahan, tidak menggantikan lime sebagai fokus utama |
| `foreground` | `#FFFFFF` | Teks utama |

### Prinsip Tampilan

- Pertahankan konsistensi identitas antara website publik dan panel admin.
- Gunakan lime secara terarah untuk aksi penting, bukan seluruh elemen.
- Utamakan foto bengkel dan hasil pekerjaan asli untuk membangun kepercayaan.
- Buat tampilan responsif dan nyaman di HP, terutama form reservasi dan tombol WhatsApp.
- Pastikan teks, tombol, dan status mudah dibaca; jangan mengandalkan warna saja untuk menyampaikan informasi.
- Panel admin mengutamakan keterbacaan dan efisiensi, bukan efek dekoratif berlebihan.
- Pakai token Tailwind seperti `bg-navy`, `text-lime`, dan `bg-brand-blue` agar warna tidak tersebar sebagai nilai hardcoded.

CSS saat ini menetapkan font `Inter` dengan fallback `Arial, sans-serif` dan radius dasar `8px`. Deklarasi font tersebut belum berarti file/font Inter sudah dimuat; pastikan pemuatan font saat merapikan desain.

### Warna Status

Warna status memiliki fungsi semantik dan bukan pengganti palet brand:

| Status | Token | Hex |
| --- | --- | --- |
| Menunggu | `status-pending` | `#F59E0B` |
| Dikonfirmasi | `status-confirmed` | `#3B82F6` |
| Dikerjakan | `status-in-progress` | `#8B5CF6` |
| Selesai | `status-done` | `#10B981` |
| Ditolak | `status-rejected` | `#EF4444` |
| Dibatalkan | `status-cancelled` | `#6B7280` |

## Website Publik yang Dituju

- Beranda: profil, foto/hasil pekerjaan, reputasi, layanan, lokasi, dan CTA.
- Layanan: deskripsi, estimasi harga, dan durasi jika diperlukan.
- Produk: foto, deskripsi, harga atau "Hubungi untuk harga", dan ketersediaan.
- Pengajuan reservasi: layanan, jadwal, nama, nomor WhatsApp, kendaraan, dan keluhan.
- Hasil pengajuan: kode booking, ringkasan, dan pemberitahuan bahwa jadwal belum dikonfirmasi.
- Cek status: menggunakan kode booking atau nomor HP.
- Akses cepat ke WhatsApp dan Google Maps.

Gunakan testimoni/review asli. Data contoh yang dipakai selama pengembangan tidak boleh ditampilkan sebagai klaim pelanggan nyata saat produksi.

## Perilaku Reservasi

```text
Pilih layanan dan jadwal
    ↓
Cek hari operasional, libur, dan kepadatan
    ↓
Isi data pelanggan dan kendaraan
    ↓
Kirim pengajuan → tersimpan dengan status pending
    ↓
Backend memberi notifikasi ke WhatsApp admin melalui n8n
    ↓
Admin menghubungi pelanggan dan menyepakati jadwal
```

### Jadwal Sibuk Tetap Bisa Diajukan

Jika kapasitas tanggal yang dipilih penuh, tampilkan peringatan tetapi jangan otomatis memblokir pengajuan:

> Jadwal tanggal ini sedang padat. Kamu tetap bisa mengajukan reservasi. Admin akan menghubungi melalui WhatsApp untuk memastikan apakah masih bisa dilayani atau menawarkan jadwal lain.

Bedakan kondisi sibuk dari tutup/libur:

- **Sibuk:** pengajuan tetap diizinkan, dengan peringatan.
- **Tutup/libur:** tanggal tidak dapat digunakan untuk reservasi.

Respons availability saat ini sama-sama memakai `available: false` untuk kondisi penuh maupun tidak beroperasi. Jangan memakai nilai ini sendirian untuk menonaktifkan submit. Sebaiknya backend menyediakan kode alasan yang terstruktur agar frontend dapat membedakan kondisi tanpa bergantung pada teks pesan.

Setelah submit berhasil:

> Pengajuan berhasil. Jadwal belum dikonfirmasi. Tunggu admin menghubungi kamu melalui WhatsApp.

Jangan menampilkan pesan "booking terkonfirmasi" sebelum admin menyetujuinya. Notifikasi WhatsApp diproses di backend/integrasi, bukan dikirim langsung oleh browser pelanggan.

## Rencana Panel Admin

| Menu | Fokus |
| --- | --- |
| Dashboard | Pengajuan hari ini, booking terkonfirmasi, pelanggan yang akan datang, dan pengajuan belum dihubungi |
| Reservasi | Filter tanggal/status, detail, chat WhatsApp, konfirmasi, perubahan jadwal/status, dan riwayat |
| Kalender & Jadwal | Jumlah pengajuan/booking per tanggal, indikator sibuk/libur, jam operasional, kapasitas, dan tanggal tutup |
| Layanan | Kelola deskripsi, foto, estimasi harga, durasi, dan status aktif |
| Produk | Kelola katalog, harga, foto, tersedia/habis, dan tampil/sembunyikan |
| Website & Pengaturan | Profil, kontak, galeri, testimoni, notifikasi, dan akun admin |

Jumlah **pengajuan** dan **booking terkonfirmasi** perlu ditampilkan terpisah. Penanda **sudah dihubungi** juga terpisah dari status reservasi: pelanggan bisa sudah dichat tetapi belum menyepakati jadwal.

## Kondisi Implementasi

### Sudah Ada

- Landing page dengan navbar, hero, profil/hasil pekerjaan, testimoni, layanan, lokasi, CTA, dan footer.
- Palet warna dan token status di `app/globals.css`.
- Halaman login, hook autentikasi, layout admin, dan sidebar.
- API client untuk auth, layanan, reservasi, jadwal, dashboard, notifikasi, dan pengaturan.
- Tipe data TypeScript dan helper frontend.

### Belum Selesai

- Halaman dashboard masih berupa placeholder.
- Form reservasi dan halaman cek status end-to-end.
- Pengelolaan reservasi dan kalender admin.
- Integrasi seluruh tampilan dengan data API nyata.
- Katalog produk dan pengelolaannya; backend produk belum tersedia.
- Pengelolaan konten, foto, dan reputasi dari panel admin.
- Fitur perubahan jadwal, penanda sudah dihubungi, dan sibuk manual memerlukan dukungan backend.

Keberadaan komponen atau API client tidak berarti alur tersebut sudah terintegrasi, diuji, atau siap produksi.

## Teknologi

- Next.js `16.2.9` dengan App Router.
- React `19.2.4` dan TypeScript.
- Tailwind CSS 4.
- Axios untuk HTTP client.
- Lucide React untuk ikon.
- TanStack React Query dan shadcn sudah tercantum sebagai dependensi; penggunaannya perlu dicek/dilengkapi sesuai fitur.

## Struktur Frontend

```text
app/
├── layout.tsx               # Root layout dan metadata
├── globals.css              # Palet, token, dan style global
├── page.tsx                 # Landing page
├── login/page.tsx           # Login admin
├── (public)/layout.tsx      # Layout route publik
└── (admin)/
    ├── layout.tsx           # Layout admin
    └── dashboard/page.tsx   # Dashboard (placeholder)
components/
├── layout/                  # Section website publik
└── admin/                   # Komponen panel admin
lib/
├── api/                     # Axios instance dan fungsi API
├── hooks/                   # Hook, termasuk autentikasi
├── types/                   # Kontrak data TypeScript
└── utils/                   # Helper
public/                     # Aset statis dan foto
```

## Menjalankan Secara Lokal

Jalankan perintah berikut dari direktori `bengkel-frontend`.

1. Instal dependensi:

   ```sh
   npm install
   ```

2. Buat `.env.local`:

   ```dotenv
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
   ```

3. Jalankan development server:

   ```sh
   npm run dev
   ```

4. Buka `http://localhost:3000`.

Backend harus berjalan untuk fitur yang memakai API. Pastikan konfigurasi CORS backend atau proxy mengizinkan akses frontend pada origin yang berbeda.

### Perintah Lain

```sh
npm run lint
npm run build
npm run start
```

`npm run start` digunakan setelah build berhasil.

## Konvensi Pengembangan

- Baca [`AGENTS.md`](AGENTS.md) sebelum mengubah kode. Untuk API/perilaku Next.js, baca panduan relevan di `node_modules/next/dist/docs/` sesuai versi yang terpasang.
- Pertahankan palet brand dan gunakan token di `app/globals.css`.
- Pisahkan komponen publik dan admin sesuai struktur yang ada.
- Gunakan API client di `lib/api/` dan kontrak tipe di `lib/types/`.
- Sediakan loading, empty state, error state, dan validasi form yang jelas.
- Bedakan data contoh dari data produksi; hindari klaim harga, stok, rating, atau testimoni yang belum diverifikasi.
- Kembangkan per alur sampai terhubung frontend–backend, bukan hanya halaman dengan data dummy.

## Prioritas Berikutnya

1. Rapikan landing page dan hubungkan layanan ke API.
2. Selesaikan pengajuan reservasi, peringatan sibuk, hasil pengajuan, dan cek status.
3. Bangun daftar/detail reservasi admin, chat WhatsApp, serta perubahan status/jadwal.
4. Bangun kalender dan pengaturan jadwal/libur.
5. Tambahkan katalog produk dan pengelolaan konten.
