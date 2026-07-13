# Skema Database (Google Sheets) Zero Cafe

PENTING: Baca peta ini sebelum mengakses indeks array `mData` atau memanipulasi baris Google Sheets.

## DB_Laporan_Bulanan (17 Kolom)
| Index | Kolom | Tipe Data Wajib |
|---|---|---|
| 0 | ID_Laporan_Bulanan | String |
| 1 | Bulan_Laporan | String / Date |
| 2 | Outlet | String |
| 3 | Supervisor | String |
| 4 | Omset_Aktual | Number |
| 5 | Omset_Target | Number |
| 6 | Persen_Tercapai | Number |
| 7 | Rating_Kerja | String |
| 8 | Kepatuhan_SOP | Number |
| 9 | Total_Telat | Number |
| 10 | Pencapaian | String |
| 11 | Tantangan | String |
| 12 | Total_Pengeluaran_Ekstra | Number |
| 13 | Total_Turnover | Number |
| 14 | Strategi_Bulan_Depan | String |
| 15 | Kebutuhan_Approval_GM | String |
| 16 | URL_PDF | String |

## DB_Laporan_Harian (12 Kolom)
| Index | Kolom | Tipe Data Wajib |
|---|---|---|
| 0 | ID_Laporan_Harian | String |
| 1 | Tanggal | String / Date |
| 2 | Bulan_Laporan | String |
| 3 | Outlet | String |
| 4 | Supervisor | String |
| 5 | Cuaca | String |
| 6 | Total_Omset | Number |
| 7 | Target_Harian | Number |
| 8 | Total_Transaksi | Number |
| 9 | Kendala_Operasional | String |
| 10 | Saran_Perbaikan | String |
| 11 | URL_PDF | String |
