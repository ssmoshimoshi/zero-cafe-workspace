---
name: Pre-deploy Guard
description: Memeriksa kode dari error umum SPA sebelum melakukan deploy ke Google Apps Script (clasp push).
---

# Pre-deploy Guard Skill

Skill ini diaktifkan secara otomatis setiap kali Anda diminta untuk melakukan `clasp push` atau men-deploy perubahan ke Google Apps Script. 
Sebagai bentuk **Quality Gate**, Anda diwajibkan untuk menjalankan skrip pengaman terlebih dahulu sebelum benar-benar mengeksekusi proses deploy.

## Cara Menggunakan

Sebelum Anda menjalankan perintah `clasp push`, Anda WAJIB memanggil skrip berikut di terminal:

```bash
node .agents/skills/pre-deploy-guard/pre-deploy.js
```

Jika perintah tersebut mengembalikan output peringatan (`[WARNING]`), Anda harus menghentikan proses deploy, membaca peringatan tersebut, dan memeriksa ulang kode yang disebutkan.
Jika skrip mengembalikan status "Kode terlihat aman", barulah Anda diizinkan untuk menjalankan perintah `clasp push`.

## Alasan
*Aplikasi ini (Zero Cafe Workspace) berjalan sebagai Single Page Application (SPA). Error kecil seperti hilangnya pemanggilan `showLoading(false)` dapat membekukan seluruh antarmuka pengguna tanpa memunculkan pesan error yang jelas, menyebabkan aplikasi macet permanen. Pemeriksaan ini mencegah kejadian fatal tersebut masuk ke production.*
