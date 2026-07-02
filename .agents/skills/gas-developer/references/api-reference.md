# API Reference — Code.gs

Semua fungsi backend di `Code.gs` yang bisa dipanggil dari client via `Server.call()`.

---

## Core Functions (Internal, Tidak Dipanggil dari Client)

| Fungsi | Baris | Keterangan |
|---|---|---|
| `doGet(e)` | 9 | Entry point GAS web app |
| `include(filename)` | 22 | Include HTML partial files |
| `getSpreadsheet()` | 119 | Mengembalikan objek SpreadsheetApp |
| `getIndonesianMonth(dateStr)` | 261 | Konversi tanggal → nama bulan Indonesia |
| `getDynamicFolder(year, monthName, data)` | 216 | Membuat/mengambil folder Drive berdasarkan tahun/bulan |

---

## Client-Callable API Endpoints

### `api_getMasterStaff()`
- **Baris**: 131
- **Parameter**: Tidak ada
- **Return**: `Array<{ id: number, nama: string, posisi: string }>` (hanya yang `Status === "Aktif"`)
- **Pemanggilan**: `Server.call('api_getMasterStaff')`

### `api_addStaff(nama, posisi)`
- **Baris**: 161
- **Parameter**: `nama` (string), `posisi` (string)
- **Return**: `{ success: true, id: number, nama, posisi }` atau `{ success: false, error: string }`
- **Pemanggilan**: `Server.call('api_addStaff', namaStaff, posisiStaff)`

### `submitFullReport(payloadStr)`
- **Baris**: 273
- **Parameter**: `payloadStr` (JSON string dari seluruh `window.form`)
- **Return**: `{ success: true, url: string, folderPath: string }` atau `{ success: false, error: string }`
- **Pemanggilan**: `Server.call('submitFullReport', JSON.stringify(form))`
- **Catatan**: Fungsi ini melakukan 3 hal sekaligus:
  1. Generate PDF dari HTML
  2. Upload PDF ke Google Drive
  3. Append summary row ke Sheet tab yang sesuai (Daily/Weekly/Monthly)

### `api_getWeeklyData(startDateStr, endDateStr, outlet)`
- **Baris**: 427
- **Parameter**: `startDateStr` (YYYY-MM-DD), `endDateStr` (YYYY-MM-DD), `outlet` (string)
- **Return**: `{ success: true, data: Array<{ hari, target, real }> }` atau `{ success: false, error: string }`
- **Pemanggilan**: `Server.call('api_getWeeklyData', '2026-07-01', '2026-07-07', 'Perintis')`
- **Catatan**: Membaca seluruh tab Daily dan memfilter berdasarkan tanggal & outlet. Target diambil dari kolom I (index 8).

### `api_gm_fetchReports(monthName, year)`
- **Baris**: 502
- **Parameter**: `monthName` (string, misal "Juli"), `year` (string, misal "2026")
- **Return**: Object berisi data dashboard GM (omset total, komplain, chart data, daftar laporan)
- **Pemanggilan**: `Server.call('api_gm_fetchReports', 'Juli', '2026')`

### `api_uploadImage(base64Data, filename, category)`
- **Baris**: 959
- **Parameter**: `base64Data` (string), `filename` (string), `category` (string)
- **Return**: `{ success: true, url: string }` atau `{ success: false, error: string }`
- **Pemanggilan**: `Server.call('api_uploadImage', base64String, 'foto.jpg', 'fasilitas')`

### `api_gm_updateFolderId(newId)`
- **Baris**: 1006
- **Parameter**: `newId` (string — Google Drive Folder ID)
- **Return**: `{ success: true }` atau `{ success: false, error: string }`
- **Pemanggilan**: `Server.call('api_gm_updateFolderId', 'abc123folderid')`

### `api_gm_setTargetOmset(monthName, year, targetValue)`
- **Baris**: 1058
- **Parameter**: `monthName` (string), `year` (string), `targetValue` (number)
- **Return**: `{ success: true }` atau `{ success: false, error: string }`
- **Pemanggilan**: `Server.call('api_gm_setTargetOmset', 'Juli', '2026', 50000000)`
- **Catatan**: Menyimpan target ke `PropertiesService` dengan key `TARGET_OMSET_{month}_{year}`
