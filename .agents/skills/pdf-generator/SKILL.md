---
name: pdf-generator
description: Skill mutlak untuk mengonversi Markdown ke PDF dengan pendekatan "Context-Aware" (CLI vs Client-Side). Trigger: pembuatan PDF, export dokumen.
---

# Protokol Strategis Pembuatan PDF (Context-Aware)

Sebelum mengeksekusi, agen WAJIB mengidentifikasi **Konteks Lingkungan (Environment)** tempat PDF ini akan dihasilkan. DILARANG merakit skrip Node.js (Puppeteer/fs) kustom. Pilih salah satu jalur di bawah ini:

## JALUR A: Lingkungan Lokal / Terminal / Workspace
Gunakan jalur ini jika pengguna meminta file PDF dari file Markdown lokal.

1. **Konversi Diagram Terlebih Dahulu:**
   Jalankan: `npx --yes @mermaid-js/mermaid-cli -i <file>.md -o <file>_Rendered.md -e png`
2. **Eksekusi "Zero-Config" Agent Skill / CLI:**
   Jalankan: `npx --yes md-to-pdf <file>_Rendered.md` (Atau plugin agen setara seperti `any2pdf`).
3. **Pembersihan:** Hapus file sementara `_Rendered.md`.

## JALUR B: Lingkungan Aplikasi Web / Google Apps Script (GAS)
Gunakan jalur ini jika pengguna meminta penambahan **fitur "Export/Cetak PDF"** ke dalam antarmuka UI aplikasi (seperti Dashboard GM).

1. **DILARANG MENGGUNAKAN NODE.JS / PUPPETEER / CLI.** Lingkungan web serverless (GAS) tidak mendukung itu.
2. **Gunakan "Client-Side Rendering" (Metode md2pdf):**
   - Sisipkan *library* Markdown parser ringan di frontend UI (misal: `marked.js`).
   - Render teks Markdown ke elemen HTML `<div>` tersembunyi.
   - Panggil fungsi native browser `window.print()` atau gunakan `html2pdf.js` murni di sisi *client* untuk menyimpan file.
   - Ini memastikan privasi (tidak perlu *upload* ke server) dan 100% bebas error *sandbox* server.

## Aturan Universal:
- Jangan pernah menyentuh atau memanipulasi file asli (`.md` master) hanya untuk keperluan *styling* cetak.
- Patuhi filosofi *"Zero-Config"*: gunakan *style* yang diwariskan dari *tool* utama tanpa over-engineering CSS.
