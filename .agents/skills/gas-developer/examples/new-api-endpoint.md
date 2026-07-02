# Pattern: Menambahkan API Endpoint Baru

Step-by-step untuk menambahkan fungsi backend baru di `Code.gs` dan memanggilnya dari client.

---

## Step 1: Tambahkan Fungsi di Code.gs

Letakkan fungsi baru di section yang sesuai. Nama harus diawali `api_` agar mudah dikenali.

```javascript
/**
 * Deskripsi singkat fungsi.
 */
function api_namaFungsiBaru(param1, param2) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("NamaTab");
    if (!sheet) return { success: false, error: "Tab tidak ditemukan" };
    
    // ... logika bisnis ...
    
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
```

### Aturan:
- Selalu bungkus dalam `try-catch`
- Selalu return object `{ success: boolean, ... }`
- Gunakan `getSpreadsheet()` (bukan hardcode ID)
- Jangan lupa handle `sheet === null`

---

## Step 2: Panggil dari Client (JavaScript)

Gunakan `Server.call()` yang sudah ada di `JS-API.html`:

```javascript
// Async/await (di dalam async function)
const res = await Server.call('api_namaFungsiBaru', param1, param2);
if (res.success) {
  // Handle sukses
  showToast("Berhasil!", "success");
} else {
  showToast(res.error || "Gagal", "error");
}
```

### Aturan:
- Nama fungsi di `Server.call()` harus **persis sama** dengan nama fungsi di Code.gs (string)
- Parameter dikirim sebagai argumen tambahan setelah nama fungsi
- `Server.call` secara internal menggunakan `google.script.run` yang menangani serialisasi/deserialisasi JSON otomatis

---

## Step 3: Update Referensi

Setelah fungsi baru berhasil, tambahkan entry baru di file `references/api-reference.md`.

---

## Contoh Nyata: api_getWeeklyData

### Code.gs (Backend)
```javascript
function api_getWeeklyData(startDateStr, endDateStr, outlet) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Daily");
    if (!sheet) return { success: false, error: "Tab Daily tidak ditemukan" };
    
    var data = sheet.getDataRange().getValues();
    // ... filter data berdasarkan tanggal ...
    
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
```

### Client (JS-App2.html)
```javascript
async function fetchWeeklyData() {
  const f = window.form;
  showToast("Mengambil data...", "info");
  try {
    const res = await Server.call('api_getWeeklyData', f.periodeStart, f.periodeEnd, f.outlet || 'Perintis');
    if (res.success && res.data) {
      f.weekly.salesHarian = res.data;
      showToast("Data berhasil ditarik!", "success");
      renderApp();
    }
  } catch (err) {
    showToast("Gagal menarik data", "error");
  }
}
```
