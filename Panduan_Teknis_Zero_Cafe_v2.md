# ZERO CAFE APP v2.0
## Panduan Pengguna & Spesifikasi Teknis Komprehensif
**Antarmuka, Sistem Keamanan, Algoritma & Dashboard Executive**

**Disusun untuk:** Pemilik (Owner) & General Manager
**Status:** Official Release

---

## DAFTAR ISI

**BAB 1: FILOSOFI & ARSITEKTUR APLIKASI**
1.1 Standar Zero: Data-Driven Disciplinary
1.2 Sistem Offline & Keamanan
1.3 Mekanisme Dua Fase (Fase 1 & 2)

**BAB 2: PANDUAN PENGGUNA SPV - LAPORAN HARIAN (9 TAB)**
2.1 Akses, Navigasi & Login (Single-Column Smart Login)
2.2 Tab 1: JUAL
2.3 Tab 2: KAS
2.4 Tab 3: STAFF
2.5 Tab 4: BRIEF
2.6 Tab 5: QC
2.7 Tab 6: BERSIH
2.8 Tab 7: KOMPLAIN
2.9 Tab 8: FASILITAS
2.10 Tab 9: TUTUP
2.11 Fase 2 (Penyelesaian Pagi Hari & Total Struk)

**BAB 3: LAPORAN MINGGUAN (EVALUASI TAKTIS)**
3.1 Tab 1: Identitas & Rekap Omset
3.2 Tab 2: Komplain & Evaluasi Staf
3.3 Tab 3: Rencana Perbaikan Tim

**BAB 4: LAPORAN BULANAN (EVALUASI STRATEGIS)**
4.1 Tab 1: Identitas & Metrik Penjualan
4.2 Tab 2: Evaluasi Kinerja (Diri Sendiri & Tim)
4.3 Tab 3: Rencana Strategis & Kebutuhan

**BAB 5: PENGATURAN PARAMETER & MASTER DATA**
5.1 Form Target Omset Bulanan
5.2 Manajemen Event (Kalender Akademik)
5.3 Kelola Master Staf Outlet

**BAB 6: SISTEM KEAMANAN & INTEGITAS DATA**
6.1 Race-Condition Lock & Anti-Spam
6.2 Autosave & Draft Recovery
6.3 The Apostrophe Rule & Sanitasi Input

**BAB 7: DASHBOARD GENERAL MANAGER**
7.1 Overview & Navigasi 3 Tab Dashboard

**BAB 8: MESIN AI & ALGORITMA PREDIKTIF**
8.1 AI Predictive Summary (4 Algoritma)
8.2 Marketing Intelligence & Text Mining
8.3 Algoritma Deteksi Fraud Kasir

---

## BAB 1: FILOSOFI & ARSITEKTUR APLIKASI

### 1.1 Standar Zero: Data-Driven Disciplinary
Aplikasi Zero Cafe dirancang dengan filosofi **"Data-Driven Disciplinary"**. Setiap masukan yang diketik SPV tidak hanya disimpan, melainkan **dikalkulasi secara algoritmik** oleh *backend* untuk membentuk *Key Performance Indicators* (KPI) di layar Dashboard GM.

### 1.2 Sistem Offline & Keamanan
Aplikasi dirancang tangguh terhadap kondisi lapangan (WiFi mati / HP baterai habis):
1. **AUTOSAVE (DRAFT LOKAL):** Setiap ketikan langsung tersimpan di *LocalStorage* browser. Jika aplikasi tertutup, data tidak hilang.
2. **RACE-CONDITION LOCK:** Sistem menahan pengiriman ganda selama 10 detik setelah tombol Submit ditekan, melindungi database dari duplikasi.

### 1.3 Mekanisme Dua Fase (Fase 1 & Fase 2)
Karena outlet beroperasi hingga larut malam, pelaporan harian dibagi dua:
- **FASE 1 (Malam):** Dilakukan saat SPV *shift* malam pulang. Memuat Tab 1 hingga Tab 9 (Inspeksi lapangan & SOP).
- **FASE 2 (Pagi Besoknya):** Wajib dikirim sebelum jam 13:00. Memuat Omset Shift 2, Total Struk Transaksi Harian, dan Menu Bottom 3. Keterlambatan akan menghanguskan *Streak* kedisiplinan SPV.

---

## BAB 2: PANDUAN PENGGUNA SPV - LAPORAN HARIAN (9 TAB LENGKAP)

### 2.1 Akses, Navigasi & Login (Single-Column Smart Login)
Pada versi 2.0, sistem login menggunakan metode **Smart Single-Column Login** untuk antarmuka yang lebih bersih ("Zero Vibe") dan efisien.
- **Satu Pintu Masuk:** Pengguna hanya akan melihat satu kolom input di tengah layar awal.
- **Kunci Eksekutif (GM):** Jika pengguna memasukkan kata sandi `Zero123`, sistem otomatis mengotorisasi akses sebagai GM dan mengarahkan ke Dashboard GM.
- **Kunci Outlet (SPV):** Jika pengguna memasukkan PIN 4 digit (contoh: `1234` untuk Perintis, `5678` untuk Dg Tata), sistem memvalidasinya ke server. Jika valid, SPV akan diarahkan ke Menu Utama (berisi tombol Laporan Harian, Mingguan, Bulanan, dan Pengaturan Parameter).

### 2.2 Tab 1: JUAL (Penjualan Shift 1 & Konteks)
| Field Name | Tipe Input | Wajib? | Deskripsi & Algoritma |
| :--- | :--- | :---: | :--- |
| **Nama Supervisor** | Autocomplete | YA | Menarik data Master Staf secara dinamis sesuai dengan *outlet* tempat SPV sedang bertugas. |
| **Outlet Terkunci (PIN)** | Read-Only | YA | Terkunci otomatis (abu-abu/disabled). Outlet didapatkan dari hasil validasi PIN saat SPV Login. SPV tidak bisa seenaknya mengubah outlet untuk mencegah manipulasi data antar cabang. |
| **Tanggal Laporan** | Date Picker | YA | Menentukan tanggal data. **Penting:** Saat tanggal dipilih, sistem akan otomatis melakukan *fetching* (menarik) data "Target Harian" dari database berdasarkan parameter bulan tersebut. |
| **Jam Masuk** | Time Picker | YA | Mencatat jam kehadiran awal SPV (Shift 1). |
| **Cuaca Dominan** | Dropdown | YA | Cerah/Panas, Mendung, Hujan Gerimis, Hujan Badai. Dipakai AI untuk analisis traffic (contoh: korelasi hujan dengan turunnya *dine-in*). |
| **Profil Pengunjung** | Dropdown | YA | Mahasiswa Nugas, Pekerja WFC, Rombongan Nongkrong. Menjadi basis segmentasi AI Marketing di Dasbor GM. |
| **Target Omset (Rp)** | Read-Only | YA | Angka diambil otomatis (di-fetch) dari database berdasarkan *Bulan/Tahun* laporan. Target ini sebelumnya **wajib diset oleh SPV sendiri pada awal bulan melalui menu Pengaturan Parameter**. |
| **Omset Shift 1 (Rp)** | Currency | YA | Input nominal omset Shift 1. Saat diisi, angka ini akan langsung bereaksi mengisi indikator Bar (Progress Bar) di bagian bawah secara *real-time*, sekaligus mengubah persentase pencapaian target di ujung kanan bar. |
| **Omset Shift 2** | Read-Only | — | Di Fase 1 (Malam), kolom ini berstatus *disabled* dengan keterangan "Diisi Besok Pagi". Hanya bisa diisi di Fase 2 keesokan harinya. |

*(Catatan: "Total Struk Transaksi" **dihilangkan** dari Fase 1 agar data Average Ticket Size (ATS) tidak dikalkulasi secara prematur sebelum operasional hari tersebut benar-benar selesai).*

### 2.3 Tab 2: KAS (Audit Petty Cash)
Bagian ini merekam hasil perhitungan uang fisik di laci kasir (Petty Cash). Karena operasional cafe dinamis, SPV sangat mungkin melakukan pengecekan uang lebih dari satu kali dalam satu *shift*.

