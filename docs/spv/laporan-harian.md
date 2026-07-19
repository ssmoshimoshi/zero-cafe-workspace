## BAB 3: LAPORAN HARIAN (9 TAB + FASE 2)

### 3.1 Fitur Penting Sebelum Mulai

Sebelum mengisi laporan, kenali dulu 3 fitur perlindungan data yang bekerja diam-diam di balik layar:

1. **Simpan Otomatis (Autosave):** Setiap huruf yang Anda ketik langsung tersimpan di memori browser HP Anda. Jika aplikasi tertutup mendadak (baterai habis, sinyal putus), data Anda **tidak hilang**. Saat Anda buka kembali, semua isian akan tetap ada.

2. **Perlindungan Anti-Klik Ganda:** Setelah Anda menekan tombol "Kirim", sistem akan menahan semua klik selama 10 detik. Ini mencegah laporan terkirim 2 kali jika Anda tidak sengaja menekan tombol berkali-kali.

3. **Perlindungan Antar-Outlet:** Jika Anda login sebagai SPV Perintis, lalu besok login sebagai SPV Dg Tata (misalnya karena pindah tugas), sistem akan otomatis membuang data lama yang tidak cocok dengan outlet Anda saat ini. Data outlet lain tidak akan pernah tercampur.

### 3.2 Tab 1: JUAL (Penjualan Shift 1 & Konteks)

Tab ini adalah fondasi utama laporan harian. Data di sini menjadi bahan kalkulasi omset, target, dan tren di Dashboard GM.

| Yang Harus Anda Isi | Cara Mengisi | Catatan Penting |
|---|---|---|
| **Nama Supervisor** | Ketik nama Anda, sistem akan memunculkan daftar pilihan otomatis | Hanya nama staf dari outlet Anda yang muncul |
| **Outlet** | Sudah terkunci otomatis (abu-abu), tidak bisa diedit | Ditentukan dari PIN saat login |
| **Tanggal Laporan** | Pilih tanggal dari kalender | Setelah memilih tanggal, **tunggu sebentar** — sistem sedang menarik angka target omset dari database |
| **Jam Masuk** | Pilih jam Anda tiba di outlet | Digunakan untuk menghitung ketepatan waktu |
| **Cuaca Dominan** | Pilih salah satu: Cerah/Panas, Mendung, Hujan Gerimis, Hujan Badai | Digunakan mesin AI untuk menganalisis pengaruh cuaca terhadap penjualan |
| **Profil Pengunjung** | Pilih tipe pengunjung yang paling dominan hari ini | Digunakan untuk strategi pemasaran |
| **Target Omset (Rp)** | **Tidak perlu diisi** — angka muncul otomatis | Diambil dari target yang Anda atur di Pengaturan Parameter |
| **Omset Shift 1 (Rp)** | Ketik angka penjualan Shift 1 | Saat diketik, bar hijau di bawah akan bergerak menunjukkan persentase pencapaian |
| **Omset Shift 2** | Tidak bisa diisi sekarang (abu-abu) | Diisi besok pagi di Fase 2 |

### 3.3 Tab 2: KAS (Audit Uang di Laci Kasir)

Tab ini merekam hasil penghitungan uang fisik di laci kasir. Anda bisa mengaudit lebih dari sekali dalam satu shift.

| Yang Harus Anda Isi | Cara Mengisi | Catatan Penting |
|---|---|---|
| **Modal Awal Kasir** | Ketik jumlah uang receh standar saat buka (umumnya Rp 200.000) | — |
| **Jam Audit** | Pilih jam saat Anda menghitung uang | — |
| **Total QRIS** | Ketik total uang masuk via QRIS | — |
| **Total Tunai** | Ketik total uang tunai fisik di laci (belum dikurangi modal awal) | — |
| **Aktual (Sistem)** | Ketik angka total penjualan menurut mesin kasir (POS) | Ini adalah angka "kebenaran" yang jadi pembanding |
| **Selisih (Rp)** | Ketik hasil selisih antara uang fisik dan data sistem | Jika minus, angka akan berwarna **merah** — ini yang dipantau GM |
| **Catatan Selisih** | Jelaskan kenapa ada selisih (jika ada) | **Sangat penting!** Tanpa penjelasan, GM bisa salah mengira ini sebagai kecurangan |

