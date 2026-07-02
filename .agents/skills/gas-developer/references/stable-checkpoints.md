# Stable Checkpoints

Daftar versi GAS dan commit Git yang telah dikonfirmasi stabil oleh user. Gunakan sebagai titik rollback jika terjadi kerusakan.

---

## Checkpoint 3 — Penyempurnaan UI/UX & Fungsional Target
- **GAS Version**: v125
- **Git Commit**: `9055fcf`
- **Tanggal**: 2026-07-03
- **Cakupan**: Implementasi design system Zero Cafe, Dot Stepper, Bottom Sheets, Skeleton Loading, dan tombol membal.
- **Fitur yang tercakup**:
  - Warna resmi brand (`#171717`, `#f0efef`, `#919191`)
  - Stepper terintegrasi penuh di halaman Daily, Weekly, Monthly
  - Popup modal meluncur dari bawah (Bottom Sheet) di layar mobile
  - Transisi Shimmer skeleton untuk penarikan data mingguan
  - Tombol dengan efek klik membal secara global

### Cara Rollback ke Checkpoint 3
```bash
# Rollback semua file UI & CSS
git checkout 9055fcf -- CSS.html index.html Partial-Form-Daily.html Partial-Form-Weekly.html Partial-Form-Monthly.html JS-App2.html
clasp push -f
```

---

## Checkpoint 1 — Halaman Laporan Harian (Daily Report)
- **GAS Version**: v118
- **Git Commit**: `c4318c2`
- **Tanggal**: 2026-07-02
- **Cakupan**: Seluruh fungsionalitas halaman Laporan Harian bekerja sempurna.
- **Fitur yang tercakup**:
  - Input form daily (penjualan, staff, briefing, QC, feedback, fasilitas, bahan, penutup)
  - Tombol "+ Staff Baru" dengan modal
  - Format Rupiah otomatis
  - Textarea fleksibel untuk catatan/keterangan
  - Tombol "Simpan Draft", "Export PDF", "Tinjau & Kirim" berfungsi penuh
  - Nama Supervisor persisten saat pindah tab

### Cara Rollback ke Checkpoint 1
```bash
# Rollback hanya file Daily-related
git checkout c4318c2 -- Partial-Form-Daily.html JS-App1.html
clasp push -f
```

---

## Checkpoint 2 — Halaman Laporan Mingguan (Weekly Report)
- **GAS Version**: v124
- **Git Commit**: `536d090`
- **Tanggal**: 2026-07-02
- **Cakupan**: Seluruh fungsionalitas halaman Laporan Mingguan bekerja dengan baik.
- **Fitur yang tercakup**:
  - Input omset 7 hari (Target + Realisasi) dengan format Rupiah
  - Auto-pull data omset dari database saat tanggal dipilih
  - Total Target & Omset Aktual otomatis + Progress Bar persentase
  - Validasi periode 7 hari
  - Dropdown evaluasi staff berwarna (Hijau/Kuning/Merah) dengan placeholder "Status"
  - Validasi wajib isi sebelum Export/Kirim
  - Format nama PDF: `DD-DD-bulan-laporan mingguan.pdf`
  - Navigator tab dots+arrows menyerupai Daily

### Cara Rollback ke Checkpoint 2
```bash
# Rollback hanya file Weekly-related
git checkout 536d090 -- Partial-Form-Weekly.html JS-App2.html Code.gs
clasp push -f
```

---

## Catatan Penting
- Rollback parsial (per file) lebih aman daripada rollback seluruh repo.
- Setelah rollback, **selalu** `clasp push -f` agar GAS sinkron.
- Periksa `CHANGELOG.md` untuk detail lengkap setiap checkpoint.
