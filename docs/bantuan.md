# BAGIAN V — BANTUAN

---

## BAB 14: FAQ & TROUBLESHOOTING

### Untuk SPV

**T: Saya lupa mengatur target omset bulan ini. Apa yang terjadi?**
J: Semua persentase pencapaian akan menunjukkan 0%. Segera buka Pengaturan Parameter → Target Omset Bulanan → isi target → Simpan.

**T: Internet mati saat saya menekan tombol "Kirim". Apakah data saya hilang?**
J: Tidak. Data tersimpan otomatis di memori browser HP Anda. Saat internet kembali, buka aplikasi dan tekan "Kirim" lagi. Semua isian masih utuh.

**T: Saya sudah mengirim Fase 1 tadi malam, tapi pagi ini form Fase 2 tidak muncul. Kenapa?**
J: Kemungkinan file Draft JSON terhapus dari Google Drive. Sistem akan menampilkan pesan yang meminta Anda membuat ulang laporan dari awal. Hubungi owner jika masalah berlanjut.

**T: Nama staf yang saya cari tidak muncul di dropdown. Kenapa?**
J: Kemungkinan staf belum terdaftar atau sudah berstatus "Resign" di database. Buka Pengaturan Parameter → Kelola Staf Outlet untuk menambahkan.

**T: Saya tidak sengaja mengirim laporan 2 kali. Apakah data jadi double?**
J: Tidak. Sistem memiliki perlindungan anti-duplikasi. Jika Anda mengirim laporan dengan tanggal dan outlet yang sama, pengiriman kedua akan ditolak otomatis.

**T: Saya login sebagai SPV Perintis, tapi data yang muncul adalah data Dg Tata dari kemarin. Kenapa?**
J: Sistem sudah memiliki perlindungan ini. Saat Anda login, sistem otomatis membuang data yang tidak cocok dengan outlet Anda. Jika masih terjadi, coba hapus data browser (Clear Cache) dan login ulang.

### Untuk GM / Owner

**T: Dashboard tidak menampilkan data sama sekali ("Belum ada data"). Kenapa?**
J: Pastikan SPV sudah mengirim minimal 1 laporan harian di rentang waktu yang Anda pilih. Periksa juga apakah filter outlet sudah benar.

**T: Persentase target omset selalu 0% padahal ada penjualan. Kenapa?**
J: SPV belum mengatur Target Omset Bulanan di menu Pengaturan Parameter. Ingatkan SPV untuk mengisinya di awal setiap bulan.

**T: Saya ingin melihat data setahun penuh, tapi beberapa grafik tidak muncul. Kenapa?**
J: Saat Anda memilih rentang > 95 hari, sistem masuk ke Mode Strategis yang otomatis menyembunyikan beberapa analisis detail (seperti Minus Kas per staf dan Revenue per SPV). Ini disengaja agar data tahunan tidak terlalu bising.

**T: Di mana saya bisa melihat file PDF laporan SPV?**
J: Buka accordion "Arsip Laporan PDF" di bagian bawah Dashboard. Atau langsung buka Google Drive folder `Zero Cafe Workspace Drive > [Tahun] > [Bulan] > [Outlet]`.

**T: Bagaimana cara mengubah folder penyimpanan di Google Drive?**
J: Di Dashboard GM, buka Pengaturan → masukkan ID Folder baru → Simpan. Semua file baru akan otomatis masuk ke folder tersebut.

---

## Catatan Penutup

Buku Panduan ini adalah **dokumen hidup** yang akan terus diperbarui seiring dengan evolusi aplikasi Zero Cafe. Setiap penambahan fitur besar atau perubahan arsitektur akan secara otomatis didokumentasikan di sini.

Jika Anda memiliki pertanyaan, masukan, atau menemukan ketidaksesuaian antara panduan ini dengan perilaku aplikasi, silakan hubungi tim pengembang:

**Acronimous Studio**
*Membangun Sistem Cerdas untuk Bisnis Lokal*

---

*Dokumen ini disusun sebagai bagian dari proyek Zero Cafe Workspace oleh Acronimous Studio. Seluruh hak cipta dilindungi.*
*Versi 2.1 — Checkpoint 20 — Juli 2026*
