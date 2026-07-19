## BAB 9: DASHBOARD TAB 3 — SDM & EVALUASI

Tab ini menggantikan rutinitas meeting bulanan. Anda bisa langsung melihat siapa SPV yang berkinerja baik dan siapa yang perlu dievaluasi.

> **Catatan:** Beberapa bagian di tab ini otomatis **disembunyikan** jika Anda sedang di Mode Strategis (>95 hari). Ini disengaja agar data tahunan tidak terdistorsi oleh pergantian staf.

### 9.1 Kesehatan Tim & Aset

4 indikator kesehatan tim:

| Indikator | Sumber Data | Catatan |
|---|---|---|
| SOP Keramahan Staf (%) | Rata-rata dari laporan harian | Warna berubah sesuai persentase |
| Total Telat | Hitungan dari database kehadiran | Berubah merah jika sering |
| Teguran (SP) | Dari laporan bulanan SPV | — |
| Turnover | Dari laporan bulanan SPV | — |

### 9.2 Cash Discrepancy Fingerprint (Minus Kas)

> Hanya muncul di Mode Taktis (< 95 hari).

Jika sering terjadi uang kas minus, sistem menghitung **frekuensi kehadiran setiap staf** pada hari-hari saat kas minus terjadi. Hasilnya ditampilkan sebagai grafik batang:
- Jika satu nama menjulang tinggi, itu adalah **indikator potensi evaluasi** (bukan tuduhan langsung — lihat BAB 10 untuk penjelasan algoritma)
- Contoh: "Total Minus Rp 200.000. Terjadi saat Amel bertugas 26 kali, Eko 17 kali"

### 9.3 Revenue Per SPV Shift (Leaderboard)

Menghitung rata-rata omset per shift jaga tiap SPV:
- Membedakan secara nyata mana SPV yang hanya bisa mengatur jadwal, dan mana SPV yang pandai menjual (upselling)

### 9.4 Dominasi Topik Briefing SPV

Sistem menghitung kata kunci yang paling sering muncul di topik briefing SPV:
- Contoh: kata "Bersih" sering disebut, tapi skor kebersihan tetap buruk → **"Eksekusi di lapangan lemah"**

### 9.5 Pandangan Ke Depan & Evaluasi SPV

Berisi isi pikiran SPV dari laporan bulanan mereka:
- **Strategi Bulan Depan** yang direncakanan SPV
- **Kebutuhan Approval GM** — apa yang mereka minta dari Anda
- **Pencapaian Terbaik & Tantangan Tersulit** — kejujuran dari lapangan

### 9.6 Arsip Laporan PDF

Menu accordion di bagian paling bawah Dashboard. Berisi daftar historis semua PDF laporan yang pernah dikirim SPV:

| Kolom | Fungsi |
|---|---|
| Judul & Tanggal Upload | Nama file dan waktu submit |
| Tombol PDF | Klik untuk membuka atau mengunduh PDF dari Google Drive |

---

### 9.7 Marketing Intelligence (Tab 1 — Bagian Bawah)

Modul analisis lanjutan yang dipicu dengan tombol **"Simpan & Tarik Analisis"**. Terdapat pengaturan **Benchmark ATS** (default Rp 30.000) yang bisa Anda ubah.

Setelah tombol ditekan, muncul 5 modul dalam bentuk kotak lipatan (*accordion*):

| Modul | Diagram | Cara Membaca |
|---|---|---|
| **Tren Omset** | Bar Chart Hitam | Hijau jika naik ≥5%, Merah jika turun ≤-5%, Kuning jika stagnan |
| **Korelasi Kebersihan & Omset** | Dual-Axis Chart (Garis + Bar) | "The Perfect Storm" = Ramai tapi kotor. "The Lazy Shift" = Sepi dan kotor |
| **SDM & Risiko Operasional** | Donut Chart (Pie Berlubang) | Hijau = Tepat Waktu, Merah = Terlambat, Abu = Izin/Alpha |
| **Benchmarking ATS** | Bar Horizontal (Aktual vs Target) | Melebihi benchmark = upselling berhasil |
| **Analisis Menu** | Bar Horizontal (Hijau = Hero, Oranye = Dead) | Produk konsisten terlaris vs produk konsisten mati |

Di bawah 5 modul ini juga terdapat ringkasan:
- **Profil Pengunjung Mayoritas** — misal: "Mahasiswa Nugas"
- **Kondisi/Event Dominan** — misal: "Cuaca Hujan/Badai (60%)"

### 9.8 Analisis Performa Produk (Kinerja Kategori)

Accordion terpisah yang membedah kinerja produk per kategori secara detail:
- **Top 5** produk paling laku per kategori
- **Bottom 3** produk paling tidak laku
- **Action Plan** yang diketik SPV untuk setiap produk mati

---