| Field Name | Tipe Input | Wajib? | Deskripsi & Algoritma |
| :--- | :--- | :---: | :--- |
| **Modal Awal Kasir** | Currency | YA | Uang receh standar saat buka (umumnya Rp 200.000). |
| **Jam Audit** | Time Picker | YA | Menandakan pukul berapa SPV melakukan audit laci kasir ini (default `12:00`). |
| **Total QRIS** | Currency | YA | Jumlah uang masuk via QRIS yang dihitung. |
| **Total Tunai** | Currency | YA | Fisik uang tunai di laci saat dihitung (belum dikurangi modal awal). |
| **Aktual (Sistem)** | Currency | YA | Bacaan murni total uang (Tunai+QRIS) berdasarkan mesin POS (*Ground Truth*). |
| **Selisih (Rp)** | Kalkulasi | YA | Wajib diisi. Jika terdapat selisih minus, font akan berubah merah. Selisih minus ini yang dideteksi oleh AI Deteksi Fraud GM. |
| **Catatan Selisih** | Textarea | Opsional | **Sangat Krusial:** Jika terjadi selisih (misal karena kembalian kurang, *human error* input, atau alasan wajar lain), SPV *wajib* memberikan penjelasan di sini agar GM bisa membedakan mana fraud dan mana sekadar kesalahan input. |

**Catatan Tombol Interaktif Tab Kas:**
- **Tombol "TAMBAH" (Kanan Atas):** Digunakan *setiap kali* SPV melakukan audit kasir tambahan di hari yang sama. Misalnya, SPV mengecek laci pada siang hari (jam 14:00) dan mengeceknya lagi sebelum pergantian shift (jam 21:00). Tombol ini akan memunculkan blok form audit baru ke bawah sehingga SPV tidak perlu mereset audit sebelumnya.
- **Tombol "HAPUS" (Warna Merah di Kanan Jam Audit):** Berfungsi untuk membuang baris form audit spesifik. Sangat berguna jika SPV tidak sengaja/salah menekan tombol Tambah, atau batal mengaudit.

### 2.4 Tab 3: STAFF (Absensi & SOP)
Fitur sentral untuk mendisiplinkan operasional lapangan.
**Fungsi Tombol Atas:**
- **PILIH STAFF (Dropdown):** Memilih nama staf dari database.
- **+ STAFF BARU:** Modal khusus untuk mendaftarkan staf cabutan/freelance yang belum ada di database.
- **+ PINJAM STAF:** Mengambil nama staf dari outlet lain jika ada pertukaran shift dadakan.
- **TAMBAH:** Menambahkan staf terpilih ke dalam baris evaluasi.
- **HAPUS:** Menghapus baris staf tersebut dari layar.

| Field Name | Tipe Input | Wajib? | Deskripsi & Algoritma |
| :--- | :--- | :---: | :--- |
| **Metode Penilaian** | Dropdown | YA | Pilihan: *Dinilai Langsung* atau *Dinilai via Absensi*. |
| **Status Kehadiran** | Dropdown | YA | Hadir, Terlambat, Izin, Sakit, Alpha. **Penting:** Memilih "Terlambat" akan langsung merusak persentase kedisiplinan staf tersebut di Dasbor GM. |
| **Keramahan Terlewat?** | Dropdown | YA | *The Ultimate Quality Gate*. Jika SPV memilih "Ya (Miss)" pada barista/kasir, skor kepatuhan SOP otomatis turun. (Field ini tidak muncul untuk posisi Kitchen). |
| **Catatan Khusus** | Textarea | Opsional | Alasan keterlambatan, atau jenis pelanggaran keramahan yang dilakukan. |

### 2.5 Tab 4: BRIEF (Evaluasi Shift & Briefing)
Bagian kualitatif yang mengandalkan analisis SPV. Kata kunci di sini akan dibaca oleh *Text Mining* GM Dashboard.
| Field Name | Tipe Input | Wajib? | Deskripsi & Algoritma |
| :--- | :--- | :---: | :--- |
| **Target Hari Ini** | Textarea | YA | Penjelasan target omset, jumlah struk yang diincar, atau event yang sedang berlangsung hari ini. |
| **Fokus Perilaku** | Textarea | YA | Instruksi harian kepada tim (contoh: "Fokus pada senyum, sapa, tawarkan add-on"). |
| **Masalah Shift Kemarin**| Textarea | YA | Masalah *carry-over* dari hari sebelumnya (contoh: "Kulkas kurang dingin"). |
| **Solusi Disepakati** | Textarea | YA | Aksi yang harus dilakukan staf hari ini untuk mencegah masalah kemarin terulang. |

### 2.6 Tab 5: QC (Quality Control Produk)
Dibagi menjadi dua area: QC Espresso (Wajib setiap pagi) dan QC Makanan/Minuman (Bebas ditambah dengan **Tombol "TAMBAH ITEM"** & bisa di-**HAPUS** per baris).

**A. QC Espresso (Wajib)**
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Jam Kalibrasi** | Time Picker | YA | Pukul berapa grinder/espresso ditarik. |
| **Kondisi** | Dropdown | YA | Baik/Standar, Pahit/Bitter, Asam/Sour, Watery. |
| **Keterangan Adjust** | Textarea | Opsional| Contoh: "Ubah grind size jadi 2.5 karena ekstraksi terlalu cepat." |

**B. QC Menu Lainnya (Dinamis)**
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Jam** | Time | YA | Waktu pengecekan dilakukan. |
| **Kategori & Produk**| Dropdown | YA | Pilih Minuman/Makanan/Snack, lalu *tap* input produk untuk memunculkan modal pencarian menu. |
| **Status Temuan** | Dropdown | YA | Berubah dinamis sesuai kategori (Contoh: Makanan punya status "Tidak Fresh", Minuman punya "Layering Salah"). |
| **Catatan Tindakan** | Textarea | Opsional| Langkah koreksi yang diambil staf. |

### 2.7 Tab 6: BERSIH (Sanitasi 8 Area)
Terdiri dari 8 Akordion (Kaca, Lantai, Tembok, Toilet, Wastafel, Parking Area, Bar, Musholah). Sistem menuntut semua harus dibuka dan diinspeksi.

| Field Name | Tipe Input | Wajib? | Deskripsi & Algoritma |
| :--- | :--- | :---: | :--- |
| **Status Kebersihan** | Dropdown | YA | Bersih, Cukup Bersih, Kotor. Rata-rata membentuk "Hygiene Score" di GM. |
| **Skor** | Number | YA | Otomatis terisi sesuai status (contoh: Bersih = 100), namun SPV bisa mengubahnya secara manual jika dirasa nilainya nanggung (misal 85). |
| **Checklist Alasan** | Checkbox | YA | Muncul secara adaptif sesuai dengan Status yang dipilih (Misal: Memilih "Kotor" pada Toilet akan memunculkan checklist yang berbeda dengan "Kotor" pada Kaca). |

**Filosofi Desain Checklist & Penyimpanan PDF:**
- **Kenapa Menggunakan Checkbox (Bukan Teks)?** Fitur *Checkbox* (Kotak Centang) sengaja dipilih untuk memangkas waktu kerja SPV agar lebih efisien dan cepat tanpa harus mengetik. Dari sisi GM, data berbasis centang ini bisa dipetakan secara algoritmik menjadi *Highlight Area Kritis* di Dashboard untuk dicermati, sesuatu yang tidak bisa dilakukan jika SPV mengetik teks bebas.
- **Sumber Template Alasan:** Pilihan alasan yang berbeda-beda di tiap area dan tiap skor (seperti "Cermin buram" di Wastafel vs "Sarang laba-laba" di Toilet) diekstrak langsung dari **data historis laporan fisik** yang selama ini diisi oleh SPV. Pilihan ini adalah cerminan realita lapangan.
- **Penyimpanan Data & Cetak PDF:** Seluruh data inspeksi 8 area ini akan dikirim ke Spreadsheet (Database Utama). Terkhusus untuk data kebersihan ini, sistem juga akan **mencetaknya secara otomatis menjadi file PDF Laporan Kebersihan Harian**. PDF ini disimpan permanen di Google Drive sebagai bukti pengamatan otentik.

### 2.8 Tab 7: KOMPLAIN (Eskalasi Pelanggan)
Fitur untuk melacak cacat produksi operasional. **Tombol "TAMBAH" (Kanan Atas)** digunakan untuk menambah baris insiden. SPV bebas menekan tombol ini berkali-kali untuk merekam *berapapun* jumlah komplain yang terjadi di hari itu tanpa batasan. Tombol **"HAPUS"** di setiap baris disediakan jika SPV salah menekan tambah atau batal melaporkan komplain tersebut.

**A. Statistik Makro**
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Total Kasus & Remake**| Number | YA | Jumlah total komplain & jumlah produk yang diganti baru. |
| **Analisis Remake >=3**| Textarea | BERSYARAT| Kotak peringatan merah ini **akan muncul otomatis** jika Total Remake diketik angka 3 atau lebih. SPV wajib menjelaskan kenapa terjadi banyak kegagalan hari itu. |