**Tombol penting:**
- **Tombol "TAMBAH" (kanan atas):** Tekan jika Anda mengaudit laci kasir lebih dari sekali (misal: siang dan malam).
- **Tombol "HAPUS" (merah, di setiap baris):** Hapus baris audit tertentu jika salah tekan.

### 3.4 Tab 3: STAFF (Absensi & Kepatuhan SOP)

Tab ini adalah salah satu yang paling berpengaruh terhadap KPI di Dashboard GM. Setiap pilihan yang Anda buat di sini akan langsung mempengaruhi skor kedisiplinan staf.

**Langkah mengisi:**
1. Pilih nama staf dari dropdown **"PILIH STAFF"**
2. Tekan tombol **"TAMBAH"** untuk menambahkan ke daftar evaluasi
3. Isi penilaian untuk setiap staf yang sudah ditambahkan

**Tombol khusus:**
- **+ STAFF BARU:** Untuk mendaftarkan staf freelance/cabutan yang belum ada di database
- **+ PINJAM STAF:** Untuk mengambil nama staf dari outlet lain (jika ada pertukaran shift)

| Yang Harus Anda Isi | Pilihan | Dampak ke Dashboard GM |
|---|---|---|
| **Metode Penilaian** | Dinilai Langsung / Dinilai via Absensi | — |
| **Status Kehadiran** | Hadir, Terlambat, Izin, Sakit, Alpha | Memilih "Terlambat" **langsung menurunkan** persentase kedisiplinan staf di Dashboard GM |
| **Keramahan Terlewat?** | Ya (Miss) / Tidak (Aman) | Memilih "Ya (Miss)" **langsung menurunkan** skor SOP Keramahan. Tidak muncul untuk posisi Kitchen |
| **Catatan Khusus** | Teks bebas | Jelaskan alasan keterlambatan atau pelanggaran |

### 3.5 Tab 4: BRIEF (Evaluasi Shift & Briefing)

Tab ini berisi analisis kualitatif Anda sebagai SPV. Kata-kata yang Anda ketik di sini akan dibaca oleh mesin *Text Mining* di Dashboard GM.

| Yang Harus Anda Isi | Contoh |
|---|---|
| **Target Hari Ini** | "Capai 120 struk, fokus upselling dessert" |
| **Fokus Perilaku** | "Ingatkan tim untuk senyum dan tawarkan add-on" |
| **Masalah Shift Kemarin** | "Kulkas kurang dingin, es batu cepat cair" |
| **Solusi Disepakati** | "Sudah panggil teknisi, sementara pakai es dari luar" |

### 3.6 Tab 5: QC (Quality Control Produk)

Dibagi menjadi dua bagian:

**A. QC Espresso (Wajib diisi setiap hari)**

| Yang Harus Anda Isi | Pilihan |
|---|---|
| **Jam Kalibrasi** | Jam berapa grinder/espresso machine ditarik |
| **Kondisi** | Baik/Standar, Pahit/Bitter, Asam/Sour, Watery |
| **Keterangan Adjust** | Contoh: "Ubah grind size jadi 2.5, ekstraksi terlalu cepat" |

**B. QC Menu Lainnya (Tekan "TAMBAH ITEM" untuk menambah)**

| Yang Harus Anda Isi | Cara Mengisi |
|---|---|
| **Jam** | Jam pengecekan |
| **Kategori & Produk** | Pilih Minuman/Makanan/Snack, lalu ketuk input produk untuk mencari nama menu |
| **Status Temuan** | Pilihan berubah sesuai kategori (misal: Makanan → "Tidak Fresh"; Minuman → "Layering Salah") |
| **Catatan Tindakan** | Langkah koreksi yang diambil |

