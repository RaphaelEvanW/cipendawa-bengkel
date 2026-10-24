# Frontend Reservasi

## Keputusan 18 Oktober 2026

Route `/reservasi` menggunakan identitas navy/lime yang sudah ada. Tujuannya membantu pengunjung mengisi kebutuhan kunjungan secara bertahap. Mode desain: Operate. ENERGY 2 / RHYTHM 2 / MOTION 1.

Panel form memakai navy medium yang lebih terang dari latar halaman, dengan teks putih dan aksen lime pada pilihan aktif serta tombol utama. Input memakai navy light. Foto yang dipasok pemilik menjelaskan pilihan layanan. Ringkasan di kanan menjaga pilihan tetap terlihat pada desktop; pada HP ringkasan berpindah ke bawah form. Penanda 1–3 menunjukkan urutan langkah yang nyata. Ikon panah untuk navigasi, jam untuk jam operasional, dan pin untuk lokasi.

## Alur

1. Pilih satu layanan dan cabang.
2. Isi nama dan WhatsApp; email serta deskripsi mobil opsional.
3. Pilih tanggal, preferensi waktu, dan catatan opsional; buka ringkasan.

Preferensi waktu awal: pagi 08.00–11.00, siang 11.00–14.00, sore 14.00–17.00 WIB. Pembagian ini merupakan keputusan frontend untuk pratinjau, bukan slot reservasi backend. Tanggal lewat, Minggu, dan rentang yang sudah berakhir hari ini ditolak menggunakan waktu Asia/Jakarta.

Ringkasan akhir diberi status **Belum terkirim**. Tidak ada API, notifikasi WhatsApp, penyimpanan server, atau klaim reservasi berhasil. Data berada dalam state halaman dan hilang jika halaman dimuat ulang. Tombol kembali/edit mempertahankan isian, tombol mulai ulang mengosongkannya.

Isian wajib memakai atribut HTML `required` dan keterangan yang terlihat; validasi khusus frontend tetap dijalankan. Deskripsi pilihan layanan minimal 13px pada HP, dengan gaya navy/lime dan foto yang sama seperti desktop.

## Integrasi Berikutnya

Tentukan kontrak backend, penyimpanan, slot dan kapasitas per cabang, serta nomor WA pribadi untuk testing sebelum mengaktifkan pengiriman. Validasi frontend harus dilengkapi validasi server. Panel admin belum diputuskan. Jangan menganggap API lama kompatibel hanya karena file-nya tersedia.

## Aset

Ketiga gambar berasal dari `bengkel-frontend/public/images/layanan/` yang disediakan pemilik: `body_repair.png`, `service.png`, dan `sparepart_variasi.png`. Foto bengkel pada kondisi belum memilih menggunakan `/photos/1.jpg`. Tidak memerlukan gambar tambahan untuk versi awal ini.
