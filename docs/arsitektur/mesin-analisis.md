## BAB 10: MESIN ANALISIS — PARAMETER, THRESHOLD & FORMULA

### 10.1 Skor Operasional (Kotak Utama Tab 1)

**Formula:**
```
Skor = (Pencapaian_Target% × 0.5) + (Skor_Kebersihan% × 0.3) + (Kepatuhan_SOP% × 0.2)
```

| Skor | Label | Warna |
|---|---|---|
| ≥ 85 | EXCELLENT | Hijau |
| 70 – 84 | GOOD | Biru |
| 50 – 69 | ATTENTION | Kuning |
| < 50 | CRITICAL | Merah |

**Penjelasan:** Skor ini menggabungkan 3 pilar utama operasional. Bobot terbesar (50%) ada di pencapaian target omset, karena pada akhirnya kafe harus menghasilkan uang. Kebersihan (30%) di posisi kedua karena langsung mempengaruhi pengalaman pelanggan. Kepatuhan SOP (20%) di posisi terakhir karena bersifat jangka panjang.

### 10.2 Bar Persentase Pencapaian Target

| Persentase | Warna Bar |
|---|---|
| ≥ 100% | Hijau |
| 80% – 99% | Oranye |
| < 80% | Merah |

**Formula:**
```
Persentase = (Total_Omset_Aktual ÷ Target_Omset_Proporsional) × 100%
```

> **"Target Proporsional" — apa artinya?**
> Jika target bulanan Anda Rp 180.000.000 dan bulan ini 30 hari, maka target harian = Rp 6.000.000. Jika Anda memilih rentang 7 hari di dashboard, maka target proporsional = 7 × Rp 6.000.000 = Rp 42.000.000. Ini mencegah perbandingan yang tidak adil.

### 10.3 AI Predictive Summary (4 Algoritma Utama)

Kotak AI Summary di bagian atas Dashboard dihasilkan oleh 4 algoritma yang berjalan berurutan. Jika satu algoritma "menang" (kondisinya terpenuhi), ia akan menimpa algoritma di bawahnya:

#### Algoritma 1: Fatigue Limit (Batas Kelelahan Tim)
| Kondisi | Putusan |
|---|---|
| Rata-rata struk harian > 100 **DAN** Skor Kebersihan < 80% | **MERAH** — "Batas Kelelahan Tim tercapai. Tim butuh bantuan staf Part-Time!" |
| Rata-rata struk harian > 100 **DAN** Komplain > 2× jumlah hari | **KUNING** — "Transaksi tinggi mengorbankan kualitas" |

**Logika:** Jika kafe sangat ramai (>100 struk/hari) tapi kebersihan hancur, artinya staf kelelahan melayani pelanggan dan tidak sempat membersihkan kafe.

#### Algoritma 2: Cuaca × Kebersihan
| Kondisi | Putusan |
|---|---|
| Hari hujan ≥ 30% dari total hari **DAN** Kebersihan < 80% | **KUNING** — "Fasilitas rentan cuaca ekstrem. Terapkan SOP Double-Mopping!" |

**Logika:** Hujan deras menyebabkan lantai basah dan kotor. Jika kebersihan tetap buruk saat hujan, artinya tim tidak punya SOP cuaca buruk.

#### Algoritma 3: Burnout / Prediksi Resign
| Kondisi | Putusan |
|---|---|
| Rentang ≥ 7 hari **DAN** Rasio keterlambatan per hari > 30% | **MERAH** — "Prediksi Churn: Waspada staf resign mendadak" |

**Logika:** Keterlambatan tinggi secara konsisten adalah sinyal demotivasi. Staf yang sering telat berpotensi keluar tanpa peringatan.

#### Algoritma 4: Deteksi Anomali Kasir (Petty Fraud)
| Parameter | Nilai |
|---|---|
| Toleransi selisih kas wajar | Rp 2.000 (di bawah ini diabaikan) |
| Threshold total minus untuk aktifkan analisis | Rp 50.000 |

| Kondisi | Putusan |
|---|---|
| Total selisih minus ≥ Rp 50.000 dalam periode | Sistem menghitung **frekuensi kehadiran** setiap staf pada hari-hari terjadinya minus, lalu menampilkan nama dengan frekuensi tertinggi |

**Logika:** Sistem **TIDAK menuduh** satu orang secara langsung. Ia hanya mengatakan: "Total minus Rp 200.000. Terjadi saat Amel bertugas 26 kali, Eko 17 kali." Keputusan akhir tetap di tangan Anda sebagai owner.

#### Fallback (Jika Tidak Ada Algoritma yang Terpicu)