**B. Data Baris Komplain**
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Jam & Inisial PLG** | Time, Text | YA | Melacak di *shift* mana komplain terjadi dan nama inisial pelanggan. |
| **Isi Komplain** | Textarea | YA | Detail keluhan (contoh: "Matcha terlalu manis"). |
| **Tindakan (Respon)** | Textarea | YA | Cara penyelesaian (contoh: "Minta maaf dan dibuatkan ulang yang baru"). |
| **Checkbox Remake/Eskalasi**| Checkbox | Opsional| *Remake* menandai kerugian bahan, sedangkan *Eskalasi GM* akan menaikkan isu ke layar merah Dasbor Executive. |

### 2.9 Tab 8: FASILITAS & BAHAN (Manajemen Aset & ATK)
Menggunakan **Tombol "TAMBAH"** (dan **HAPUS**) untuk melacak alat rusak atau bahan yang habis. SPV bisa menambah berapapun baris alat rusak atau daftar belanjaan hari itu.

**A. Fasilitas & Alat (Kerusakan)**
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Nama Alat/Fasilitas**| Text | YA | Contoh: "AC Lantai 1", "Grinder". |
| **Status Kerusakan** | Dropdown | YA | Rusak Ringan, Rusak Sedang, Rusak Berat (Mati). |
| **Eskalasi GM?** | Tombol Toggle| Opsional| Berbentuk kotak merah. Jika ditekan, meminta atensi perbaikan cepat dari GM. |
| **Keterangan Singkat** | Text | Opsional | Penjelasan tulisan mengenai kerusakan (Contoh: "Bocor freon, air menetes"). Sengaja dipisah dari fitur unggah foto agar GM bisa membaca intisari masalah tanpa harus membuka gambar. |
| **Tombol Unggah Foto** | Button | Opsional| Tombol untuk mengambil atau melampirkan bukti fisik kerusakan. Setelah unggah, tombol berubah menjadi *Lihat Foto* dan *Hapus Foto*. |

**B. Bahan & ATK Habis**
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Nama Bahan**| Text | YA | Contoh: "Sabun Cuci", "Tisu". |
| **Status Ketersediaan** | Text | YA | Contoh: "Habis", "Sisa 1 Botol". |
| **Estimasi Harga (Rp)** | Number | YA | Perkiraan biaya yang dikeluarkan untuk *reimburse* / Petty Cash. |
| **Tombol Unggah Bukti** | Button | Opsional| Digunakan khusus untuk memfoto *Nota Belanja* atau keadaan fisik barang yang kosong. |

**Arsitektur Penyimpanan Foto (Otomasi Google Drive):**
Untuk mencegah file tercampur aduk, saat SPV menekan "Kirim Laporan", sistem *backend* (Code.gs) akan mengeksekusi otomatisasi dua hal:
1. **Membentuk Nama File Cerdas:** Foto tidak lagi bernama `IMG_1234.jpg`, melainkan dikonversi otomatis dengan format `DD-MM-NamaItem-Status` (Contoh: `18-07-ACLantai1-RusakBerat.jpg`). Ini mempermudah pencarian historis GM.
2. **Menyortir ke Folder Berbeda:** Foto akan masuk ke dalam *Root Folder* utama GM di Google Drive, lalu masuk ke folder Tahun dan Bulan berjalan, dan terakhir dipisah ke sub-folder spesifik:
   - Foto Fasilitas Rusak masuk ke folder: `/Tahun/Bulan/Trouble/`
   - Foto Bahan & Nota masuk ke folder: `/Tahun/Bulan/Nota Pengeluaran/`

### 2.10 Tab 9: TUTUP (Kesimpulan & Pengiriman)
Tahap finalisasi pelaporan shift.
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Kendala Utama Hari Ini**| Textarea | YA | Ringkasan kesulitan paling mengganggu selama shift. |
| **Rekomendasi / Saran** | Textarea | YA | Permintaan ke manajemen atau solusi strategis dari SPV. |
| **Tombol BATAL** | Button | — | Jika diklik, sistem akan membatalkan pengiriman dan mengembalikan SPV ke Halaman Menu Utama. **Catatan:** Data yang sudah diketik tidak akan hilang berkat fitur *Autosave (Draft)*, SPV bisa meneruskan isiannya nanti. |
| **Tombol KIRIM LAPORAN SOP** | Button | — | Tombol eksekusi utama untuk Fase 1 ataupun Fase 2. |

**Alur Pengiriman & Validasi (KIRIM LAPORAN):**
Sistem didesain untuk menolak data rumpang. Saat tombol KIRIM ditekan, akan terjadi salah satu dari dua skenario berikut:
1. **Muncul Alert Merah (Error):** Artinya sistem mendeteksi ada kolom *Wajib* yang terlewat (misal: area kebersihan belum diisi statusnya). Sistem tidak akan memunculkan pop-up apapun selain notifikasi *error* merah di layar yang menyuruh SPV melengkapi data yang kurang.
2. **Muncul Pop-up Preview PDF (Sukses):** Jika semua data valid, sistem akan memunculkan modal *Preview* (Pratinjau) besar. Modal ini menampilkan bentuk asli PDF yang akan dicetak. Ini adalah kesempatan terakhir bagi SPV untuk membaca ulang laporannya. Jika dirasa sudah benar, SPV tinggal menekan tombol Kirim Final di dalam pop-up tersebut.

### 2.11 Fase 2 (Penyelesaian Pagi Hari)
Fase 2 dirancang khusus untuk direkap keesokan paginya (Maksimal jam 13:00 siang) guna mencakup seluruh operasional *Shift Malam* yang terjadi setelah SPV pulang. Keterlambatan mengirim Fase 2 akan memutus *Streak* kedisiplinan SPV di Dasbor GM.

**A. Finansial & Metrik Utama**
| Field Name | Tipe Input | Wajib? | Deskripsi & Algoritma |
| :--- | :--- | :---: | :--- |
| **Omset Shift 2 (Rp)** | Currency | YA | Nominal omset masuk pada shift malam. Angka ini akan otomatis dijumlahkan dengan Omset Shift 1 (dari data Fase 1) untuk membentuk Total Omset Harian. |
| **Total Struk Transaksi** | Number | YA | Jumlah total keseluruhan struk yang tercetak hari itu (Shift 1 + Shift 2). Sangat krusial karena mesin AI GM menggunakan angka ini untuk membagi Total Omset guna melahirkan metrik **ATS (Average Ticket Size)**. |

**B. Evaluasi Produk (Kategori: Minuman, Makanan, Snack)**
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Top 5 Produk** | Text | YA | Daftar 5 menu paling laris hari itu per kategori (dipisah koma). |
| **Bottom 3 Produk** | Text | YA | Daftar 3 menu paling tidak laku atau pergerakannya lambat (Slow-moving). |
| **Alasan Bottom 3** | Textarea | YA | SPV wajib memberikan analisa mengapa 3 produk tersebut mati (Contoh: "Bahan baku kosong", "Tidak ada promo", atau "Hujan deras mengurangi pembeli dingin"). |

**C. Operasional Malam (Komplain & Absensi)**
Karena SPV tidak berada di lokasi hingga tutup, SPV wajib menginvestigasi *shift closing* keesokan paginya.
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Komplain Susulan (Malam)**| Textarea, Tombol| Opsional| Form dinamis persis seperti Tab 7 Komplain (dengan tombol Tambah/Hapus). Digunakan untuk mencatat insiden atau komplain pelanggan yang baru terjadi larut malam. |
| **Absensi & SOP Malam** | Dropdown, Tombol| YA | Form dinamis persis seperti Tab 3 Staff. Mewajibkan SPV untuk memvalidasi kehadiran dan memonitor pelanggaran SOP (Keramahan Terlewat) spesifik bagi staf *closing*. |

**Logika Keamanan Memori (Draft Fase 2):**
Sistem *frontend* memiliki pelindung *cache*. Jika SPV membuka aplikasi dan *server* backend (GAS) mendeteksi bahwa outlet ini **tidak memiliki** laporan Fase 1 yang sedang menggantung (pending), namun di memori *browser* HP SPV masih ada sisa *draft* isian Fase 2 kemarin, maka sistem otomatis akan membuang (reset) draft usang tersebut. Ini secara absolut mencegah data hari kemarin menimpa atau tercampur dengan pelaporan hari ini.

---

## BAB 3: LAPORAN MINGGUAN (EVALUASI TAKTIS)

Modul ini adalah jantung analisis taktis SPV. Untuk meringankan beban administrasi, sistem Zero Cafe V2.0 dirancang agar **sebagian besar data kuantitatif ditarik secara otomatis (Auto-Fill)**, sehingga SPV bisa fokus menggunakan waktunya untuk merumuskan analisa kualitatif.

