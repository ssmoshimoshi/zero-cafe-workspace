# Zero Cafe Workspace - CHANGELOG

## [v118] - 2026-07-02
### STABLE CHECKPOINT - Halaman Laporan Harian (Daily Report)
- **Finalized Daily Report**: Semua bug kritis pada halaman Laporan Harian telah diperbaiki dan distabilkan. Fitur ini 100% berfungsi seperti yang diharapkan.
  - **Bug Tab Scroll**: Mengatasi tab navigasi yang selalu bergeser kembali ke awal saat diklik.
  - **Bug Scope Chain (Data Hilang)**: Mengganti tag `<form>` menjadi `<div>` dan menggunakan referensi eksplisit `window.form` pada seluruh atribut *inline* (onchange/oninput) di lebih dari 75+ kolom. Ini memperbaiki masalah fatal dimana nama Supervisor (dan data lain) selalu terhapus saat berpindah tab.
  - **Tombol Penutup**: Memperbaiki fungsi tombol "Tinjau & Kirim" dan "Export PDF" agar kembali menggunakan fungsi yang benar (`openPreviewModal` dan `exportPDF`), serta menambahkan validasi wajib isi nama Supervisor pada kedua tombol tersebut.
  - **UI/UX**: Mengembalikan tombol "+ STAFF BARU", menerapkan format Rupiah otomatis, dan merubah kolom keterangan/catatan menjadi `textarea` yang fleksibel.
- **Catatan Penting**: Versi ini (commit `c4318c2` / GAS `v118`) adalah **titik aman (stable checkpoint)**. Jika di masa depan terjadi kerusakan kode pada Laporan Harian, kita dapat melakukan rollback ke titik ini.

## [v107] - 2026-07-02
### Fixed
- **Daily Form Render Bug**: Fixed a `SyntaxError: Invalid or unexpected token` that prevented `Partial-Form-Daily.html` from loading correctly in Apps Script. This was caused by escaped backticks (`\``) being used incorrectly inside nested template literals (`${...}`). Changed `\`` to normal unescaped backticks.

## [v106] - 2026-07-01
### Refactor
- **Cleaned Duplicate Templates**: Removed 656 lines of duplicate template functions from `JS-App2.html` (`getWeeklyFormTemplate`, `getMonthlyFormTemplate`, `getDashboardGMTemplate`). This ensures the app uses the `Partial-` files while safely preserving all global helper functions in `JS-App2.html`.
## [v105] - 2026-07-01
### Fixed
- **Critical Crash Fix**: Fixed a fatal ReferenceError that caused the Daily, Weekly, and Monthly pages to become unresponsive (blank screen). This was caused by missing `include` directives for the newly created partials in `index.html`. Added `Partial-Form-Daily`, `Partial-Form-Weekly`, `Partial-Form-Monthly`, and `Partial-Dashboard-GM` to `index.html` to restore application functionality.

## [v104] - 2026-07-01
### Fixed
- **Oversized SVG Minifier Bug**: Resolved a major UI bug where the "KEMBALI" button in the Daily Report form rendered as a gigantic, screen-filling SVG. The issue was traced to the Google Apps Script minifier incorrectly interpreting the `//` in `<svg xmlns="http://www.w3.org/2000/svg">` (inside a JS template literal) as a JavaScript comment, which stripped the closing `</svg>` tag. 
- **Applied Global SVG Fix**: Removed all `xmlns` attributes from SVGs and converted self-closing `<path/>` tags to explicitly closed `<path></path>` tags across all files (`JS-App1.html`, `JS-App2.html`, `Partial-*.html`, `index.html`).
- **Cleaned Duplicate Code**: Deleted 560+ lines of duplicate template code (`getDailyFormTemplate` and `getDailyTabContent`) from `JS-App1.html` to ensure the application correctly reads from `Partial-Form-Daily.html`.

## [v103] - 2026-07-01
### Changed
- Attempted to fix the oversize header button issue by adjusting CSS sizes on SVG elements. (Note: This fix failed to propagate to the Daily form because the app was still reading from duplicate code in `JS-App1.html`).

## [v102] - 2026-07-01
### Fixed
- **Supervisor Data Loss Bug**: Fixed a bug where the selected Supervisor name automatically disappeared when switching tabs inside the daily form, preventing the final report submission.

## [v101] - 2026-07-01
### Refactored
- Started splitting the massive UI code into separate partial files (`Partial-Form-Daily.html`, etc.) for better maintainability and organization.

---
*Note: This log is maintained by AI to track historical context and major deployment versions on the `AKfycbzmjpOPY34k7AQ4YTieRxRwnkGKsWsPH6-Xcl4bZK4nvNLRIAbOOKONRnMVFCE3ZjWf` deployment.*