| Durasi | Kondisi | Putusan |
|---|---|---|
| ≤ 2 hari | Ada Event + Tanggal Tua (15-24) | Kuning: "Trafik padat, daya beli rendah" |
| ≤ 2 hari | Ada Event + Tanggal Muda (25-5) | Hijau: "Momen Emas" |
| 3-14 hari | Omset ≥ target DAN Kebersihan ≥ 90% | Hijau: "Momentum Positif" |
| > 14 hari | Omset ≥ target DAN Kebersihan ≥ 95% DAN Komplain rendah | Hijau: "Golden Era" |
| > 14 hari | Omset < 90% target | Merah: "Kegagalan Target Periode" |

> **Catatan Tanggal:** "Tanggal Muda" artinya dekat dengan tanggal gajian (akhir bulan/awal bulan: tanggal 25-5), sehingga daya beli masyarakat tinggi. "Tanggal Tua" (15-24) artinya uang sudah menipis.

### 10.4 Marketing Intelligence (5 Modul Analisis)

#### Modul C1: Tren Omset

| Perubahan vs Periode Sebelumnya | Status | Warna |
|---|---|---|
| Naik ≥ 5% | Sehat | Hijau |
| Antara -5% sampai +5% | Stagnan | Kuning |
| Turun ≤ -5% | Kritis | Merah |

**Formula:** `Perubahan% = ((Rata-rata_Harian_Periode_Ini - Rata-rata_Harian_Periode_Lalu) ÷ Rata-rata_Harian_Periode_Lalu) × 100%`

#### Modul C2: Analisis Menu (Hero vs Dead)

| Parameter | Nilai |
|---|---|
| Threshold konsistensi | Produk harus muncul di posisi Top/Bottom minimal **40% dari total hari** data |

Momentum produk juga dianalisis:
- **Rising Star:** Produk yang makin sering muncul di Top di paruh kedua periode
- **Fading:** Produk hero yang mulai menurun
- **Worse:** Produk dead yang makin sering muncul
- **Improving:** Produk dead yang mulai membaik

#### Modul C3: Korelasi Kebersihan × Omset

| Kombinasi | Label | Artinya |
|---|---|---|
| Omset ≥ 90% target, Kebersihan < 70% | **The Perfect Storm** | Ramai tapi kotor — sangat berbahaya |
| Omset < 70% target, Kebersihan < 70% | **The Lazy Shift** | Sepi dan kotor — tim malas |
| Omset ≥ 85% target, Kebersihan ≥ 90% | **The Good Standard** | Performa ideal |
| Kebersihan < 80% (umumnya) | **Hygiene di Bawah Standar** | Risiko komplain meningkat |

#### Modul C4: SDM & Risiko Operasional

| Tingkat Keterlambatan | Status | Tindakan |
|---|---|---|
| > 15% | **Krisis** (Merah) | Pertimbangkan SP |
| 5% – 15% | **Warning** (Kuning) | SPV wajib briefing |
| < 5% | **Positif** (Hijau) | Beri apresiasi |

#### Modul C5: Benchmarking ATS

| ATS Aktual vs Benchmark | Status |
|---|---|
| < 80% dari benchmark | **Kritis** — Gagal cross-selling |
| 80% – 99% dari benchmark | **Warning** — Masih di bawah standar |
| ≥ 100% dari benchmark | **Positif** — Upselling berhasil |

**Formula ATS:**
```
Average Ticket Size (ATS) = Total Omset ÷ Total Transaksi (Struk)
```

### 10.5 Area Kritis Kebersihan

| Threshold | Tindakan |
|---|---|
| Rata-rata skor area < 95% | Muncul di daftar "Area Kritis" dengan warna merah |

Sistem menampilkan maksimal 3 area terburuk, diurutkan dari skor terendah.

### 10.6 KPI Komplain

| Total Komplain Sebulan | Label |
|---|---|
| 0 | Aman (Hijau) |
| 1 | Waspada (Kuning) |
| 2 | Batas Maksimal (Oranye) |
| > 2 | **KPI Dilanggar** (Merah) |

### 10.7 KPI Turnover

| Total Resign per Kuartal (3 bulan) | Label |
|---|---|
| 0 | Aman |
| 1 | Batas Maksimal |
| > 1 | **Risiko Kritis** |

### 10.8 Pengaturan GM (Hanya untuk Owner)

| Pengaturan | Lokasi | Fungsi |
|---|---|---|
| **Target Tahunan** | Pengaturan GM di Dashboard | Digunakan untuk menghitung YTD Trajectory |
| **Benchmark ATS** | Di bawah tombol "Simpan & Tarik Analisis" | Default Rp 30.000. Saran: gunakan harga kopi signature + 1 pastry |
| **Folder Google Drive** | Pengaturan GM di Dashboard | Mengubah folder utama penyimpanan file |

---

