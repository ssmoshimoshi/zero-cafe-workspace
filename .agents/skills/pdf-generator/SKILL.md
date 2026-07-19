---
name: pdf-generator
description: Skill mutlak untuk mengonversi dokumen Markdown (.md) menjadi PDF berkualitas tinggi. Mencegah agen melakukan over-engineering. Trigger: pembuatan PDF, convert ke PDF, export laporan cetak.
---

# Instruksi Eksekusi Pembuatan PDF

JANGAN PERNAH merakit skrip Node.js (Puppeteer/fs) kustom dari awal untuk mengonversi PDF. Ikuti protokol wajib ini:

1. **Gunakan CLI Standar:**
   Selalu gunakan pustaka teruji `md-to-pdf` (dari simonhaenisch) melalui NPX untuk konversi.
   Perintah wajib: `npx --yes md-to-pdf <nama-file>.md`

2. **Penanganan Diagram (Mermaid):**
   Jika dokumen berisi diagram Mermaid, CLI `md-to-pdf` secara otomatis mendukungnya atau Anda dapat menggunakan parameter yang sesuai jika diperlukan. Dilarang merakit ulang renderer manual.

3. **Integritas Styling:**
   - DILARANG menyisipkan CSS eksternal kustom atau memanipulasi *layout* menjadi gelap (*dark mode*) kecuali diminta secara eksplisit oleh pengguna.
   - Gunakan gaya *default* bawaan CLI yang mengadopsi standar GitHub Markdown (putih, bersih, profesional).

4. **Integritas Dokumen Master:**
   - DILARANG memodifikasi, menambah gambar fiktif, atau mengubah isi file `.md` asli hanya demi mempercantik hasil cetakan PDF. File sumber adalah mutlak.
