## BAB 7: DASHBOARD TAB 1 — KEUANGAN & RINGKASAN KPI

Ini adalah layar pertama yang Anda lihat setelah login. Fungsinya: **dalam 10 detik, Anda sudah tahu kondisi kafe**.

### 7.1 Pengaturan Filter (Bagian Atas)

Sebelum data muncul, Anda perlu memilih:

| Filter | Fungsi |
|---|---|
| **Tanggal Mulai & Selesai** | Rentang waktu data yang ingin dilihat |
| **Outlet** | Perintis, Dg Tata, atau Semua |
| **Tombol "Simpan & Tarik Analisis"** | Memerintahkan sistem menarik data dari database |

### 7.2 Mode Waktu Otomatis (Smart Briefing Mode)

Sistem secara cerdas mendeteksi berapa hari rentang waktu yang Anda pilih, dan menyesuaikan gaya analisis:

| Lencana Mode | Rentang | Fokus Analisis |
|---|---|---|
| **MODE OPERASIONAL (Biru)** | ≤ 7 Hari | Evaluasi harian, deteksi anomali cuaca & staf |
| **MODE TAKTIS (Ungu)** | 8 – 95 Hari | Tren mingguan/bulanan, kinerja SPV |
| **MODE STRATEGIS (Ungu Tua)** | > 95 Hari | Strategi makro bisnis, pertumbuhan tahunan. Beberapa modul detail otomatis disembunyikan agar data tidak bising |

### 7.3 AI Summary (Kotak Warna di Bagian Atas)

Kotak ini adalah **kesimpulan eksekutif instan** yang dihasilkan mesin AI. Warna kotak menunjukkan tingkat urgensi:

| Warna | Artinya | Contoh Pesan |
|---|---|---|
| **Hijau** | Semuanya aman | "Momen Emas: Peluang mencetak rekor omset" |
| **Biru** | Normal, tidak ada anomali | "Kinerja stabil tanpa anomali" |
| **Kuning** | Ada peringatan, perlu perhatian | "Trafik padat, daya beli rendah (Event + Tanggal Tua)" |
| **Merah** | Kritis, butuh tindakan segera | "Batas Kelelahan Tim tercapai" atau "Prediksi staf resign mendadak" |

> **Penting:** Pesan AI ini bukan sekadar teks acak. Sistem menjalankan **4 algoritma berbeda** yang memeriksa silang antara omset, kebersihan, cuaca, kehadiran staf, dan event lokal. Penjelasan detail ada di BAB 10.

### 7.4 Total Omset & Target

Kotak hitam elegan yang menampilkan:

| Angka | Sumber Data | Cara Membaca |
|---|---|---|
| **Total Omset (Rp)** | Penjumlahan Omset Shift 1 + Shift 2 dari semua laporan harian | Uang riil yang masuk pada periode yang Anda pilih |
| **Tren MoM (±%)** | Perbandingan dengan bulan lalu | Lencana kecil hijau (naik) atau merah (turun) di sebelah angka omset |
| **Target Omset (Rp) + Bar** | Dari Pengaturan Parameter SPV | Bar hijau bergerak proporsional 0-100% |
| **YTD Trajectory (Rp & %)** | Akumulasi 1 Januari s/d hari ini vs Target Tahunan | Menunjukkan apakah bisnis on-track untuk mencapai target tahun ini. Target tahunan diatur oleh Anda di **Pengaturan GM** |

### 7.5 Metrik Transaksi & Grafik

| Komponen | Sumber Data | Cara Membaca |
|---|---|---|
| **Total Transaksi** | Total struk dari Fase 2 | Jumlah pelanggan yang berhasil dilayani |
| **Average Ticket Size (ATS)** | `Total Omset ÷ Total Transaksi` | Rata-rata belanja per pelanggan. Semakin besar = semakin pintar staf membujuk pelanggan belanja lebih |
| **Trend Line Chart** | Omset per hari (garis waktu) | Lihat di tanggal berapa omset anjlok atau meroket |
| **Day of Week (Bar Chart)** | Rata-rata omset per nama hari (Senin, Selasa, dst.) | **Hari Terlemah** = target promo. **Hari Terkuat** = siapkan staf penuh |

> Di bawah grafik Day of Week, terdapat **Rekomendasi AI** berupa 3 pilar saran otomatis (SDM, Marketing, Maintenance) yang menggunakan nama hari terlemah Anda.

### 7.6 Ringkasan 4 KPI Utama

Empat kotak besar yang menampilkan detak jantung bisnis Anda:

| Kotak | Sumber Data | Kapan Warna Berubah Merah |
|---|---|---|
| **SOP Keramahan** | Rata-rata dari audit SPV harian | Jika < 90% |
| **Target Penjualan** | Omset Aktual vs Target | Jika aktual di bawah target |
| **Komplain Bulanan** | Hitungan form komplain | Jika > 2 komplain sebulan |
| **Turnover Barista** | Form evaluasi bulanan SPV | Jika > 1 staf keluar per kuartal |

Di atas 4 kotak ini terdapat **Skor Operasional (0-100)** dengan label EXCELLENT / GOOD / ATTENTION / CRITICAL. Skor ini dihitung dari formula:

```
Skor Operasional = (Pencapaian Target × 50%) + (Skor Kebersihan × 30%) + (Kepatuhan SOP × 20%)
```

| Skor | Label |
|---|---|
| ≥ 85 | EXCELLENT |
| ≥ 70 | GOOD |
| ≥ 50 | ATTENTION |
| < 50 | CRITICAL |

---

