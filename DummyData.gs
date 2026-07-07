// DummyData.gs
// Fungsi ini hanya untuk testing GM Dashboard dengan data bulan Agustus 2026

function generateDummyDataAgustus() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var dailySheet = ss.getSheetByName("Daily") || setupSheet(ss, "Daily", ["Tanggal", "Supervisor", "Outlet", "Shift", "Total Omset", "Komplain", "Kendala", "URL PDF", "Target Harian", "Total Transaksi"]);
  var kbSheet = ss.getSheetByName("Database_Kebersihan") || setupSheet(ss, "Database_Kebersihan", ["Tanggal", "Outlet", "Area", "Item Pemeriksaan", "Skor", "Status", "Keterangan"]);
  var weeklySheet = ss.getSheetByName("Weekly") || setupSheet(ss, "Weekly", ["Periode", "Supervisor", "Outlet", "Total Real Sales", "Total Target", "Komplain", "Kendala Utama", "URL PDF"]);
  var monthlySheet = ss.getSheetByName("Monthly") || setupSheet(ss, "Monthly", ["Bulan", "Supervisor", "Outlet", "Total Real Sales", "Total Target", "% Pencapaian", "Rating Kinerja", "URL PDF", "Kepatuhan SOP", "Total Telat", "Teguran", "Penyebab Kendala", "Eskalasi Fasilitas", "Strategi Depan", "Kebutuhan GM", "Berhasil", "Sulit", "Skill", "Jumlah Resign", "Masalah Utama", "Kesimpulan", "Komplain", "Remake", "Espresso", "Rekomendasi", "Pengeluaran"]);
  var produkSheet = ss.getSheetByName("Database_Produk") || setupSheet(ss, "Database_Produk", ["Periode", "Tipe Laporan", "Outlet", "Kategori", "Peringkat", "Nama Produk", "Terjual", "Rencana/Action"]);
  
  var supervisor = "SPV Dummy";
  var outlets = ["Perintis", "Dg Tata"];
  var kebersihanAreas = ["Kaca & Kusen", "Lantai & Meja", "Area Bar", "Toilet"];
  var produkNames = ["Kopi Susu Zero", "Americano", "Cafe Latte", "Dimsum", "Kentang Goreng"];
  var produkKategori = ["minuman", "minuman", "minuman", "snack", "snack"];
  
  var daysInAugust = 31;
  var targetHarian = 2500000;
  
  // 1. Generate Daily Data & Kebersihan & Produk
  for (var day = 1; day <= daysInAugust; day++) {
    var dateStr = "2026-08-" + (day < 10 ? "0" + day : day);
    
    outlets.forEach(function(outlet) {
      // Omset Harian antara 1.5M - 3.5M
      var randomOmset = Math.floor(Math.random() * (3500000 - 1500000 + 1)) + 1500000;
      var randomTransaksi = Math.floor(Math.random() * (120 - 50 + 1)) + 50;
      var randomKomplain = Math.floor(Math.random() * 3); // 0-2
      
      // Daily: ["Tanggal", "Supervisor", "Outlet", "Shift", "Total Omset", "Komplain", "Kendala", "URL PDF", "Target Harian", "Total Transaksi"]
      dailySheet.appendRow([
        dateStr, supervisor, outlet, "Shift 1 & 2", randomOmset, randomKomplain, "Lancar", "-", targetHarian, randomTransaksi
      ]);
      
      // Kebersihan: ["Tanggal", "Outlet", "Area", "Item Pemeriksaan", "Skor", "Status", "Keterangan"]
      kebersihanAreas.forEach(function(area) {
        // Skor random 60 - 100
        var skor = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
        var status = skor >= 90 ? "Bersih" : (skor >= 80 ? "Cukup Bersih" : "Kotor");
        var ket = skor < 80 ? "Ada noda yang belum dibersihkan" : "-";
        
        kbSheet.appendRow([
          dateStr, outlet, area, "Checklist Pagi & Malam", skor, status, ket
        ]);
      });
      
      // Produk (Sales Item)
      produkNames.forEach(function(nama, idx) {
        var qty = Math.floor(Math.random() * 50) + 5; // 5-54 terjual
        var peringkat = qty > 25 ? "Top" : "Bottom"; // Simple rule for dummy
        // ["Periode", "Tipe Laporan", "Outlet", "Kategori", "Peringkat", "Nama Produk", "Terjual", "Rencana/Action"]
        produkSheet.appendRow([
          dateStr, "daily", outlet, produkKategori[idx], peringkat, nama, qty, "-"
        ]);
      });
    });
  }
  
  // 2. Generate Weekly Data (4 Minggu di bulan Agustus)
  var weeks = [
    { start: "2026-08-01", end: "2026-08-07" },
    { start: "2026-08-08", end: "2026-08-14" },
    { start: "2026-08-15", end: "2026-08-21" },
    { start: "2026-08-22", end: "2026-08-28" }
  ];
  
  weeks.forEach(function(w) {
    var periode = w.start + " s/d " + w.end;
    outlets.forEach(function(outlet) {
      // Weekly: ["Periode", "Supervisor", "Outlet", "Total Real Sales", "Total Target", "Komplain", "Kendala Utama", "URL PDF"]
      var wkSales = 18000000; // Asumsi 18jt per minggu
      var wkTarget = 17500000;
      weeklySheet.appendRow([
        periode, supervisor, outlet, wkSales, wkTarget, 2, "Stok susu sering habis", "-"
      ]);
    });
  });
  
  // 3. Generate Monthly Data (Bulan 08-2026)
  outlets.forEach(function(outlet) {
    var mBulan = "08-2026";
    var mSales = 75000000;
    var mTarget = 77500000;
    var mPersen = Math.round((mSales/mTarget)*100);
    
    // Perbedaan data untuk outlet Perintis vs Dg Tata (biar terlihat di Dasbor GM)
    var mSop = outlet === "Perintis" ? 95 : 82;
    var mTelat = outlet === "Perintis" ? 1 : 5;
    var mTeguran = outlet === "Perintis" ? 0 : 3;
    var mKendala = outlet === "Perintis" ? "Mesin espresso agak lambat panas." : "Barista sering nongkrong, meja kotor, butuh pengawasan ekstra.";
    var mEskalasi = outlet === "Perintis" ? "-" : "AC indoor netes air ke meja tamu, butuh diservis segera!";
    var mResign = outlet === "Perintis" ? 0 : 2;
    
    monthlySheet.appendRow([
      mBulan, supervisor, outlet, mSales, mTarget, mPersen, 
      "80", "-", mSop, mTelat, mTeguran, mKendala, 
      mEskalasi, "Fokus promosi bundling akhir bulan", "Dana operasional AC", "Upselling minuman", "Bikin konten sosmed", "Latte art", 
      mResign, "Mesin AC bocor", "Bulan cukup berat tapi tertolong weekend", 10, 5, "-", 
      "-", 0
    ]);
  });
  
  Logger.log("Dummy data Agustus 2026 berhasil digenerate!");
}