### 3.1 Tab 1: Identitas, Rekap Omset & Evaluasi Produk
Langkah pertama SPV adalah memilih **Rentang Waktu (Dari Tanggal s/d Sampai Tanggal)**.

**Validasi Absolut 7 Hari (The 7-Day Lock):**
Sistem mengunci pilihan rentang waktu ini agar **TEPAT berjumlah 7 hari** (contoh: Senin sampai Minggu). Jika SPV memilih kurang atau lebih dari 7 hari, akan muncul **Modal Peringatan Merah** di tengah layar yang memblokir proses selanjutnya. 

Jika rentang 7 hari yang dipilih valid, sistem (GAS) akan menarik agregasi data harian dari server dan **mengisinya secara otomatis ke kolom-kolom SPV**. Jangan kaget jika form yang kosong tiba-tiba terisi penuh!

| Field Name | Tipe Input | Wajib? | Deskripsi & Algoritma Otomasi |
| :--- | :--- | :---: | :--- |
| **Tabel Rekap Omset (7 Hari)** | Auto-Fill | YA | SPV **tidak perlu mengetik apapun**. Kolom ini akan otomatis terisi dengan data Target & Total Omset per hari selama seminggu penuh. |
| **Total Target & Aktual** | Kalkulasi | YA | Tepat di bawah tabel, sistem menjumlahkan total akumulasi Target 7 hari dibandingkan dengan Total Omset Aktual 7 hari. |
| **Bar Indikator & Persen** | Visual | YA | Bar progres akan bergerak dinamis dengan algoritma warna: <br>• **Hijau:** Pencapaian &ge; 100% (Aman).<br>• **Oranye:** Pencapaian 80% - 99% (Batas Waspada).<br>• **Merah:** Pencapaian &lt; 80% (Bahaya). Angka persentase absolut akan tertulis di ujung kanan bar. |
| **Evaluasi Minuman (Top/Bottom)** | Auto-Fill | YA | Sistem *backend* mengekstrak otomatis daftar produk minuman paling laris dan mati dari akumulasi laporan harian selama 7 hari tersebut. |
| **Evaluasi Makanan (Top/Bottom)** | Auto-Fill | YA | Diekstrak otomatis dari agregasi data makanan harian. |
| **Evaluasi Snack (Top/Bottom)** | Auto-Fill | YA | Diekstrak otomatis dari agregasi data snack harian. |
| **Rencana Tindakan (Action Plan)**| Textarea | YA | Ini adalah **satu-satunya kolom evaluasi yang wajib diketik manual oleh SPV** di seksi ini. Karena datanya sudah disediakan mesin, tugas SPV adalah berpikir krisis dan menuliskan strategi untuk mengatasinya. |

### 3.2 Tab 2: Komplain & Evaluasi Performa Staff
Tab ini memisahkan antara metrik insiden pelayanan dengan penilaian individu staf (SDM) di minggu tersebut.

**A. Komplain & Kendala Mingguan**
| Field Name | Tipe Input | Wajib? | Deskripsi & Logika UI |
| :--- | :--- | :---: | :--- |
| **Total Kasus Komplain** | Number | YA | **Input Manual:** SPV mengisi angka ini berdasarkan rekap manual. *(Bukan auto-fill agar SPV secara sadar menghitung dan merenungkan banyaknya komplain minggu ini).* |
| **Total Remake** | Number | YA | **Input Manual:** Jumlah pesanan yang harus dibuat ulang. **Font Berwarna Merah:** Warna merah disengaja secara desain psikologis karena setiap 1 *remake* melambangkan kerugian bahan baku murni (HPP) bagi perusahaan. |
| **Penyebab Utama Komplain**| Text | YA | **Teks Bebas:** Sengaja bukan *dropdown* karena SPV diwajibkan menyimpulkan *Akar Masalah (Root Cause)* yang unik (Misal: "Susu UHT sering basi sebelum waktunya"). |
| **Kendala Utama Berulang** | Textarea | YA | **Teks Bebas:** Kolom ini menuntut SPV menganalisa masalah operasional makro yang terus mengulang selama 7 hari, sehingga GM bisa melihat dan mengeksekusi solusi sistemik. |

**B. Evaluasi Performa Staff**
Sistem akan memunculkan daftar nama staf. *(Catatan operasional: Untuk saat ini anggaplah nama yang muncul adalah staf internal di outlet SPV yang login).*
Setiap nama staf memiliki kotak *Accordion* (bisa dilipat) yang menyimpan form penilaian:
| Field Name | Tipe Input | Wajib? | Deskripsi & Tujuan Penilaian |
| :--- | :--- | :---: | :--- |
| **Status Penilaian** | Dropdown | YA | SPV wajib melabeli staf ke dalam 1 dari 3 kategori performa mingguan:<br>• **Berkembang:** Staf memiliki inisiatif, belajar cepat, dan minim komplain.<br>• **Stagnan:** Staf bekerja "sekadar selesai", tidak ada kemajuan namun tidak ada pelanggaran berat (Zona Nyaman).<br>• **Menurun:** Sering terlambat, melanggar SOP keramahan, lambat.<br>*Data ini menjadi pondasi GM untuk kenaikan gaji, bonus, atau SP.* |
| **Keterangan (Kendala & Planning)**| Textarea | YA | Label di atas tidak sah tanpa penjelasan. SPV **WAJIB** merincikan *Kendala/Kemajuan* staf tersebut, lalu ditutup dengan *Planning* (Rencana/Pelatihan) untuk minggu depan. <br>*(Contoh pengisian: "Kemajuan: Sudah lancar kasir. Planning: Minggu depan akan diajarkan kalibrasi grinder").* |

### 3.3 Tab 3: Rencana Perbaikan Tim
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Rencana Perbaikan** | Textarea Array | YA | Menambah rencana perbaikan untuk minggu depan secara dinamis. |

---

## BAB 4: LAPORAN BULANAN (EVALUASI STRATEGIS)

### 4.1 Tab 1: Identitas & Metrik Penjualan
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Bulan & Outlet** | Month Picker | YA | Validasi outlet dan bulan. |
| **Sales Real vs Target** | Currency | YA | Persentase agregat omset sebulan penuh (Rp). |
| **Ringkasan Eksekutif** | Textarea | YA | Pencapaian Utama, Masalah/Isu Utama, Kesimpulan Keseluruhan. |
| **Evaluasi Produk** | Text, Number | YA | Top 5 & Bottom 3 dengan Rencana Strategis (Promo/Hapus/Lainnya). |
Berbeda dengan Laporan Mingguan yang bersifat "Taktis", Laporan Bulanan bersifat "Strategis" dan menuntut SPV untuk mengevaluasi dirinya sendiri secara radikal (Self-Reflection).

### 4.1 Tab 1: Ringkasan & Sales

*(Catatan: Logika Indikator Draft, Tombol Reset/Kembali, dan Stepper Navigasi di halaman ini sama persis dengan yang ada pada Laporan Harian).*

**A. Identitas & Periode (Sangat Krusial)**
Bagian ini adalah tuas utama (*Master Switch*) dari seluruh halaman Laporan Bulanan. Kesalahan di sini berakibat fatal pada tarikan data di bawahnya.

| Field Name | Tipe Input | Wajib? | Peran Kritis & Logika Sistem |
| :--- | :--- | :---: | :--- |
| **Nama Supervisor** | Teks (Autocomplete) | YA | **Fungsi Akuntabilitas:** Mencatat secara sah SPV mana yang membuat evaluasi strategis ini. Dilengkapi fitur *Autocomplete* cerdas—sistem akan memfilter *database* dan hanya memunculkan daftar staf internal dari outlet tempat SPV tersebut ditugaskan. |
| **Outlet** | Dropdown | YA | Mengunci ruang lingkup data (Perintis / Dg Tata). Data SPV dan target omset yang ditarik *backend* akan murni berasal dari outlet ini. |
| **Bulan Laporan** | Month Picker (Date) | YA | **Pemicu Utama Mesin (Core Trigger):** Ini adalah *field* paling vital. Pemilihan bulan di kotak ini bertindak sebagai parameter *query*. Seketika SPV mengubah bulan, sistem *backend* (GAS) akan langsung menghisap seluruh rekam jejak Laporan Harian di bulan tersebut. Jika SPV salah memilih bulan, maka seluruh data *Auto-Fill* di bawahnya (Metrik Omset, Evaluasi Produk, Komplain) akan memunculkan rentetan data yang salah sasaran. |

