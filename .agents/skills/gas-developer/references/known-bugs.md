# Known Bugs & Resolved Issues

Catatan bug yang pernah muncul di proyek ini. Gunakan sebagai referensi agar bug yang sama tidak terulang.

---

## RESOLVED: SVG Minifier Bug
- **Versi terdampak**: v104 dan sebelumnya
- **Gejala**: Tombol atau elemen HTML tampak raksasa, memenuhi seluruh layar.
- **Penyebab**: GAS minifier menginterpretasi `//` di `xmlns="http://www.w3.org/2000/svg"` sebagai komentar JavaScript, sehingga tag `</svg>` terhapus dan elemen berikutnya ikut masuk ke dalam SVG.
- **Solusi**: Hapus atribut `xmlns` dari semua SVG. Gunakan closing tag eksplisit `<path></path>` (bukan self-closing `<path />`).
- **Aturan permanen**: Sudah didokumentasikan di SKILL.md Rule 1.

---

## RESOLVED: Scope Chain Bug (Data Hilang Saat Pindah Tab)
- **Versi terdampak**: v102-v117
- **Gejala**: Nama Supervisor dan data form lainnya terhapus setiap kali user pindah tab.
- **Penyebab**: Penggunaan tag `<form>` membuat scope chain handler `onchange` merujuk ke elemen form HTML, bukan ke `window.form`. Saat `renderApp()` dipanggil, elemen form lama dihancurkan dan data hilang.
- **Solusi**: Ganti `<form>` menjadi `<div>`. Gunakan referensi eksplisit `window.form` pada seluruh atribut inline (`onchange`, `oninput`) di 75+ kolom.
- **Aturan permanen**: Selalu gunakan `window.form.xxx` di atribut inline, jangan pernah `form.xxx` langsung.

---

## RESOLVED: Fungsi Template Duplikat
- **Versi terdampak**: v101-v105
- **Gejala**: Perubahan di file `Partial-*.html` tidak berefek karena JS masih menjalankan versi lama dari `JS-App1.html` atau `JS-App2.html`.
- **Penyebab**: Saat refactoring ke file partial, fungsi template lama tidak dihapus dari file JS asli. JavaScript diam-diam menggunakan definisi terakhir (yang lama).
- **Solusi**: Hapus semua fungsi template duplikat dari `JS-App1.html` dan `JS-App2.html`.
- **Aturan permanen**: Sudah didokumentasikan di SKILL.md Rule 2 (No Duplicate Template Functions).

---

## OPEN: Header Kolom Target di Sheet "Daily"
- **Status**: BELUM DIPERBAIKI
- **Gejala**: Kolom I di Sheet "Daily" tidak punya header. Data target dari Laporan Harian yang dikirim pasca v122 masuk ke kolom I tapi tanpa judul.
- **Dampak**: Data laporan lama (pra-v122) tidak memiliki nilai target di kolom I. Ini menyebabkan `api_getWeeklyData()` mengembalikan target = 0 untuk tanggal-tanggal lama.
- **Solusi yang direncanakan**: Tambahkan header "Target" di sel I1 secara manual atau via script. Ini adalah task di Fase 2.

---

## LIMITATION: renderApp() Full Re-render
- **Status**: KNOWN LIMITATION, TIDAK AKAN DIROMBAK
- **Gejala**: Setiap perubahan input memicu `renderApp()` yang membangun ulang seluruh halaman.
- **Dampak**: Scroll position dan cursor focus hilang.
- **Mitigasi saat ini**: Gunakan `setTimeout` dan direct DOM manipulation untuk update kecil. Kurangi pemanggilan `renderApp()` yang tidak perlu.
- **Keputusan**: Tidak akan dirombak ke reactive framework. Risiko terlalu tinggi terhadap kestabilan.
