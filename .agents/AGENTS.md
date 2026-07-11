# Zero Cafe Workspace Rules

## Workflow & Efisiensi Token
- **Pendekatan Bertahap (Incremental):** Selalu pengerjaan fitur secara bertahap (satu atau dua fitur per sesi). Jangan memproses terlalu banyak permintaan besar sekaligus untuk menjaga *context window* tetap kecil dan menghemat penggunaan token, serta memudahkan pelacakan *bug*.
- **Eksekusi Bertahap (Sequential Execution):** Jika membuat tugas (*task*) yang memiliki beberapa tahapan, jangan mengeksekusi tahapan-tahapan tersebut sekaligus. Selesaikan tahapan satu per satu secara berurutan sesuai dengan rencana (*plan*) tahapan yang telah disusun sendiri sebelum berlanjut ke tahap berikutnya.
- **Pemilihan Model (High vs Low):** 
  - Utamakan model **Pro High** (atau model dengan tingkat nalar tertinggi) untuk merancang arsitektur, mengubah logika backend yang krusial, atau menyusun *Implementation Plan*. Ini mencegah regresi dan bug struktural.
  - Model **Low / Flash** sebaiknya hanya digunakan untuk tugas modifikasi UI yang sederhana atau *boilerplate code*.
- **Verifikasi & Surgical Fixes:** Jika ada bug, perbaiki SECARA BEDAH (hanya di titik yang bermasalah). **Jangan pernah menyentuh atau merusak kode lain yang sudah berjalan baik.** Selalu perhatikan keutuhan sintaks dan logika sebelum *deploy*.
- **Direct to Production:** Setiap kali bug kritis diperbaiki, selalu jalankan `clasp push -f && clasp deploy -i [ID] -d "Pesan"` agar pengguna bisa langsung mengetes versi terbarunya via link *Web App*.

## Arsitektur Data & Etika UI (Zero Cafe)
- **Daily as The Absolute Center (Hierarki Data):** Seluruh arsitektur agregasi Laporan GM Dasbor WAJIB merujuk pada rekaman **Harian (Daily)** sebagai fondasi utama (Center Data). Laporan Mingguan/Bulanan milik SPV sejatinya hanyalah hasil *auto-fill* dari data harian. Jika SPV berhalangan (sakit/off/cuti), SPV wajib melakukan *backfill* data harian (terutama finansial dari POS Zero) di lain waktu. Tidak boleh ada sistem kompensasi target; dasbor harus murni menggunakan perbandingan target kalender absolut agar SPV bertanggung jawab melengkapi data hariannya.
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

## Jam Operasional & Batasan Gamifikasi (Streak System)
- **Jam Buka Tutup Outlet:** 
  - **Perintis:** Buka 08:00 - Tutup 04:00 (Setiap hari).
  - **Dg Tata:** Buka 08:00 - Tutup 24:00 (Minggu - Kamis) | Buka 08:00 - Tutup 01:00 (Jumat - Sabtu).
- **Jam Kerja SPV:** SPV di kedua outlet memiliki jadwal yang sama yaitu jam 12:00 siang - 21:00 malam.
- **Batas Waktu Laporan (Streak Cut-off):** Untuk mendorong kedisiplinan pengisian Laporan Harian melalui sistem "Streak/Gamification", batas akhir (*cut-off*) pengiriman laporan untuk hari kerja sebelumnya adalah **Maksimal Jam 13:00 (1 Siang) keesokan harinya**. Laporan yang dikirim setelah jam ini akan memutus rantai *streak*.
- **Desain UI Gamifikasi Profesional:** DILARANG menggunakan Emoji (seperti api, piala, dll) pada fitur gamifikasi atau *streak*. Gunakan desain vektor murni, tipografi, atau badge yang tegas, bersih, dan estetik sesuai *vibe* Zero Cafe.

## Integritas Data & Penanganan Race Condition
- **Mekanisme Anti Double-Submit:** Pencegahan *spam klik* (Race Condition Lock) harus difokuskan di sisi *backend* (GAS). Di sisi *frontend*, saat tombol Submit ditekan, UI hanya boleh di- *disable* dengan status *loading*. 
- **Dilarang Auto-Reset Prematur:** Sistem **TIDAK BOLEH** me- *reset* atau membersihkan *input/checkbox* form SPV sebelum *backend* secara eksplisit mengembalikan respons `success: true` dan PDF telah dipastikan tersimpan. Jika terjadi kegagalan jaringan atau terdeteksi duplikat, semua data yang sudah diketik/dicentang SPV harus dipertahankan utuh agar SPV bisa mencoba ulang tanpa menginput dari awal.