**B. Metrik Penjualan (Kotak Mode Gelap / Dark Mode)**
Untuk menegaskan bahwa ini adalah "Angka Suci" (Uang), blok desain ini sengaja diwarnai hitam elegan (*Dark Box*).
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Total Sales Real (Rp)** | Currency (Auto-Fill)| YA | Ditarik otomatis dari kalkulasi total penjualan harian. Teks berwarna putih elegan. |
| **Target Sales (Rp)** | Currency (Auto-Fill)| YA | Ditarik otomatis dari target yang dipasang SPV di "Pengaturan Parameter". |
| **Persentase Pencapaian**| Kotak Teks Dinamis| YA | Sistem membagi *Sales Real* dengan *Target Sales*. Berbeda dengan mingguan yang menggunakan *progress bar* melintang panjang, di sini ditampilkan dalam kotak abu-abu gelap ringkas yang berisi angka persentase (Misal: **119%**). |

**C. Ringkasan Eksekutif**
Ini adalah 3 paragraf kualitatif yang wajib diserahkan SPV kepada GM sebagai "Surat Pengantar".
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Pencapaian Utama Bulan Ini** | Textarea | YA | SPV membanggakan keberhasilan terbesar (Misal: "Berhasil melampaui target sales hingga 110%"). |
| **Masalah / Isu Utama** | Textarea | YA | Pengakuan masalah makro (Misal: "Sering terjadi pemadaman listrik di minggu ke-2"). |
| **Kesimpulan Keseluruhan** | Textarea | YA | Opini SPV mengenai status operasional bulan ini (Lancar/Chaos/Perlu Banyak Perbaikan). |

**D. Evaluasi Kategori Produk (Accordion)**
Modul ini dipecah menjadi 4 *Accordion* yang bisa dilipat: **Minuman, Makanan, Snack, dan Lainnya**. Modul ini adalah nyawa dari strategi R&D Kafe.

| Field Name | Tipe Input | Wajib? | Deskripsi & Logika UI |
| :--- | :--- | :---: | :--- |
| **Top 5 Produk** | Read-Only (Auto-Fill) | — | Sistem akan otomatis memunculkan 5 nama menu paling laris beserta jumlah *Cup/Porsi* terjual sebulan ini. SPV **tidak bisa** dan **tidak perlu** mengeditnya karena ini murni data objektif mesin. |
| **Bottom 3 Produk** | Read-Only (Auto-Fill) | — | Menampilkan 3 produk "Paling Mati" (Paling tidak laku) di bulan ini beserta jumlah penjualannya yang miris. |
| **Rencana (Promo/Hapus/Dll)** | Text | YA | **Input Manual:** Terletak khusus di bawah setiap *Bottom 3 Produk*. Mesin memaksa SPV memikirkan *Action Plan* secara manual untuk produk mati ini. SPV wajib mengetikkan strategi, misalnya *"Bikin Bundling"*, *"Hapus dari menu"*, atau *"Tingkatkan kualitas rasa"*. |

### 4.2 Tab 2: Staff & QC (Quality Control)
Fokus pada mentalitas SDM, tingkat kedisiplinan, dan konsistensi kualitas produk selama 30 hari terakhir.

**A. Evaluasi Operasional Staff**
Bagian ini menampar SPV dengan fakta objektif lapangan.
| Field Name | Tipe Input | Wajib? | Deskripsi & Logika UI |
| :--- | :--- | :---: | :--- |
| **% Kepatuhan SOP** | Read-Only | — | **Auto-Fill:** Ditarik langsung dari skor rata-rata audit SOP mingguan. |
| **Total Telat (Kali)** | Read-Only | — | **Auto-Fill:** Berwarna merah tebal. Mengakumulasi berapa kali staf datang terlambat dalam sebulan. Angka ini tidak bisa dimanipulasi SPV. |
| **SP / Teguran Keluar** | Number | YA | **Input Manual:** Berwarna merah. SPV wajib mengisi berapa kali Surat Peringatan (SP) atau teguran lisan keras yang dikeluarkan bulan ini. |

**B. Turnover (Karyawan Resign)**
Ini adalah nyawa dari metrik Retensi HRD GM. UI didesain sangat menonjol.
| Komponen Layar | Fungsi & Interaksi |
| :--- | :--- |
| **Kotak Hitam (Total)** | Menampilkan angka raksasa jumlah staf yang *resign* bulan ini. Otomatis bertambah saat SPV menekan tombol tambah. |
| **Daftar Staf Resign** | Setiap staf yang resign akan muncul sebagai "Kartu" putih berisi *Nama*, *Alasan Resign*, dan *Tanggal Efektif*. Terdapat tombol *Trash* merah kecil di kanannya jika SPV salah menginput. |
| **Tombol + Tambah Staf Resign** | Membuka *Pop-up Modal* khusus bagi SPV untuk memasukkan data karyawan yang keluar, lengkap dengan interogasi alasannya. |

**C. Evaluasi Performa Individu (Sistem Hybrid AI)**
Berbeda dengan mingguan yang diisi mentah, bulanan menggunakan sistem *Hybrid*. Terdapat peringatan kecil di atasnya: *"Sistem menampilkan rekomendasi tren... SPV berhak mengubah"*.
| Field Name | Tipe Input | Wajib? | Deskripsi Arsitektur |
| :--- | :--- | :---: | :--- |
| **Kotak Accordion Staf** | UI Lipat | — | Menampilkan nama staf, posisi, dan *Badge Status* berwarna (Hijau: Berkembang, Abu: Stagnan, Merah: Menurun). Jika diklik, kotak ini terbuka. |
| **Status Penilaian** | Dropdown | YA | **Pre-filled (Diisi Otomatis):** Mesin akan merata-rata nilai mingguan staf tersebut dan memberikan saran awal (Misal: Stagnan). Namun SPV bisa menggantinya jika dirasa staf tersebut layak mendapat nilai lebih baik. |
| **Catatan / Alasan** | Textarea | YA | Ruang bagi SPV untuk memberikan argumen akhir (rapor bulanan) staf tersebut. |

**D. Rekap Quality Control (QC) & Komplain**
Membahas kualitas fisik produk yang disajikan ke pelanggan.
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Total Kasus Komplain** | Read-Only | — | **Auto-Fill:** Total komplain dari akumulasi laporan mingguan. |
| **Total Remake Produk** | Read-Only | — | **Auto-Fill (Teks Merah):** Angka kebocoran HPP akibat produk gagal. |
| **Evaluasi QC Espresso** | Textarea | YA | SPV sebagai QA (*Quality Assurance*) wajib menilai secara kualitatif konsistensi rasa kopi (Espresso) sebulan terakhir. |
| **QC Produk Lainnya (Dinamis)** | Tombol Hitam + 3 Form | Opsi | Terdapat tombol hitam kecil **+ TAMBAH**. Secara otomatis sistem akan melahirkan "Kartu Evaluasi" baru yang bisa diulang tak terbatas. Tiap kartu memiliki fitur **Hapus (merah)** dan mewajibkan SPV mengisi 3 hal: <br>1. **Nama Produk:** Teks spesifik (Misal: Aren / Matcha).<br>2. **Penyebab Komplain:** Masalah kualitas dominan (Misal: Terlalu manis, sirup bocor).<br>3. **Rekomendasi Perbaikan:** Solusi untuk operasional bulan depan. |

### 4.3 Tab 3: Evaluasi & Rencana Strategis
Ini adalah tahap akhir Laporan Bulanan di mana SPV meminta dukungan pendanaan dan merenungkan gaya kepemimpinannya sendiri.

**A. Fasilitas & Inventaris**
Blok yang fokus pada pelaporan kebocoran finansial (*maintenance*) dan eskalasi perbaikan alat.
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Total Pengeluaran Perbaikan (Rp)** | Number | YA | Uang yang dihabiskan SPV bulan ini untuk servis alat (dicetak tebal & merah). |
| **Kerusakan Belum Selesai (Eskalasi)** | Textarea | YA | Laporan kerusakan fatal (Misal: "Mesin Espresso rusak, butuh teknisi pusat"). |

**B. Strategi Bulan Depan**
| Field Name | Tipe Input | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| **Fokus & Strategi Utama** | Textarea | YA | Janji makro SPV untuk membesarkan omset outlet bulan depan. |
| **Kebutuhan Supervisor** | Textarea | YA | Permintaan dukungan ke GM (Misal: "Butuh *training* eksternal untuk staf kasir baru"). |