### 3.7 Tab 6: BERSIH (Inspeksi Kebersihan 8 Area)

Tab ini mewajibkan Anda menginspeksi **8 area kafe** satu per satu: Kaca, Lantai, Tembok, Toilet, Wastafel, Parking Area, Bar, Musholah.

Setiap area berbentuk kotak lipatan (Accordion) yang harus Anda buka dan isi:

| Yang Harus Anda Isi | Pilihan | Dampak |
|---|---|---|
| **Status Kebersihan** | Bersih, Cukup Bersih, Kotor | Rata-rata dari 8 area ini membentuk **Skor Kebersihan (Hygiene Score)** di Dashboard GM |
| **Skor** | Otomatis terisi (Bersih=100, Cukup=70, Kotor=40), tapi Anda bisa ubah manual | Misal: area "Cukup Bersih" tapi hampir sempurna, Anda boleh ubah jadi 85 |
| **Centang Alasan** | Kotak-kotak centang yang muncul otomatis sesuai area dan status | Cukup centang, tidak perlu mengetik — menghemat waktu Anda |

> **Kenapa menggunakan centang, bukan ketik?**
> Fitur centang sengaja dipilih agar Anda lebih cepat selesai. Pilihan-pilihan yang tersedia diambil dari **catatan laporan fisik Zero Cafe sebelumnya** — jadi semua pilihan memang relevan dengan kondisi nyata di lapangan.

**Apa yang terjadi dengan data kebersihan ini?**
Selain disimpan ke database utama, sistem juga otomatis **mencetak PDF Checklist Kebersihan Harian** yang tersimpan permanen di Google Drive sebagai bukti fisik.

### 3.8 Tab 7: KOMPLAIN (Laporan Keluhan Pelanggan)

Gunakan tombol **"TAMBAH"** untuk menambah baris insiden (bisa diulang tanpa batas). Gunakan tombol **"HAPUS"** untuk menghapus baris jika salah.

**Bagian Atas — Statistik:**

| Yang Harus Anda Isi | Catatan |
|---|---|
| **Total Kasus Komplain** | Angka total komplain hari ini |
| **Total Remake** | Jumlah produk yang harus dibikin ulang |
| **Analisis Remake ≥3** | Kotak peringatan merah ini **hanya muncul** jika Total Remake 3 atau lebih. Anda wajib jelaskan kenapa banyak gagal |

**Bagian Bawah — Detail Per Komplain:**

| Yang Harus Anda Isi | Contoh |
|---|---|
| **Jam & Inisial Pelanggan** | "14:30" dan "Bpk. A" |
| **Isi Komplain** | "Matcha terlalu manis" |
| **Tindakan (Respon)** | "Minta maaf, dibuatkan ulang yang baru" |
| **Checkbox Remake/Eskalasi** | Centang "Remake" jika produk dibikin ulang. Centang "Eskalasi GM" jika butuh perhatian owner |

### 3.9 Tab 8: FASILITAS & BAHAN

Tab ini merekam kerusakan alat dan kebutuhan belanja bahan habis pakai. Gunakan tombol **"TAMBAH"** dan **"HAPUS"** sesuai kebutuhan.

**A. Fasilitas & Alat (Kerusakan)**

| Yang Harus Anda Isi | Catatan |
|---|---|
| **Nama Alat/Fasilitas** | Contoh: "AC Lantai 1", "Grinder" |
| **Status Kerusakan** | Rusak Ringan / Rusak Sedang / Rusak Berat (Mati) |
| **Eskalasi GM?** | Tekan kotak merah jika butuh perbaikan cepat dari owner |
| **Keterangan Singkat** | Contoh: "Bocor freon, air menetes" |
| **Tombol Unggah Foto** | Ambil/lampirkan foto bukti kerusakan. Setelah unggah, berubah jadi "Lihat Foto" & "Hapus Foto" |

**B. Bahan & ATK Habis**