## Algoritma Analisis Kesalahan Kasir (Petty Fraud / Cash Discrepancy)
- **Pendekatan Frekuensi Kehadiran:** Dalam menganalisis selisih kas (uang minus), sistem DILARANG menunjuk satu staf atau SPV secara langsung dari satu laporan tunggal.
- **Logika Agregasi GM Dasbor:** Saat GM memilih rentang waktu, AI harus:
  1. Menjumlahkan total nominal selisih kas minus (contoh: Total minus Rp 200.000).
  2. Mengidentifikasi seluruh shift/hari yang mengalami selisih minus.
  3. Menghitung frekuensi (berapa kali) setiap nama staf muncul/bertugas pada shift-shift yang bermasalah tersebut.
  4. Menampilkan nama-nama staf dengan frekuensi tertinggi sebagai "Indikator Potensi Evaluasi" (Contoh output: "Total Minus Rp 200rb. Terjadi saat Amel bertugas 26 kali, Eko 17 kali"). Hal ini memberikan wawasan objektif bagi GM untuk melakukan *follow-up*.

## Protokol Autonomous Self-Learning (MCP Memory)
Jika MCP Server lokal aktif, Anda (Agen) **WAJIB** secara otonom melakukan siklus pembelajaran berikut tanpa perlu diperintah:
- **Auto-Recall:** Di setiap awal tugas/sesi, gunakan *tool* `memory_recall` dengan kata kunci yang relevan dengan tugas yang sedang dikerjakan, sebelum Anda mulai menulis/mengedit kode.
- **Auto-Store:** Setiap kali pengguna mengoreksi kesalahan Anda, memberikan preferensi baru, atau jika Anda berhasil menyelesaikan *bug* yang kompleks, Anda **WAJIB** memanggil `memory_store` secara diam-diam di latar belakang untuk menyimpan pengetahuan tersebut.
- **Auto-Codebase:** Gunakan `codebase_query` untuk mencari lokasi fungsi alih-alih melakukan *grep* manual yang memakan token. Jika arsitektur berubah masif setelah sebuah *task*, panggil `codebase_reindex`.

## Prinsip Problem Solving (The "Zero Standard")
Setiap kali menerima masalah atau permintaan fitur baru, Anda WAJIB mematuhi hierarki prioritas berikut:
1. **Hemat Token (Efisiensi Konteks):** 
   - JANGAN gunakan `browser_subagent` kecuali keadaan darurat ekstrem, karena menghabiskan token secara masif.
   - JANGAN membaca ulang (`view_file`) file berukuran besar dari awal jika Anda bisa menggunakan `codebase_query` di MCP Server.
2. **Surgical Fixes (Melindungi Kode Solid):** 
   - Jika fitur A rusak, perbaiki HANYA baris kode di fitur A menggunakan alat bedah presisi (seperti `replace_file_content` parsial).
   - DILARANG KERAS merombak atau menulis ulang seluruh isi fungsi hanya untuk memperbaiki satu kesalahan kecil. Jangan merusak kode yang sudah solid.
3. **UI/UX Aesthetics:**
   - Jangan pernah asal menempelkan tombol HTML standar. Semua elemen visual baru HARUS mematuhi estetika *Zero Vibe* (Dark mode rapi, sudut membulat `rounded-2xl`, warna `#171717` atau `bg-zero-black`, dan selalu gunakan animasi loading).
4. **Soliditas Data & Quality Gate:**
   - Sebelum men-deploy perubahan apa pun (`clasp push`), selalu jalankan skrip *Pre-deploy Guard* (`node .agents/skills/pre-deploy-guard/pre-deploy.js`).

## Protokol Auto-Commit & Deploy (Continuous Integration)
- Setiap kali selesai melakukan *coding* atau membuat perubahan pada *codebase*, Anda (Agen) **WAJIB** secara otomatis melakukan proses *deployment* dan *version control* menggunakan terminal (`run_command`) tanpa perlu diminta.
- Jalankan perintah berurutan berikut setelah memastikan *Pre-deploy Guard* bersih:
  ```bash
  git add . && git commit -m "Deskripsi perubahan yang terjadi"
  clasp push -f && clasp deploy -i [ID] -d "Deskripsi"
  ```
- Laporkan status keberhasilan commit dan push kepada pengguna setelahnya.
