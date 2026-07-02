# Data Schema Reference

## `window.form` — Struktur Data Formulir

Form utama disimpan di `window.form` (global). Direset oleh `resetFormData(type)` di `JS-App1.html`.

### Shared Fields (Semua Tipe Laporan)
| Field | Tipe | Keterangan |
|---|---|---|
| `type` | `string` | `"daily"` / `"weekly"` / `"monthly"` |
| `tanggal` | `string` | Format `YYYY-MM-DD` (daily) |
| `periodeStart` | `string` | Format `YYYY-MM-DD` (weekly) |
| `periodeEnd` | `string` | Format `YYYY-MM-DD` (weekly) |
| `bulan` | `string` | Format `YYYY-MM` (monthly) |
| `supervisor` | `string` | Nama SPV yang login |
| `shift` | `string` | Jam shift, misal `"06:00"` |
| `outlet` | `string` | Nama outlet, default `"Perintis"` |

### Daily Specific (`form.*`)
| Field | Tipe | Keterangan |
|---|---|---|
| `penjualan.target` | `number` | Target omset harian |
| `penjualan.shift1` | `number` | Omset shift 1 |
| `penjualan.shift2` | `number` | Omset shift 2 |
| `penjualan.transaksi` | `number` | Jumlah transaksi |
| `produk.makanan[]` | `string[]` | Top 3 makanan |
| `produk.minuman[]` | `string[]` | Top 3 minuman |
| `kas.modalAwal` | `number` | Modal awal kas, default 200000 |
| `kas.audit[]` | `object[]` | Array audit kas |
| `staff[]` | `object[]` | Dynamic, dari masterStaff. `{ nama, posisi, hadir, catatan }` |
| `briefing.target` | `string` | Target shift briefing |
| `briefing.fokus` | `string` | Fokus shift |
| `briefing.masalah` | `string` | Masalah |
| `briefing.solusi` | `string` | Solusi |
| `qc.espresso` | `object` | `{ jam, status, keterangan }` |
| `qc.items[]` | `object[]` | Array QC items |
| `feedback.items[]` | `object[]` | Array feedback items |
| `feedback.totalKomplain` | `number` | Total komplain |
| `feedback.totalRemake` | `number` | Total remake |
| `feedback.analisisRemake` | `string` | Analisis remake |
| `fasilitas[]` | `object[]` | Array fasilitas |
| `bahan[]` | `object[]` | Array bahan |
| `penutup.kendala` | `string` | Kendala operasional |
| `penutup.rekomendasi` | `string` | Rekomendasi |

### Weekly Specific (`form.weekly.*`)
| Field | Tipe | Keterangan |
|---|---|---|
| `salesHarian[]` | `object[]` | 7 item: `{ hari, target, real }` |
| `produk.topMinuman[]` | `string[]` | 3 item |
| `produk.bottomMinuman[]` | `object[]` | 3 item: `{ nama, tindakan }` |
| `produk.topMakanan[]` | `string[]` | 3 item |
| `produk.bottomMakanan[]` | `object[]` | 3 item: `{ nama, tindakan }` |
| `komplain` | `object` | `{ total, remake, penyebab }` |
| `kendalaUtama` | `string` | Kendala utama mingguan |
| `staff[]` | `object[]` | Dynamic: `{ nama, posisi, status, alasan }` |
| `rencana[]` | `string[]` | Array rencana aksi |
| `kebutuhan[]` | `string[]` | Array kebutuhan |

### Monthly Specific (`form.monthly.*`)
| Field | Tipe | Keterangan |
|---|---|---|
| `ringkasan.pencapaian` | `string` | Pencapaian bulan ini |
| `ringkasan.masalah` | `string` | Masalah utama |
| `ringkasan.kesimpulan` | `string` | Kesimpulan |
| `sales.total` | `number` | Total omset bulan |
| `sales.target` | `number` | Target omset bulan |
| `sales.persen` | `number` | Persentase pencapaian |
| `produk.topMinuman[]` | `object[]` | 3 item: `{ nama, terjual }` |
| `produk.bottomMinuman[]` | `object[]` | 3 item: `{ nama, terjual, rencana }` |
| `produk.topMakanan[]` | `object[]` | 3 item: `{ nama, terjual }` |
| `produk.bottomMakanan[]` | `object[]` | 3 item: `{ nama, terjual, rencana }` |
| `staff[]` | `object[]` | Dynamic: `{ nama, kriteria, nilai, alasan }` |
| `operasional` | `object` | `{ kepatuhanSop, telat, teguran, penyebab }` |
| `qc` | `object` | `{ komplain, remake, penyebab, espresso, rekomendasi, items[] }` |
| `fasilitas` | `object` | `{ pengeluaran, eskalasi }` |
| `rencana` | `object` | `{ strategi, target, gm }` |
| `evaluasi` | `object` | `{ berhasil, sulit, skill, ratingKerja }` |

---

## Google Sheets — Struktur Kolom

### Tab: `Daily`
| Kolom | Index | Header | Sumber Data |
|---|---|---|---|
| A | 0 | Tanggal | `data.tanggal` (DD-MM-YYYY) |
| B | 1 | Supervisor | `data.supervisor` |
| C | 2 | Outlet | `data.outlet` |
| D | 3 | Shift | `data.shift` |
| E | 4 | Total Omset | `shift1 + shift2` |
| F | 5 | Komplain | `feedback.totalKomplain` |
| G | 6 | Kendala | `penutup.kendala` |
| H | 7 | URL PDF | Link Google Drive |
| I | 8 | Target | `penjualan.target` (**BARU v122, header belum ada**) |

> **PENTING**: Kolom I (Target) baru ditambahkan di v122. Header "Target" di sel I1 belum ditambahkan secara manual. Data-data lama sebelum v122 tidak memiliki nilai di kolom ini.

### Tab: `Weekly`
| Kolom | Index | Header | Sumber Data |
|---|---|---|---|
| A | 0 | Periode | `data.periode` |
| B | 1 | Supervisor | `data.supervisor` |
| C | 2 | Outlet | `data.outlet` |
| D | 3 | Total Omset | Sum `salesHarian[].real` |
| E | 4 | (Reserved) | `0` |
| F | 5 | Komplain | `weekly.komplain.total` |
| G | 6 | Kendala | `weekly.kendalaUtama` |
| H | 7 | URL PDF | Link Google Drive |

### Tab: `Monthly`
| Kolom | Index | Header | Sumber Data |
|---|---|---|---|
| A | 0 | Bulan | `MM-YYYY` |
| B | 1 | Supervisor | `data.supervisor` |
| C | 2 | Outlet | `data.outlet` |
| D | 3 | Total Omset | `monthly.sales.total` |
| E | 4 | Target | `monthly.sales.target` |
| F | 5 | Persen | `monthly.sales.persen` |
| G | 6 | Rating Kerja | `monthly.evaluasi.ratingKerja` |
| H | 7 | URL PDF | Link Google Drive |

### Tab: `MasterStaff`
| Kolom | Index | Header | Keterangan |
|---|---|---|---|
| A | 0 | ID | Auto-increment integer |
| B | 1 | Nama | Nama staff |
| C | 2 | Posisi | Barista / Kasir / Kitchen / dll |
| D | 3 | Status | "Aktif" / "Nonaktif" |