**C. Evaluasi Mandiri Supervisor (Paling Intim)**
Memaksa SPV untuk merenung, menilai kesehatan mental operasionalnya, dan membedah kepemimpinannya sendiri.
| Field Name | Tipe Input | Wajib? | Deskripsi Kualitatif |
| :--- | :--- | :---: | :--- |
| **Pencapaian Terbaik Pribadi**| Textarea | YA | SPV memamerkan prestasinya (Misal: "Berhasil menekan angka telat staf bulan ini"). |
| **Tantangan Tersulit** | Textarea | YA | Pengakuan jujur tentang titik kelemahannya (Misal: "Kewalahan mengatur jadwal libur saat lebaran"). |
| **Pandangan Ke Depan** | 3 Form Mix | YA | Terdiri dari 3 *field*: Konfirmasi ulang **Jumlah Staf Resign**, **Strategi & Rencana Bulan Depan**, dan **Kebutuhan/Eskalasi ke GM**. |
| **Skill Yang Ingin Ditingkatkan**| Textarea | YA | Refleksi diri SPV. Area kemampuan apa yang mereka rasa kurang dan ingin mereka asah (Misal: "Komunikasi & Problem Solving"). |
| **Rating Kinerja Sendiri** | Slider (Range)| YA | Ditempatkan di dalam kotak khusus (*Grey Box*). SPV wajib menggeser *Slider* dari skala **1 - 10** untuk merating kehebatan dirinya sendiri bulan ini. Angkanya akan tercetak tebal dan membesar di sebelah kanan *slider*. |

*(Catatan: Tiga tombol eksekusi bawah — **Simpan Draft, Export PDF, Tinjau & Kirim** — memiliki logika keamanan, pencegahan data hilang, dan validasi pratinjau modal yang **sama persis** dengan Laporan Mingguan).*

---

## BAB 5: PENGATURAN PARAMETER & MASTER DATA

Halaman ini adalah ruang kendali administratif (*Control Room*) yang wajib dikunjungi SPV setiap awal bulan. Konfigurasi di sini akan menyuntikkan kecerdasan ke dalam algoritma Dashboard GM.

### 5.1 Form Target Omset Bulanan
**Fakta Kritis Sistem:** Angka Target Omset pada aplikasi **TIDAK DI-SETTING OLEH GM**. Wewenang ini didelegasikan penuh kepada SPV. Jika SPV lupa memasang target, semua bar persentase di aplikasi akan macet atau membaca 0%.

