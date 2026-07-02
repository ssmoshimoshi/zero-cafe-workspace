# Stable Checkpoints

Daftar versi GAS dan commit Git yang telah dikonfirmasi stabil oleh user. Gunakan sebagai titik rollback jika terjadi kerusakan.

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
