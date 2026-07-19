---
name: pdf-generator
description: Skill mutlak untuk mengonversi dokumen Markdown (.md) menjadi PDF berkualitas tinggi. Mencegah agen melakukan over-engineering. Trigger: pembuatan PDF, convert ke PDF, export laporan cetak.
---

# Instruksi Eksekusi Pembuatan PDF

JANGAN PERNAH merakit skrip Node.js (Puppeteer/fs) kustom dari awal untuk mengonversi PDF. Ikuti protokol dua langkah wajib ini secara presisi:

1. **Konversi Diagram (Mermaid) Terlebih Dahulu:**
   Alat konversi PDF standar biasanya gagal merender Mermaid. Anda WAJIB mengubah *flowchart* menjadi gambar `.png` menggunakan CLI resmi terlebih dahulu sebelum membuat PDF.
   Perintah wajib: `npx --yes @mermaid-js/mermaid-cli -i <nama-file>.md -o <nama-file>_Rendered.md -e png`
   *(Gunakan output `_Rendered.md` ini untuk proses pembuatan PDF di langkah 2).*

2. **Gunakan CLI Standar untuk PDF:**
   Setelah gambar beres, selalu gunakan pustaka teruji `md-to-pdf` melalui NPX untuk melakukan konversi final.
   Perintah wajib: `npx --yes md-to-pdf <nama-file>_Rendered.md`
   *(Setelah selesai, hapus file `_Rendered.md` agar workspace tetap bersih).*

3. **Integritas Styling:**
   - DILARANG menyisipkan CSS eksternal kustom atau memanipulasi *layout* menjadi gelap (*dark mode*) kecuali diminta secara eksplisit oleh pengguna.
   - Gunakan gaya *default* bawaan CLI yang mengadopsi standar GitHub Markdown (putih, bersih, profesional).

4. **Integritas Dokumen Master:**
   - DILARANG memodifikasi, menambah gambar fiktif, atau mengubah isi file `.md` asli hanya demi mempercantik hasil cetakan PDF. File sumber adalah mutlak.