| Komponen Layar | Tipe Input | Dampak Terhadap Mesin Kalkulasi |
| :--- | :--- | :--- |
| **Outlet** | Read-Only | Sistem mendeteksi otomatis *Outlet* dari profil SPV saat login (Misal: Perintis). Terkunci dan tidak bisa diedit. |
| **Bulan & Tahun** | Dropdown | Menentukan untuk periode mana target ini berlaku. Jika SPV salah memilih bulan, perhitungan persentase pencapaian di bulan tersebut akan error. |
| **Total Target (Rp)** | Text (Rupiah) | Memiliki fitur *Auto-Format*. Saat diketik, sistem otomatis menyisipkan titik (ribuan). Angka ini menjadi "napas utama" kalkulasi omset harian dan bulanan. |
| **Tombol SIMPAN TARGET** | Black Button | Menyimpan data ke *database* dengan animasi *loading* eksklusif (*Newton's Cradle*) agar SPV tahu data sedang diproses. |

### 5.2 Kalender Event & Faktor Eksternal (Pemetaan Trafik)
Alat komunikasi krusial bagi SPV untuk melaporkan anomali trafik kepada GM secara proaktif, sehingga GM tidak marah buta ketika omset anjlok.

**A. Form Tambah Event Baru**
| Komponen Layar | Deskripsi Spesifik |
| :--- | :--- |
| **Kategori Event** | *Dropdown* dengan pilihan: **Kalender Akademik (Kampus)**, **Event Lokal / Festival**, dan **Lainnya**. |
| **Nama Event** | Teks singkat penjelas kejadian (Contoh: "UAS Universitas Hasanuddin" atau "Hujan Badai 3 Hari"). |
| **Tgl Mulai & Tgl Selesai** | *Date Picker*. Sangat vital bagi AI Dashboard GM untuk mengukur korelasi antara tanggal *event* ini dengan tanggal grafik omset yang menukik/naik. |
| **Tombol SIMPAN PARAMETER**| Tombol eksekusi hitam. Setelah disimpan, *event* akan turun ke daftar di bawahnya. |

**B. Event Tersimpan**
Area daftar visual (*List*) di bawah form. Jika belum ada, akan muncul teks abu-abu *"Belum ada event parameter yang tersimpan."* Jika ada, *event* akan berjejer dan bisa dihapus kapan saja jika dibatalkan/salah input.

### 5.3 Kelola Staf Outlet (Tombol Bawah)
Di ujung bawah layar (melayang / *sticky*), terdapat tombol hitam panjang bertuliskan **KELOLA STAF OUTLET**. 
- Ini adalah pintu masuk ke formulir *Master Data HRD*. 
- SPV dapat menambah staf baru atau mengubah status staf menjadi "Resign".
- Perubahan di sini akan langsung berdampak pada *Dropdown Autocomplete* setiap kali SPV mengisi laporan kinerja staf di tab-tab sebelumnya.

---

## BAB 6: SISTEM KEAMANAN & INTEGITAS DATA

### 6.1 Race-Condition Lock & Anti-Spam
- **Logika Pencegahan:** Sistem menahan pengiriman ganda selama 10 detik setelah tombol Submit ditekan, melindungi database dari duplikasi.

### 6.2 Autosave & Draft Recovery
- **Penyimpanan Lokal:** Setiap input langsung tersimpan di `LocalStorage` browser.

### 6.3 The Apostrophe Rule & Sanitasi Input
Google Sheets memiliki autokoreksi tanggal (*locale* AS). Tanggal `10-08-2026` bisa berubah menjadi 8 Oktober.
- **The Apostrophe Rule:** *Backend* Zero Cafe memaksakan tanda kutip tunggal (`'`) sebelum menyimpan tanggal (misal: `"'10-08-2026"`). Menjamin *Plain Text* murni tanpa korupsi.
- **Sanitasi Uang:** Input mata uang seperti "Rp 3.500.000" dicincang otomatis menggunakan regex `/[^0-9]/g` menjadi angka murni `3500000`, mencegah error `#VALUE!`.

---

## BAB 7: DASHBOARD GENERAL MANAGER (TAB 1: FINANSIAL & KINERJA)
Bagian ini adalah otak utama *Zero Cafe App*. Setiap angka yang tampil di sini bukan sekadar pajangan, melainkan hasil agregasi ribuan sel data dari laporan lapangan SPV yang diterjemahkan menjadi wawasan strategis melalui *interface* tabel dan grafik.

### 7.1 Mode Waktu (Time-Awareness Detection)
| Lencana Mode | Rentang Filter | Fokus Algoritma AI |
| :--- | :--- | :--- |
| **MODE OPERASIONAL (Biru)** | $\le 7$ Hari | Evaluasi *tactical* harian & mendeteksi anomali cuaca terhadap trafik seketika. |
| **MODE TAKTIS (Indigo)** | $8 - 90$ Hari | Evaluasi tren *mid-term* (Mingguan/Bulanan) dan kinerja penyelesaian masalah oleh SPV. |
| **MODE STRATEGIS (Ungu)** | $>90$ Hari | AI secara cerdas mematikan metrik harian yang bising. Fokus murni pada strategi bisnis makro, pertumbuhan tahunan, dan *survival* outlet. |

### 7.2 AI Summary (Lencana Keputusan Sistem)
Muncul di bagian paling atas untuk memberikan kesimpulan eksekutif instan hasil *cross-referencing* matriks data (Omset, SOP, Cuaca, Absensi).
| Skenario Data Lapangan | Warna Lencana | Template Kalimat AI (Library) | Saran Aksi (Sistem) |
| :--- | :---: | :--- | :--- |
| Omset rekor + Kebersihan hancur | Kuning / Merah | *"Fatigue Limit (Batas Kelelahan Tim) Tercapai. Transaksi tinggi mengorbankan kualitas."* | Tambah staf *Part-Time* / Perhatikan kapasitas dapur. |
| Ada Event + Tanggal Tua | Kuning | *"Trafik Padat, Daya Beli Rendah (Event: [Nama] + Tanggal Tua)."* | Jangan tambah staf ekstra, alihkan energi ke kebersihan. |
| Ada Event + Tgl Muda + Omset Tercapai| Hijau | *"Momen Emas (Golden Era): Peluang mencetak rekor omset."* | Pastikan staf wajib *full-team* & kondisi prima. |
| Staf telat sangat parah | Merah | *"Prediksi Churn Akut: Rasio keterlambatan sangat tinggi. Indikasi demotivasi."* | Waspada staf berisiko *resign* mendadak. |
| Hujan ekstrim + Kebersihan anjlok | Kuning | *"Fasilitas rentan cuaca ekstrem. Hujan berkorelasi dengan kebersihan anjlok."* | Terapkan SOP *Double-Mopping* & Karpet Anti-Slip. |

### 7.3 Metrik Keuangan Utama (Total Omset & YTD)
| Komponen Visual | Sumber Tarikan Data | Fungsi / Cara Baca Eksekutif |
| :--- | :--- | :--- |
| **Total Omset (Rp)** | Agregasi Omset Shift 1 + Shift 2 | Total uang riil yang masuk pada rentang tanggal yang dipilih GM. |
| **Persen Tren MoM (+/-)** | Omset hari ini vs Tanggal sama bulan lalu | *Month-over-Month (MoM)*. Menunjukkan persentase pertumbuhan (Hijau) atau penyusutan (Merah). Muncul otomatis sebagai lencana kecil (contoh: `▲ +5% bln lalu`) di sebelah omset *jika* ada data pembanding dari bulan sebelumnya. |
| **Target Omset (Rp) & Bar** | Form Pengaturan Parameter SPV | Bar hijau akan otomatis terisi secara visual (proporsional 0-100%) merespons jarak antara Omset Aktual terhadap Target bulanan SPV. |
| **YTD Trajectory (Rp & %)** | Akumulasi 1 Januari s/d Hari Ini | Memantau "napas bisnis" tahunan. Angka target tahunan **diinput langsung oleh GM melalui menu Pengaturan GM (bukan SPV)**. Persentase YTD (`Omset YTD / Target Tahunan`) membantu GM sadar posisi bisnis secara makro. Jika persen masih merah di bulan Oktober, GM wajib menyuntik dana marketing. |

### 7.4 Metrik Transaksi & Visualisasi (Grafik)
| Komponen Visual | Sumber Tarikan Data | Fungsi / Cara Baca Eksekutif |
| :--- | :--- | :--- |
| **Total Transaksi** | Total Struk (Laporan Harian Fase 2 Pagi) | Jumlah antrean pelanggan (meja) yang berhasil dilayani. |
| **Average Ticket Size (ATS)** | `Omset Total / Total Transaksi` | Menilai efektivitas *Upselling* kasir. Semakin besar angkanya, semakin pintar staf membujuk tamu agar belanja lebih mahal. |
| **Trend Line Chart** | Total Omset per Hari (Time-Series) | Grafik garis. Titik *peak* (lembah/puncak ekstrem) mempermudah mata melihat di tanggal berapa persisnya omset anjlok. |
| **Day of Week (Bar Chart)**| Agregasi Omset per Nama Hari | Menyortir seluruh omset dalam rentang waktu yang dipilih (misal setahun penuh), lalu menjumlahkan seluruh hari Senin, Selasa, dst., untuk dicari rata-ratanya. Tujuannya mutlak: **Mencari Hari Terlemah rata-rata** agar GM bisa membuat promo tematik, serta **Hari Terkuat rata-rata** untuk menyiapkan staf *full-team*. <br><br> **Terdapat Dropdown AI Strategy (Rekomendasi untuk memaksimalkan Hari Terlemah):** <br> Harap dicatat, ini **bukanlah AI LLM sungguhan**, melainkan *template statis* (rule-based) di mana sistem akan otomatis menyisipkan kata `[Nama Hari Terlemah]` ke dalam tiga pilar template baku berikut:<br> • **Optimasi SDM:** *"Jadwalkan libur bergilir (off) staf pada hari [Hari Terlemah] untuk efisiensi payroll."*<br> • **Marketing:** *"Buat special deals atau bundling khusus yang hanya berlaku di hari [Hari Terlemah]."*<br> • **Maintenance:** *"Lakukan perawatan mesin atau pembersihan intensif di hari sepi ini..."* |

### 7.5 Indikator Operasional (Tab 1)
Tepat di bawah grafik utama, terdapat 4 kotak besar yang merangkum kesehatan operasional outlet.
| Komponen Visual | Sumber Data & Logika | Cara Baca (Warna & Status) |
| :--- | :--- | :--- |
| **SOP Keramahan** | Rata-rata dari nilai audit SPV harian. | Menunjukkan persentase kedisiplinan staf dalam menyapa pelanggan. Jika <90%, warna menjadi merah (Kritis). |
| **Target Penjualan** | Perbandingan Total Omset Aktual terhadap Target bulanan SPV. | Akan memunculkan label **"TERCAPAI"** (Hijau) jika jarak aktual melampaui target, dan **"GAGAL"** (Merah) jika di bawah target. |
| **Komplain Bulanan** | Hitungan form `komplainTotal`. | Membandingkan dengan angka mutlak *Max 2*. Jika bulan ini komplain sudah mencapai angka 3, kotak akan menyala merah (KPI Dilanggar). |
| **Turnover Barista** | Form evaluasi bulanan SPV. | Membandingkan dengan angka mutlak *Max 1*. Jika dalam sebulan ada 2 staf keluar, akan muncul label "RISIKO KRITIS" karena melanggar KPI Kestabilan SDM. |

### 7.6 Marketing Intelligence (BETA) & Konteks Eksternal
Bagian ini adalah otak analitik yang ditarik secara dinamis dari *Marketing Intelligence Engine v3.0* (`Code.gs`) dengan menekan tombol **"Simpan & Tarik Analisis"**. 
Terdapat pengaturan **Benchmark ATS (Target rata-rata per struk)**, di mana angka default-nya adalah **Rp 30.000**. Angka ini bisa diganti oleh GM sesuai harga jual *hero product* outlet (saran: gunakan harga secangkir kopi signature + 1 pastry).

Saat tombol ditekan, sistem akan meng-generate "Pills" (Modul) yang jika diklik (*accordion* terbuka) akan memunculkan diagram analisis terperinci.

| Modul (Pill) | Tampilan Diagram (Jika Diklik) | Sumber Data & Logika Kesimpulan | Cara Baca (Warna & Status) |
| :--- | :--- | :--- | :--- |
| **Tren Omset Mingguan** | **Bar Chart (Hitam):** Menampilkan rata-rata omset per minggu/hari. | Perbandingan rata-rata harian dengan minggu sebelumnya. | **Sehat (Hijau):** Naik ≥ 5%. <br> **Perhatian (Kuning):** Stagnan (selisih < 5%). <br> **Kritis (Merah):** Turun ≤ -5%. |
| **Korelasi Kebersihan & Omset** | **Dual-Axis Chart:** Garis Hijau (Skor Kebersihan %) disandingkan dengan Bar Hitam Transparan (Omset Harian Rp). | Persentase pencapaian omset disilangkan dengan Rata-rata Skor Kebersihan harian. | **Kritis (Perfect Storm):** Omset tinggi (≥90%) tapi kotor (<70%). <br> **Kritis (Lazy Shift):** Sepi (<70%) dan kotor (<70%). <br> **Positif:** Standar ideal (>85% omset, >90% bersih). |
| **SDM & Risiko Operasional** | **Donut Chart (Pie Berlubang):** Hijau (Tepat Waktu), Merah (Terlambat), Abu-abu (Izin/Alfa). | Menghitung persentase keterlambatan dari DB_Kehadiran_Staf. | **Krisis (Merah):** Telat > 15%. Peringatan keras (SP). <br> **Warning (Kuning):** Telat 5-15%. SPV wajib *briefing*. <br> **Positif (Hijau):** Kedisiplinan tinggi. |
| **Benchmarking ATS Industri** | **Bar Chart Horizontal:** Membandingkan Bar Hitam (ATS Aktual) vs Bar Abu (Benchmark Target). | Rata-rata transaksi dibanding Target ATS yang di-set GM (Rp 30.000). | **Meningkat:** ATS aktual > Benchmark. *Upselling* berhasil. <br> **Menuju Target:** 75%-99% dari Benchmark. <br> **Di Bawah Standar:** <75%. Gagal *cross-selling*. |
| **Analisis Menu** | **Horizontal Bar Chart:** Batang Hijau (Hero) dan Batang Oranye (Dead). Menampilkan frekuensi muncul. | Agregasi Top 3 & Bottom 3 dari DB_Kinerja_Produk. | **Hero Product:** Batang hijau. Konsisten di daftar terlaris. Jadikan ujung tombak diskon. <br> **Dead Menu:** Batang oranye. Konsisten di posisi terbawah. Saran aksi: diskon cuci gudang atau hapus dari menu. |
| **Profil Pengunjung Mayoritas**| *(Teks Statis)* | Agregasi *Dropdown* form Laporan Harian SPV (Tab 1). | Contoh: *"Mahasiswa Nugas"*. Menjadi basis penentuan promosi (misal: *bundling WiFi*). |
| **Kondisi/Event Dominan** | *(Teks Statis)* | Agregasi *Dropdown* Cuaca/Event form harian. | Contoh: *"Cuaca Hujan/Badai (60%)"*. Memberi konteks kewajaran jika tren omset turun (faktor eksternal). |

### 7.7 Analisis Performa Produk (Kinerja Kategori)
Tepat di bawah kontainer *Marketing Intelligence*, terdapat sebuah *accordion standalone* yang membedah secara spesifik kinerja produk per kategori secara *real-time*.

| Komponen Visual | Sumber Data & Logika | Cara Baca Eksekutif |
| :--- | :--- | :--- |
| **Catatan Analisis** | Teks keterangan statis. | Memberi tahu GM bahwa tren penjualan ini murni diakumulasikan dari data Laporan Harian SPV (bukan asumsi sistem) berdasarkan outlet dan rentang waktu yang sedang dipilih. |
| **Kategori Menu (Minuman, Makanan, Snack)** | Fungsi `renderCategorySection` | Memecah data berdasarkan kategorinya, sehingga tidak tercampur. Untuk tiap kategori, akan ditampilkan **Top 5** produk paling laku, dan **Bottom 3** produk paling tidak laku. |
| **Rencana Tindakan (Action Plan)** | Input teks `action_plan` dari form harian SPV | Khusus untuk daftar Bottom 3, sistem akan menampilkan opini/rencana yang diketik langsung oleh SPV di lapangan (contoh: *"Bahan baku mau kedaluwarsa, kami usulkan flash sale promo"*). GM tidak perlu menduga-duga solusi. |

### 7.8 Tab Operasional & Layanan (Indikator Lapangan)
Tab ini memindahkan fokus GM dari sekadar angka finansial ke "biaya & komplain" yang terjadi di lapangan. Di tab ini, mode taktis/strategis (Smart Briefing Mode) tetap terlihat di bagian atas.

| Komponen Visual | Sumber Data & Logika | Fungsi & Cara Baca Eksekutif |
| :--- | :--- | :--- |
| **AI Insight: Higienisitas** | *Circular Progress Bar* (%) dari rata-rata kebersihan. Logika silang antara pencapaian Omset vs SOP Kebersihan. | Memberi kesimpulan instan. Contoh *library* pesan yang muncul:<br> • **Sales Naik, SOP Turun:** Omset tembus target, tapi kebersihan <95%. Jangan sampai *quality control* kendor saat ramai.<br> • **Peringatan Ganda:** Omset gagal, dan kebersihan <95%. Butuh intervensi GM segera.<br> • **The Good Standard:** Semuanya beres (SOP >95%). |
| **Area Kritis (Kebersihan)** | Membaca kotak *checklist* area di form harian SPV yang skornya jelek. | Berwarna merah menyala. Memunculkan list spesifik (misal: *1. Toilet (Skor: 90%) - Bersih*). GM langsung tahu persis titik lemah outlet hari itu tanpa perlu baca laporan panjang. |
| **Galeri Pengeluaran (Bahan & ATK)** | Array `listPengeluaran` (Form Laporan Harian) | Berbentuk *horizontal slider* (bisa digeser ke samping). Menampilkan visual foto nota belanja *petty cash* SPV beserta item dan harganya. Jika kosong, akan tertulis *"Aman. Tidak ada pengeluaran"*. Jika kotak ini berwarna Biru, GM bisa klik foto nota untuk memperbesar (mencegah *fraud* nota fiktif). |
| **Maintenance & Eskalasi Fasilitas** | Array `listEskalasi` (Form Laporan Harian) | Berbentuk galeri foto berwarna kemerahan. GM melihat foto aset apa yang butuh teknisi segera (misal: AC bocor, Mesin Espresso *error*). Jika diabaikan, omset besok pasti turun. |
| **Statistik Komplain & QC** | Hitungan agregat form `komplainTotal`. | Sangat tegas. Warna tipografi otomatis berubah:<br> • **Aman (Hijau):** 0 Komplain.<br> • **Waspada (Kuning):** 1 Komplain.<br> • **Batas Maksimal (Oranye):** 2 Komplain.<br> • **Kritis KPI Dilanggar (Merah):** >2 komplain sebulan. |

### 7.9 Tab SDM & Evaluasi (Kesehatan Tim)
Menggantikan rutinitas *meeting* basi. Di tab ini, GM bisa langsung melihat siapa SPV yang "berkeringat" dan mana yang tidak, serta memantau kesehatan operasional tim secara makro. 

> [!NOTE] 
> **Kenapa tampilan Tab SDM Anda mungkin terlihat berbeda (seperti di screenshot)?**
> Tab ini sangat dinamis! Sistem akan **menyembunyikan** beberapa *accordion* analisis individu staf (seperti *Minus Kas* atau *Revenue SPV*) jika Anda sedang berada di **Mode Strategis (>95 Hari)** atau jika data SPV tersebut kosong. Ini disengaja agar data tahunan tidak terdistorsi oleh pergantian (turnover) staf.

Secara penuh, terdapat **5 komponen (*accordion*)** yang akan muncul di tab ini jika semua syarat data terpenuhi:

| Komponen (Accordion) | Sumber Data & Logika | Cara Baca Eksekutif |
| :--- | :--- | :--- |
| **1. Kesehatan Tim & Aset** | Akumulasi form harian & bulanan (Tab 1 & 2) | Menampilkan 4 matriks indikator kesehatan: **SOP Keramahan Staf** (%), **Total Telat** (berubah merah jika sering), **Teguran (SP)**, dan **Turnover**. Terdapat juga rangkuman "Penyebab Kendala Staff Utama" untuk GM. |
| **2. Cash Discrepancy Fingerprint (Minus Kas)** | DB_Kasir (Algoritma Frekuensi Hadir) | *(Hanya muncul di Mode Taktis <95 hari).* Jika sering terjadi uang kas minus, sistem menghitung frekuensi kehadiran tiap staf tepat di hari hilangnya uang tersebut. Jika grafik satu nama menjulang tinggi, GM wajib melakukan intervensi (indikasi *fraud*). |
| **3. Revenue Per SPV Shift (Benchmark)** | DB_Kinerja_SPV | Fitur *Leaderboard*. Menghitung rata-rata omset riil per *shift* jaga tiap SPV. Membedakan secara nyata mana SPV yang hanya bisa mengatur jadwal, dan mana SPV yang jago jualan (*upselling*). |
| **4. Dominasi Topik Briefing SPV** | Ekstraksi kata dari input `topik_briefing` | Sistem melakukan *word count* (penghitungan kata kunci) dari topik briefing SPV (misal: "Bersih", "Telat"). AI kemudian memberikan korelasi otomatis (contoh: *Topik 'Bersih' sering disebut, namun skor Hygiene buruk, berarti eksekusi di lapangan lemah*). |
| **5. Pandangan Ke Depan & Evaluasi SPV** | Form Laporan Bulanan SPV (Tab 2) | GM bisa membaca isi kepala SPV tanpa disensor. Berisi: **Strategi Bulan Depan**, **Kebutuhan Approval GM**, **Pencapaian Terbaik**, dan **Tantangan Tersulit** yang dirasakan oleh pimpinan di lapangan. |

### 7.10 Arsip Laporan PDF (Dokumen Resmi)
Terletak melayang di bagian paling bawah Dasbor GM (muncul di semua tab) berupa sebuah menu **Accordion (Drop-up/Drop-down)** bertuliskan *ARSIP LAPORAN PDF*.

Jika *accordion* ini diklik, akan muncul daftar historis laporan yang pernah disubmit oleh SPV.
| Komponen List | Fungsi & Cara Baca Eksekutif |
| :--- | :--- |
| **Judul & Tanggal Upload** | Menampilkan nama file (contoh: *Laporan_Mingguan_Perintis.pdf*) beserta stempel waktu (`dateCreated`) riil kapan SPV menekan tombol Submit. |
| **Tombol PDF (View/Download)** | Setiap laporan SPV otomatis di- *generate* menjadi PDF oleh backend dan di- *hosting* ke Google Drive GM. GM cukup menekan tombol "PDF" ini untuk membukanya secara utuh. Berfungsi mutlak sebagai dokumen legal/fisik untuk diserahkan ke *Investor* atau Akuntan eksternal. |
