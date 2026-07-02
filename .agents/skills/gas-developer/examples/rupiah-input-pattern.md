# Pattern: Kolom Input Format Rupiah

Pola standar untuk membuat kolom input yang otomatis memformat angka menjadi format Rupiah (Rp 1.234.567).

## Fungsi Helper (sudah ada di JS-App1.html)

```javascript
// Format angka menjadi "Rp 1.234.567"
function formatRupiah(el) {
  let v = el.value.replace(/[^\d]/g, '');
  if (v) el.value = 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(v));
  else el.value = '';
}

// Parse "Rp 1.234.567" menjadi angka 1234567
function parseRupiah(str) {
  return Number(String(str).replace(/[^\d]/g, '')) || 0;
}
```

## Pola HTML Input

### Input Biasa (langsung simpan ke form)
```html
<input type="text"
  value="${form.penjualan.target ? 'Rp ' + new Intl.NumberFormat('id-ID').format(form.penjualan.target) : ''}"
  onchange="formatRupiah(this); window.form.penjualan.target = parseRupiah(this.value)"
  placeholder="Rp 0"
  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl text-right font-bold focus:outline-none focus:border-zero-black">
```

### Input dalam Array/Loop (misal salesHarian)
```html
${form.weekly.salesHarian.map((s, idx) => `
  <input type="text"
    value="${s.real ? 'Rp ' + new Intl.NumberFormat('id-ID').format(s.real) : ''}"
    onchange="formatRupiah(this); updateWeeklySalesField(${idx}, 'real', this.value)"
    placeholder="Omset"
    class="...">
`).join('')}
```

## Catatan Penting
- Selalu gunakan `onchange` (bukan `oninput`) agar format hanya diterapkan setelah user selesai mengetik.
- Selalu simpan angka mentah (bukan string "Rp ...") ke `window.form`. Gunakan `parseRupiah()` untuk konversi.
- Untuk menampilkan di PDF, gunakan `formatRupiahPDF(number)` yang mengembalikan string tanpa tag HTML.
