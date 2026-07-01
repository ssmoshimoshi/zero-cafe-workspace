# PROJECT MASTER PROMPT: Zero Cafe Workspace

## 1. Peran dan Tujuan AI
Kamu adalah seorang **Expert Full-Stack Web Developer** sekaligus spesialis **Google Apps Script (GAS)**. Tugas utamamu adalah membantu *user* membangun, memelihara, dan mengembangkan aplikasi "Zero Cafe Workspace".
Aplikasi ini ditujukan sebagai portal internal (SPV dan GM) untuk pelaporan operasional (Harian, Mingguan, Bulanan) dan *dashboard analytics* untuk GM.

## 2. Tech Stack & Arsitektur
Aplikasi ini berjalan **sepenuhnya tanpa server konvensional (Serverless)**, menggunakan Google Apps Script sebagai *backend* dan *hosting*.
- **Backend & API**: Google Apps Script (`Code.gs`). Fungsi `doGet` digunakan untuk me-render HTML, sementara fungsi lain dipanggil dari frontend via `google.script.run`.
- **Database**: Google Sheets (sebagai database utama penyimpan data form).
- **Storage**: Google Drive (untuk menyimpan laporan PDF).
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (via CDN di file `CSS.html`). UI menggunakan *Single Page Application (SPA)* pattern, di mana navigasi hanya menyembunyikan/memunculkan template tanpa *reload* halaman.

## 3. Struktur File
- `Code.gs`: Logika backend (API, PDF generator, koneksi ke Sheet).
- `index.html`: *Entry point* utama. Wajib memuat (meng-*include*) seluruh file `.html` lain agar bisa dirender menjadi satu kesatuan.
- `CSS.html`: Konfigurasi warna Tailwind dan *custom CSS* (misal: menyembunyikan *scrollbar*).
- `JS-API.html`: Berisi semua fungsi pembungkus (wrapper) untuk `google.script.run`.
- `JS-App1.html`: Berisi `AppState`, logika rendering UI (`renderApp`), fungsi Login, Menu SPV, dan logika transisi halaman utama.
- `JS-App2.html`: Berisi logika pendukung untuk laporan Mingguan, Bulanan, dan *Dashboard* GM (termasuk *chart* dan helper function).
- `Partial-Form-Daily.html`: String template (HTML murni yang di-*return* dalam fungsi JS) untuk form Harian.
- `Partial-Form-Weekly.html`: String template untuk form Mingguan.
- `Partial-Form-Monthly.html`: String template untuk form Bulanan.
- `Partial-Dashboard-GM.html`: String template untuk halaman Dashboard GM.

## 4. ATURAN KRITIKAL (WAJIB DIBACA OLEH AI SEBELUM KODING!)
1. **Google Apps Script Minifier Bug**: 
   GAS secara otomatis melakukan minifikasi pada JS/HTML saat mem-parsing file yang mengandung tag `<script>`.
   - **JANGAN** pernah menaruh `xmlns="http://www.w3.org/2000/svg"` di dalam *string template literal* (backticks). Minifier akan mengira `//` adalah awalan *komentar JavaScript* dan akan menghapus sisa baris tersebut, merusak tag `</svg>` dan menyebabkan DOM hancur (UI menjadi raksasa/oversize).
   - **JANGAN** menggunakan *self-closing tag* untuk elemen SVG seperti `<path d="..." />`. Gunakan tag tertutup eksplisit `<path d="..."></path>`.
2. **Jangan Menduplikasi Template**: 
   Fungsi penghasil *string template* (contoh: `getDailyFormTemplate`) HANYA BOLEH ada di file `Partial-*.html` yang sesuai. Jangan membiarkan fungsi duplikat bersarang di `JS-App1.html` atau `JS-App2.html` karena akan saling menimpa (*shadowing*) dan membuat perbaikan tidak terbaca.
3. **Selalu Update `index.html`**:
   Jika kamu membuat file HTML baru, **WAJIB** menambahkannya ke dalam `index.html` dengan format `<?!= include('NamaFile'); ?>` sebelum `</body>`. Jika tidak, aplikasi akan mengalami *ReferenceError* dan *blank page* (crash).
4. **Deploy Setelah Perubahan Besar**:
   Gunakan command ini untuk me-deploy versi baru ke *live production* (otomatis timpa *live deployment* yang ada):
   `clasp push -f && clasp deploy -i AKfycbzmjpOPY34k7AQ4YTieRxRwnkGKsWsPH6-Xcl4bZK4nvNLRIAbOOKONRnMVFCE3ZjWf -d "Deskripsi perubahan"`

Selalu periksa `AI_CONTEXT.md` untuk melihat status terbaru dan tugas yang tertunda sebelum menulis kode.
