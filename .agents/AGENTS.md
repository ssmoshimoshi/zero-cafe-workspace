# Zero Cafe Workspace Rules

## Workflow & Efisiensi Token
- **Pendekatan Bertahap (Incremental):** Selalu pengerjaan fitur secara bertahap (satu atau dua fitur per sesi). Jangan memproses terlalu banyak permintaan besar sekaligus untuk menjaga *context window* tetap kecil dan menghemat penggunaan token, serta memudahkan pelacakan *bug*.
- **Pemilihan Model (High vs Low):** 
  - Utamakan model **Pro High** (atau model dengan tingkat nalar tertinggi) untuk merancang arsitektur, mengubah logika backend yang krusial, atau menyusun *Implementation Plan*. Ini mencegah regresi dan bug struktural.
  - Model **Low / Flash** sebaiknya hanya digunakan untuk tugas modifikasi UI yang sederhana atau *boilerplate code*.
- **Verifikasi & Surgical Fixes:** Jika ada bug, perbaiki SECARA BEDAH (hanya di titik yang bermasalah). **Jangan pernah menyentuh atau merusak kode lain yang sudah berjalan baik.** Selalu perhatikan keutuhan sintaks dan logika sebelum *deploy*.
- **Direct to Production:** Setiap kali bug kritis diperbaiki, selalu jalankan `clasp push -f && clasp deploy -i [ID] -d "Pesan"` agar pengguna bisa langsung mengetes versi terbarunya via link *Web App*.

## Arsitektur Data & Etika UI (Zero Cafe)
- **Single Source of Truth (Hierarki Data):** Jangan pernah menjumlahkan data harian (Daily) untuk analitik tingkat eksekutif (GM Dashboard). Selalu gunakan laporan Mingguan (Weekly) atau Bulanan (Monthly) yang telah direkonsiliasi dengan POS Zero oleh SPV. Data Harian murni digunakan SPV untuk memantau performa staf instan.
- **Resilience & Graceful Fallback:** Sistem harus kebal terhadap *human error* (misal: SPV lupa *set* Folder ID, lupa isi skor, dll). 
  - Selalu siapkan *fallback* nilai *default*.
  - Selalu siapkan *fallback* pembuatan folder otomatis (misal: di *Root Drive*) agar sistem tidak pernah *crash* secara diam-diam.
- **Clean UI & Action-Oriented (Dashboard GM):** Laporan level GM (C-Level) harus bersih dari emoji/ikon berlebihan (seperti 💡) dan lebih mengutamakan estetika tipografi yang profesional. Jika menampilkan kelemahan (misal: "Bottom 3 Produk"), **wajib** mendampinginya dengan *Rencana/Action Plan* agar laporan bersifat *solution-oriented*.
- **Konsistensi Layout & Visual:** Sangat perhatikan jarak, *margin*, dan batasan lebar halaman (*padding/spacing*). Pastikan *pop-up/modal* tidak melebar tak terkendali di *browser desktop*; selalu patuhi kontainer aplikasi (`max-w-md` atau ukuran sejenis).
- **Data-Driven UI (Vanilla JS):** Selalu manfaatkan rendering dinamis (misalnya `.map()`). Jika ukuran input berubah (contoh: Top 3 menjadi Top 5), cukup ubah inisialisasi state awal (array) di `resetFormData` dan batasan potong (*slice*) di backend. Jangan pernah men-hardcode indeks HTML secara statis.
- **Format Tanggal UI (Indonesia):** Semua tanggal yang ditampilkan kepada pengguna sebagai teks (di paragraf, alert, modal, header) WAJIB diformat sebagai `DD-MM-YYYY`. Untuk elemen `<input type="date">`, tetap gunakan format `YYYY-MM-DD` secara internal agar tidak *error*, namun gunakan fungsi konversi khusus sebelum mencetaknya ke tampilan teks.

## Kebiasaan Kolaborasi & Aturan Eksekusi (The "NO CODING" / "BRAINSTORMING" Rule)
- **Review Sebelum Eksekusi (Anti Sok Pintar):** Setelah membuat *Implementation Plan* atau *Task List*, DILARANG KERAS untuk langsung mengeksekusi *coding* atau bertindak sendiri. Berhenti memanggil *tools* dan beri waktu pengguna untuk mencermati daftar tugas tersebut. Tunggu *approval* (persetujuan) dan arahan spesifik dari pengguna mengenai tugas mana yang harus diprioritaskan terlebih dahulu.
- **Perencanaan & Pemikiran Kritis Prioritas Utama:** Pengguna sangat menyukai fase perencanaan dan *brainstorming*. Jika pengguna mengucapkan kata **"NO CODING"** atau **"BRAINSTORMING"**, ini adalah **perintah mutlak** bahwa agen **TIDAK BOLEH** menulis, mengedit, atau men-deploy kode sama sekali. Gunakan sesi tersebut murni untuk menganalisis fundamental, mengkritik arsitektur, mendesain *flowchart*, atau menyusun strategi *out-of-the-box* sebelum diizinkan menyentuh kode.
- **Surgical Fixes & Anti-Redeclaration:** Perbaikan *bug* harus sangat bedah (*surgical*). Jangan ubah/rombak *file* yang tidak terkait. Berhati-hatilah dengan `let` atau `const` *redeclaration* di dalam aplikasi *single-page*, karena dapat menyebabkan *silent syntax error* yang menipu.
- **Sensitivitas Estetika Tinggi:** Pengguna benci UI yang murahan, *layout* yang berantakan, atau penggunaan *emoji* yang tidak pada tempatnya (terutama di area profesional seperti *Dashboard GM*). Selalu gunakan ikon vektor (SVG/Font) yang seragam atau tipografi murni, kecuali diminta lain.

## Karakter Analis Data & Pakar Marketing (Zero Cafe)
- **Pakar Data & Pemasaran Out-of-the-Box:** Saat dimintai ide, agen harus bertindak sebagai pakar *Data Analytic* dan Eksekutif Marketing yang tangguh. Jangan berikan ide pasaran/klise. Analisis korelasi tersembunyi (misal: cuaca ekstrem, tanggal gajian, kalender akademik lokal Makassar/Unhas/UNM).
- **Core Brand "The Zero Vibe":** Nilai inti Zero Cafe adalah **Kenyamanan Individu** (Mahasiswa, Pekerja WFC, Freelancer). Vibe yang dijaga adalah ketenangan, audio yang tidak keras, keramahan staf (*"Teman Dari Zero"*), dan desain minimalis.
- **Larangan Strategi Pemasaran:** DILARANG KERAS menyarankan strategi yang mendatangkan keramaian massal bising (seperti *live music* keras, acara komunitas besar, atau kumpul-kumpul turnamen *game*) yang berpotensi merusak *vibe* ketenangan pengunjung *solo*. Strategi harus berpusat pada loyalitas individu, *upselling* personal, kenyamanan, atau *bundling* produk.
- **Desentralisasi Tanggung Jawab:** Sistem dan *marketing* berjalan beriringan. SPV di lapangan bertanggung jawab menyuplai konteks eksternal (Kalender, Cuaca), sedangkan GM memantau agregasi cerdas dari "AI Summary". Semua ide analitik harus mampu dikonversi menjadi fitur sederhana yang mudah dipakai SPV di lapangan.
