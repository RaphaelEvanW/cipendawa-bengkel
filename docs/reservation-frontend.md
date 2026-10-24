# Frontend Reservasi

## Keputusan 18 Oktober 2026

Route `/reservasi` menggunakan identitas navy/lime yang sudah ada. Tujuannya membantu pengunjung mengisi kebutuhan kunjungan secara bertahap. Mode desain: Operate. ENERGY 2 / RHYTHM 2 / MOTION 1.

Panel form memakai navy medium yang lebih terang dari latar halaman, dengan teks putih dan aksen lime pada pilihan aktif serta tombol utama. Input memakai navy light. Foto yang dipasok pemilik menjelaskan pilihan layanan. Ringkasan di kanan menjaga pilihan tetap terlihat pada desktop; pada HP ringkasan berpindah ke bawah form. Penanda 1–3 menunjukkan urutan langkah yang nyata. Ikon panah untuk navigasi, jam untuk jam operasional, dan pin untuk lokasi.

## Alur

1. Pilih satu layanan dan cabang.
2. Isi nama dan WhatsApp; email serta deskripsi mobil opsional.
3. Pilih tanggal, preferensi waktu, dan catatan opsional; buka ringkasan.

Preferensi waktu: pagi 08.00–11.00, siang 11.00–14.00, sore 14.00–17.00 WIB. Rentang ini bukan jaminan slot. Frontend dan backend menolak tanggal lewat, Minggu, dan rentang yang sudah berakhir hari ini menggunakan waktu Asia/Jakarta.

Ringkasan akhir diberi status **Belum disimpan**. Tombol Simpan reservasi mengirim data melalui server Next.js ke API Go. Jika penyimpanan berhasil, halaman menampilkan kode reservasi, status pending, serta keterangan WhatsApp simulasi. Tidak ada pesan sungguhan yang dikirim. Data yang sudah disimpan berada di PostgreSQL; draft yang belum disimpan masih hilang jika halaman dimuat ulang.

Tombol simpan dan edit dinonaktifkan selama pengiriman. Percobaan ulang dengan isian sama memakai Idempotency-Key yang sama untuk mencegah data ganda. Kesalahan backend ditampilkan tanpa menghapus isian. Semua cabang menerima semua layanan; cabang adalah tujuan kunjungan pelanggan.

Isian wajib memakai atribut HTML `required` dan keterangan yang terlihat; validasi khusus frontend tetap dijalankan. Deskripsi pilihan layanan minimal 13px pada HP, dengan gaya navy/lime dan foto yang sama seperti desktop.

## Backend Showcase

Gunakan `BACKEND_API_URL` server-side, default `http://127.0.0.1:8080/api`. Jalankan backend dan migration sesuai [README backend](../bengkel-backend/README.md). Tanpa backend, form menampilkan kegagalan penyimpanan dan mempertahankan draft. Panel admin, pengiriman WhatsApp sungguhan, dan kapasitas slot ditunda.

## Aset

Ketiga gambar berasal dari `bengkel-frontend/public/images/layanan/` yang disediakan pemilik: `body_repair.png`, `service.png`, dan `sparepart_variasi.png`. Foto bengkel pada kondisi belum memilih menggunakan `/photos/1.jpg`. Tidak memerlukan gambar tambahan untuk versi awal ini.
