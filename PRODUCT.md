# Cipendawa Motor

## Platform

Website publik untuk pelanggan bengkel mobil di Cianjur dan Sukabumi. Frontend menggunakan Next.js App Router, React, dan TypeScript. README utama menjadi sumber detail scope dan kondisi implementasi.

## Tujuan dan Pengguna

Calon pelanggan mengenali layanan, melihat hasil pekerjaan, menemukan cabang, dan merencanakan kunjungan bengkel. Identitas navy/lime dan informasi perusahaan yang sudah dikonfirmasi pemilik dipertahankan.

## Reservasi

Pemilik mengonfirmasi pada 18 Oktober 2026:

- Kerjakan frontend terlebih dahulu, backend dirapikan setelahnya.
- Pilihan layanan: Body Repair, Service, serta Sparepart & Variasi.
- Pengunjung memilih satu dari tiga cabang.
- Pengunjung memilih tanggal dan preferensi waktu; jadwal pasti membutuhkan konfirmasi tim.
- Alur tiga langkah mengikuti referensi: layanan, data pelanggan, lalu jadwal/ringkasan.
- Aset foto layanan yang sudah tersedia digunakan untuk frontend awal.

Pada 24 Oktober 2026, pemilik menetapkan project sebagai showcase pribadi dengan backend dan database lokal sungguhan. Form menyimpan reservasi setelah ringkasan dikonfirmasi. WhatsApp memakai mode mock dengan status simulated; tidak ada pesan yang dikirim atau penyedia berbayar. Panel admin ditunda.

Semua cabang menerima ketiga kategori layanan. Cabang yang dipilih pelanggan adalah lokasi kunjungan; pemindahan pekerjaan kompleks ke Cianjur ditangani manual oleh tim. Setiap reservasi mendapat kode dan status pending. Idempotency key mencegah percobaan ulang menambah data yang sama.

## Batasan Konten

Jangan mengadopsi klaim garansi, durasi pekerjaan, konfirmasi 24 jam, atau batas pemesanan 18 jam dari screenshot contoh. Jam bengkel yang dikonfirmasi: Senin–Sabtu 08.00–17.00 WIB, Minggu tutup. Preferensi waktu bukan inventori slot yang tersedia.
