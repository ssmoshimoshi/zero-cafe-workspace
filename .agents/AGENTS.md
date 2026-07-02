# Zero Cafe Workspace Rules

## Workflow & Efisiensi Token
- **Pendekatan Bertahap (Incremental):** Selalu pengerjaan fitur secara bertahap (satu atau dua fitur per sesi). Jangan memproses terlalu banyak permintaan besar sekaligus untuk menjaga *context window* tetap kecil dan menghemat penggunaan token, serta memudahkan pelacakan *bug*.
- **Pemilihan Model (High vs Low):** 
  - Utamakan model **Pro High** (atau model dengan tingkat nalar tertinggi) untuk merancang arsitektur, mengubah logika backend yang krusial, atau menyusun *Implementation Plan*. Ini mencegah regresi dan bug struktural.
  - Model **Low / Flash** sebaiknya hanya digunakan untuk tugas modifikasi UI yang sederhana atau *boilerplate code*.
- **Verifikasi:** Selalu perhatikan keutuhan sintaks dan logika kode (termasuk referensi ke file lain) sebelum menekan persetujuan atau melakukan *deploy*.

## Arsitektur Data & Etika UI (Zero Cafe)
- **Single Source of Truth (Hierarki Data):** Jangan pernah menjumlahkan data harian (Daily) untuk analitik tingkat eksekutif (GM Dashboard). Selalu gunakan laporan Mingguan (Weekly) atau Bulanan (Monthly) yang telah direkonsiliasi dengan POS Zero oleh SPV. Data Harian murni digunakan SPV untuk memantau performa staf instan.
- **Graceful Fallback:** Jika data bulanan belum diinput, sistem analitik harus cukup cerdas melakukan *fallback* dengan menarik dan menggabungkan data dari laporan mingguan pada bulan tersebut. Jangan biarkan grafik GM kosong.
- **Clean UI & Action-Oriented (Dashboard GM):** Laporan level GM (C-Level) harus bersih dari emoji/ikon berlebihan (seperti 💡) dan lebih mengutamakan estetika tipografi yang profesional. Jika menampilkan kelemahan (misal: "Bottom 3 Produk"), **wajib** mendampinginya dengan *Rencana/Action Plan* agar laporan bersifat *solution-oriented*.
- **Data-Driven UI (Vanilla JS):** Selalu manfaatkan rendering dinamis (misalnya `.map()`). Jika ukuran input berubah (contoh: Top 3 menjadi Top 5), cukup ubah inisialisasi state awal (array) di `resetFormData`. Jangan pernah men-hardcode indeks HTML secara statis jika bisa dirender dari struktur array.
