# Zero Cafe Workspace Rules

## Workflow & Efisiensi Token
- **Pendekatan Bertahap (Incremental):** Selalu pengerjaan fitur secara bertahap (satu atau dua fitur per sesi). Jangan memproses terlalu banyak permintaan besar sekaligus untuk menjaga *context window* tetap kecil dan menghemat penggunaan token, serta memudahkan pelacakan *bug*.
- **Pemilihan Model (High vs Low):** 
  - Utamakan model **Pro High** (atau model dengan tingkat nalar tertinggi) untuk merancang arsitektur, mengubah logika backend yang krusial, atau menyusun *Implementation Plan*. Ini mencegah regresi dan bug struktural.
  - Model **Low / Flash** sebaiknya hanya digunakan untuk tugas modifikasi UI yang sederhana atau *boilerplate code*.
- **Verifikasi:** Selalu perhatikan keutuhan sintaks dan logika kode (termasuk referensi ke file lain) sebelum menekan persetujuan atau melakukan *deploy*.
