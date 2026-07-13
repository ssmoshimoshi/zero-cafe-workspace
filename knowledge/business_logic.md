# Aturan Bisnis & Aturan Operasional Zero Cafe

PENTING: Gunakan dokumen ini sebagai acuan logika (logic fallback/constraints) saat membangun fitur atau menganalisis *bugs*.

## 1. Waktu & Jam Operasional
- **Outlet Perintis:** Buka 08:00 - Tutup 04:00 (Setiap Hari).
- **Outlet Dg Tata:** Buka 08:00 - Tutup 24:00 (Minggu-Kamis) | 08:00 - Tutup 01:00 (Jumat-Sabtu).
- **Jam Kerja SPV:** 12:00 Siang - 21:00 Malam (Berlaku untuk kedua outlet).
- **Cut-off Laporan Harian (Streak System):** Maksimal jam 13:00 (1 Siang) keesokan harinya. Lebih dari itu = Streak Putus.

## 2. Standar KPI & Traffic Light
Sistem Dashboard GM menggunakan kriteria Traffic Light (Hijau = Aman, Merah = Kritis):
- **Kepatuhan SOP (Hygiene Score):** Minimal >= 95% (Aman). Di bawah 95% (Kritis).
- **Target Penjualan:** Harus mencapai >= Target Omset.
- **Komplain Pelanggan:** Maksimal <= 2 per minggu/bulan. Lebih dari 2 = Kritis.
- **Turnover Karyawan:** Maksimal <= 1 orang (Aman). Lebih dari 1 (Kritis).

## 3. Aturan Fallback (Penanganan Data Kosong)
- Data Angka: Harus di *cast* menggunakan `parseInt()`, `parseFloat()`, atau `Number()`. Jika kosong/NaN, paksa fallback ke `0`.
- Data Teks/Pandangan SPV: Jika kosong atau `"-"`, gunakan fallback seperti `"Tidak ada catatan"` atau `"Belum ada laporan"`.
- Folder Laporan: Jika Folder ID tidak ditemukan, fallback pembuatan folder wajib dilakukan di `Root Drive` agar *script* tidak *crash*.

## 4. Etika UI/UX Dashboard GM
- Hindari penggunaan *emoji* yang berlebihan (seperti 💡 atau 🔥). Gunakan tipografi dan ikon vektor yang bersih, profesional, dan serius.
- Selalu patuhi wadah (container) tampilan web (maksimal `max-w-md` atau responsif elegan) tanpa meluber di layar *desktop*.
- Selalu tampilkan **Rencana / Action Plan** saat menyajikan matriks laporan berstatus merah/kritis (berorientasi pada solusi, bukan hanya menyoroti kelemahan).

## 5. Validasi Integritas Data (The Zero Standard)
- Pengiriman Ganda (Race Condition): Gunakan kunci (lock) anti-spam di sisi GAS. 
- Di sisi Frontend, tombol `Submit` hanya boleh di- *disable* dengan status *loading*.
- **DILARANG AUTO-RESET**: Input dari form tidak boleh dikosongkan secara paksa hingga Server (GAS) benar-benar mengembalikan status `success: true`. Ini melindungi input SPV jika koneksi terputus.
