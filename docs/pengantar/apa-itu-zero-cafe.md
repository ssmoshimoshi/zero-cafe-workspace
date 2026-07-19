## BAB 1: APA ITU ZERO CAFE APP & KENAPA DIBUAT

### 1.1 Latar Belakang

Zero Cafe App adalah aplikasi pelaporan operasional harian yang dibangun secara khusus oleh **Acronimous Studio** untuk Zero Cafe. Aplikasi ini bukan aplikasi kasir (POS), bukan aplikasi stok, dan bukan aplikasi akuntansi. Fungsi utamanya adalah **menjadi mata dan telinga pemilik (owner) di outlet yang tidak bisa dikunjungi setiap hari**.

Melalui aplikasi ini:
- **Supervisor (SPV)** melaporkan kondisi lapangan secara terstruktur setiap hari.
- **General Manager (GM/Owner)** memantau kesehatan bisnis melalui Dashboard yang menampilkan angka-angka kunci secara otomatis.

### 1.2 Filosofi: Data-Driven Disciplinary

Setiap data yang diketik SPV bukan sekadar formalitas. Angka-angka tersebut dihitung secara otomatis oleh mesin di balik layar untuk menghasilkan **4 Indikator Kunci (KPI)** yang menentukan sehat atau tidaknya operasional kafe:

| No | KPI | Target | Artinya |
|----|-----|--------|---------|
| 1 | **Kepatuhan SOP (Keramahan)** | ≥ 95% | Seberapa sering staf menyapa dan melayani pelanggan dengan ramah |
| 2 | **Rata-rata Penjualan Harian** | Tidak boleh turun dari target bulanan | Omset harian harus konsisten menuju target |
| 3 | **Komplain Pelanggan Serius** | Maksimal 2 per bulan | Lebih dari 2 komplain = alarm merah |
| 4 | **Turnover Barista** | Maksimal 1 orang per 3 bulan | Staf yang keluar terlalu sering = operasional terganggu |

Keempat angka ini muncul di halaman pertama Dashboard GM sebagai **"Ringkasan 4 KPI Utama"** — sehingga owner cukup membuka aplikasi dan dalam 3 detik sudah tahu kondisi kafe.

### 1.3 Mekanisme Dua Fase (Fase 1 & Fase 2)

Karena outlet Zero Cafe beroperasi hingga larut malam (Perintis tutup jam 04:00 dini hari), tidak mungkin menunggu semua data selesai baru mengirim laporan. Oleh karena itu, pelaporan harian dibagi menjadi **dua tahap**:

| Fase | Kapan | Siapa | Isi |
|------|-------|-------|-----|
| **Fase 1 (Malam)** | Saat SPV selesai shift (±21:00) | SPV | 9 Tab inspeksi: Penjualan Shift 1, Kas, Staf, Briefing, QC, Kebersihan, Komplain, Fasilitas, Penutup |
| **Fase 2 (Pagi Besoknya)** | Sebelum jam 13:00 siang keesokan hari | SPV | Omset Shift 2, Total Struk Transaksi, Evaluasi Produk (Top 5 & Bottom 3), Komplain Susulan Malam, Absensi Staf Malam |

**Apa yang terjadi di balik layar?**
Saat SPV menekan tombol "Kirim" di Fase 1, sistem **belum mencetak PDF**. Sistem menyimpan data sementara dalam bentuk file cadangan (Draft JSON) di Google Drive. Keesokan paginya, saat SPV mengirim Fase 2, sistem menggabungkan kedua data, mencetak PDF final, dan menyimpan laporan lengkap ke database.

### 1.4 Jam Operasional Outlet

| Outlet | Buka | Tutup |
|--------|------|-------|
| **Perintis** | 08:00 | 04:00 (dini hari, setiap hari) |
| **Dg Tata** | 08:00 | 24:00 (Minggu–Kamis) / 01:00 (Jumat–Sabtu) |

**Jam Kerja SPV:** 12:00 siang – 21:00 malam (sama untuk kedua outlet).

### 1.5 Batas Waktu Laporan (Streak)

Untuk mendorong kedisiplinan, sistem memiliki fitur **Streak** (rantai keberhasilan):
- **Batas Akhir:** Laporan Fase 2 **wajib dikirim sebelum jam 13:00 (1 siang) keesokan harinya**.
- Jika terlambat melewati batas waktu tersebut, rantai Streak SPV akan **putus**.
- Streak ini terlihat di Dashboard GM sebagai indikator kedisiplinan SPV.

---