| Yang Harus Anda Isi | Catatan |
|---|---|
| **Nama Bahan** | Contoh: "Sabun Cuci", "Tisu" |
| **Status Ketersediaan** | Contoh: "Habis", "Sisa 1 Botol" |
| **Estimasi Harga (Rp)** | Perkiraan biaya untuk reimburse |
| **Tombol Unggah Bukti** | Foto nota belanja atau kondisi barang yang kosong |

> **Penyimpanan Foto Otomatis:**
> Semua foto yang Anda unggah akan otomatis tersortir ke folder yang benar di Google Drive:
> - Foto kerusakan alat → masuk folder **`Fasilitas`**
> - Foto nota belanja/bahan → masuk folder **`Pengeluaran`**
>
> Nama file juga otomatis diganti menjadi format cerdas, contoh: `18-07-ACLantai1-RusakBerat.jpg` — sehingga GM mudah mencari di kemudian hari.

### 3.10 Tab 9: TUTUP (Kesimpulan & Pengiriman)

Ini adalah tab terakhir sebelum laporan dikirim.

| Yang Harus Anda Isi | Catatan |
|---|---|
| **Kendala Utama Hari Ini** | Ringkasan kesulitan paling mengganggu selama shift |
| **Rekomendasi / Saran** | Permintaan ke manajemen atau solusi strategis dari Anda |

**Dua Tombol di Bawah:**

| Tombol | Fungsi |
|---|---|
| **BATAL** | Kembali ke Menu Utama. Data yang sudah diketik **tidak hilang** (tersimpan otomatis) |
| **KIRIM LAPORAN SOP** | Mengirim laporan ke server |

**Apa yang terjadi saat Anda tekan "KIRIM"?**
1. **Jika ada data yang belum lengkap:** Muncul peringatan merah yang menyebutkan bagian mana yang belum diisi. Laporan **ditolak** sampai Anda melengkapinya.
2. **Jika semua data lengkap:** Muncul jendela **Pratinjau (Preview)** besar yang menampilkan tampilan PDF laporan Anda. Periksa sekali lagi, lalu tekan **"Kirim Final"** di dalam jendela tersebut.

### 3.11 Fase 2 (Penyelesaian Keesokan Pagi)

Saat Anda membuka aplikasi keesokan harinya, jika ada Laporan Harian yang tertunda (Fase 1 sudah terkirim tapi Fase 2 belum), sistem akan otomatis menampilkan formulir Fase 2.

**A. Data Keuangan Malam:**

| Yang Harus Anda Isi | Catatan |
|---|---|
| **Omset Shift 2 (Rp)** | Penjualan shift malam. Otomatis dijumlahkan dengan Shift 1 untuk membentuk **Total Omset Harian** |
| **Total Struk Transaksi** | Jumlah total struk hari itu (Shift 1 + Shift 2). Angka ini digunakan mesin AI untuk menghitung **Rata-rata Belanja per Pelanggan (ATS)** |

**B. Evaluasi Produk:**

Untuk setiap kategori (Minuman, Makanan, Snack):

| Yang Harus Anda Isi | Catatan |
|---|---|
| **Top 5 Produk** | 5 menu paling laris hari itu |
| **Bottom 3 Produk** | 3 menu paling tidak laku |
| **Alasan Bottom 3** | Kenapa produk ini tidak laku (Contoh: "Bahan habis", "Tidak ada promo") |

**C. Operasional Malam:**

| Yang Harus Anda Isi | Catatan |
|---|---|
| **Komplain Susulan (Malam)** | Jika ada insiden malam, tambahkan di sini (sama dengan Tab 7) |
| **Absensi & SOP Staf Malam** | Evaluasi kehadiran dan keramahan staf closing (sama dengan Tab 3) |

> **Perlindungan Data Usang:**
> Jika besok Anda membuka aplikasi dan ternyata server sudah tidak punya catatan Fase 1 yang tertunda (misalnya karena sudah diproses atau dibatalkan), tapi HP Anda masih menyimpan sisa data kemarin, sistem akan otomatis **membuang data usang tersebut**. Ini mencegah data hari kemarin tercampur dengan hari ini.

---

