## BAB 13: SISTEM KEAMANAN & PERLINDUNGAN DATA

### 13.1 Anti Double-Submit (Race-Condition Lock)

Setelah SPV menekan tombol "Kirim", sistem mengunci pengiriman selama **10 detik**. Jika SPV menekan lagi dalam 10 detik, muncul pesan: "Pengiriman terlalu cepat (Spam klik). Laporan sedang diproses."

### 13.2 Anti Duplikasi Laporan

Sebelum menyimpan laporan baru, sistem memeriksa apakah sudah ada laporan dengan ID yang sama di database. Jika ada, laporan ditolak: "Laporan untuk periode ini sudah ada. Pengiriman ganda digagalkan!"

### 13.3 Anti Kontaminasi Silang Draft

Jika SPV login di outlet A, namun browser masih menyimpan draft dari outlet B (misalnya karena kemarin pinjam HP), sistem otomatis membuang draft yang tidak cocok. Data outlet lain tidak akan pernah tercampur.

### 13.4 Self-Healing: Penanganan Data Hilang

Jika file Draft JSON (Fase 1) hilang dari Google Drive (misalnya karena terhapus manual), sistem akan:
1. Mendeteksi bahwa draft tidak ditemukan
2. Otomatis menghapus baris "menggantung" di Spreadsheet
3. Memberitahu SPV: "Data Fase 1 tidak ditemukan. Sistem telah menghapus status gantung Anda. Silakan buat ulang laporan."

### 13.5 Perlindungan Form: Tidak Ada Reset Prematur

Sistem **TIDAK** akan menghapus data yang sudah diketik SPV sebelum server memastikan laporan berhasil tersimpan. Jika koneksi terputus, semua data tetap aman di layar — SPV tinggal tekan "Kirim" lagi.

### 13.6 Timezone-Safe Date Parsing

Semua pemrosesan tanggal di server menggunakan metode pemotongan teks (string split), **bukan** konversi objek tanggal (Date object). Ini mencegah bug di mana server Google (yang beroperasi di zona waktu UTC) menggeser tanggal mundur 1 hari.

Contoh: Tanggal "1 Desember 2026" yang dikirim dari HP di Makassar (WITA, UTC+8) bisa berubah menjadi "30 November 2026" jika diproses sebagai objek Date di server UTC. Dengan metode pemotongan teks, hal ini **tidak akan pernah terjadi**.

---

