/**
 * GENERATOR DATA DUMMY (JULI - SEPTEMBER 2026)
 * Skrip ini digunakan untuk mensimulasikan data riil dengan parameter khusus
 * guna menguji algoritma AI Predictive Engine pada Dasbor GM.
 */

function runAllMocks() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  deleteLegacySheets(ss);
  mock_MasterData(ss);
  mock_Config(ss);
  mock_DailyLoop_AllOutlets(ss);
  mock_WeeklyMonthly(ss);
  Logger.log("Mock Data Generation Complete!");
}

function deleteLegacySheets(ss) {
  var legacyNames = ["Daily", "Weekly", "Monthly", "Kebersihan"];
  for (var i = 0; i < legacyNames.length; i++) {
    var sheet = ss.getSheetByName(legacyNames[i]);
    if (sheet) {
      ss.deleteSheet(sheet);
    }
  }
}

function mock_MasterData(ss) {
  // 1. MasterStaff
  var staffSheet = ss.getSheetByName("MasterStaff") || ss.insertSheet("MasterStaff");
  staffSheet.clear();
  staffSheet.appendRow(["ID", "Nama", "Posisi", "Status", "Outlet"]);
  staffSheet.getRange("A1:E1").setFontWeight("bold");
  staffSheet.setFrozenRows(1);
  
  var staffs = [
    ["1", "Nathan", "Supervisor", "Aktif", "Perintis"],
    ["2", "Eko", "Barista", "Aktif", "Perintis"],
    ["3", "Amel", "Kasir", "Aktif", "Perintis"],
    ["4", "Joko", "Server", "Aktif", "Perintis"],
    ["5", "Sela", "Supervisor", "Aktif", "Dg Tata"],
    ["6", "Budi", "Barista", "Aktif", "Dg Tata"],
    ["7", "Siti", "Kasir", "Aktif", "Dg Tata"],
    ["8", "Anton", "Server", "Aktif", "Dg Tata"]
  ];
  staffSheet.getRange(2, 1, staffs.length, 5).setValues(staffs);

  // 2. MasterProduk (45 products)
  var prodSheet = setupSheet(ss, "MasterProduk", ["Kategori", "Nama Produk", "Harga Jual", "HPP Estimasi", "Status", "Outlet Khusus"]);
  if (prodSheet.getLastRow() > 1) prodSheet.getRange(2, 1, prodSheet.getLastRow() - 1, 6).clearContent();
  
  var products = [];
  for (var i = 1; i <= 15; i++) {
    products.push(["Minuman", "Kopi Varian " + i, 20000 + (i*1000), 10000, "Aktif", "Semua"]);
    products.push(["Makanan", "Nasi Varian " + i, 25000 + (i*1000), 12000, "Aktif", "Semua"]);
    products.push(["Snack", "Snack Varian " + i, 15000 + (i*500), 8000, "Aktif", "Semua"]);
  }
  prodSheet.getRange(2, 1, products.length, 6).setValues(products);
}

function mock_Config(ss) {
  var configSheet = setupSheet(ss, "Config_Target", ["Bulan-Tahun", "Indikator Utama", "Outlet", "Target Nilai", "Metrik Tambahan"]);
  if (configSheet.getLastRow() > 1) configSheet.getRange(2, 1, configSheet.getLastRow() - 1, 5).clearContent();
  
  var targets = [
    ["'07-2026", "Target Omset Bulanan", "Perintis", 180000000, ""],
    ["'08-2026", "Target Omset Bulanan", "Perintis", 180000000, ""],
    ["'09-2026", "Target Omset Bulanan", "Perintis", 180000000, ""],
    ["'07-2026", "Target Omset Bulanan", "Dg Tata", 160000000, ""],
    ["'08-2026", "Target Omset Bulanan", "Dg Tata", 160000000, ""],
    ["'09-2026", "Target Omset Bulanan", "Dg Tata", 160000000, ""]
  ];
  configSheet.getRange(2, 1, targets.length, 5).setValues(targets);

  var paramSheet = setupSheet(ss, "Config_Parameter", ["Outlet", "Kategori", "Nama Event", "Tanggal Mulai", "Tanggal Selesai", "Status Aktif"]);
  if (paramSheet.getLastRow() > 1) paramSheet.getRange(2, 1, paramSheet.getLastRow() - 1, 6).clearContent();
  
  var params = [
    ["Semua", "Kalender Akademik", "Ujian Akhir Semester UNHAS", "2026-07-10", "2026-07-20", "Aktif"],
    ["Semua", "Kalender Akademik", "Penerimaan Mahasiswa Baru", "2026-08-15", "2026-08-25", "Aktif"],
    ["Semua", "Event Lokal", "Festival Makassar", "2026-09-05", "2026-09-08", "Aktif"]
  ];
  paramSheet.getRange(2, 1, params.length, 6).setValues(params);
}

function mock_DailyLoop_AllOutlets(ss) {
  var startDate = new Date(2026, 6, 1); // 1 July 2026 (Month is 0-indexed)
  var endDate = new Date(2026, 8, 30);  // 30 Sept 2026

  var dates = [];
  var dt = new Date(startDate);
  while (dt <= endDate) {
    dates.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }

  // Arrays for batch inserting (Performance Optimization)
  var dailyP = [], dailyD = [];
  var staffDaily = [];
  var auditKas = [];
  var kebersihanP = [], kebersihanD = [];
  var qc = [];
  var fasilitas = [];

  for (var i = 0; i < dates.length; i++) {
    var d = dates[i];
    var yyyy = d.getFullYear();
    var mm = ("0" + (d.getMonth() + 1)).slice(-2);
    var dd = ("0" + d.getDate()).slice(-2);
    var dateStr = yyyy + "-" + mm + "-" + dd;
    var blnLaporan = mm + "-" + yyyy;

    // RANDOMIZER CUACA
    var isHujanP = Math.random() < 0.2; // 20% hujan di Perintis
    var cuacaP = isHujanP ? "Hujan Deras" : "Cerah / Panas";
    var isHujanD = Math.random() < 0.3; // 30% hujan di Dg Tata
    var cuacaD = isHujanD ? "Hujan Deras" : "Cerah / Panas";

    // ================================================================
    // OUTLET PERINTIS (KINERJA SEMPURNA - KPI HIJAU)
    // ================================================================
    // Omset: 6jt - 7.5jt (Target 180jt = 6jt/hari) -> Tercapai
    var omsetP = 6000000 + Math.floor(Math.random() * 1500000);
    var trXP = 120 + Math.floor(Math.random() * 40); // 120 - 160 trx
    
    dailyP.push([
      dateStr, "Nathan", "Perintis", "Full Shift", omsetP, 0, "-", "https://dummy-url.com/pdf_perintis", 6000000, trXP, "Lengkap", cuacaP
    ]);

    // Staff Daily Perintis (Tidak ada telat)
    staffDaily.push([dateStr, blnLaporan, "Perintis", "Perintis", "Nathan", "Eko", "Barista", "Hadir", "", ""]);
    staffDaily.push([dateStr, blnLaporan, "Perintis", "Perintis", "Nathan", "Amel", "Kasir", "Hadir", "", ""]);
    staffDaily.push([dateStr, blnLaporan, "Perintis", "Perintis", "Nathan", "Joko", "Server", "Hadir", "", ""]);

    // Audit Kas Perintis (3x sehari, 0 selisih)
    auditKas.push([dateStr, "Perintis", "Pagi", 1000000, 500000, 1500000, 0, "Aman"]);
    auditKas.push([dateStr, "Perintis", "Siang", 2000000, 1000000, 3000000, 0, "Aman"]);
    auditKas.push([dateStr, "Perintis", "Malam", 1500000, (omsetP - 4500000), (omsetP - 1500000), 0, "Aman"]);

    // Kebersihan Perintis (>90%)
    kebersihanP.push([dateStr, "Perintis", "Bar Area", "Pagi", 95, "Lengkap", "Sangat Bersih", "url"]);
    kebersihanP.push([dateStr, "Perintis", "Toilet", "Malam", isHujanP ? 90 : 98, "Lengkap", "Aman", "url"]);
    kebersihanP.push([dateStr, "Perintis", "Lantai Utama", "Malam", isHujanP ? 92 : 100, "Lengkap", "Aman", "url"]);

    // QC & Fasilitas Perintis
    qc.push([dateStr, "Perintis", "Espresso", "Kalibrasi Pagi", "Sesuai Standar", "Body & Crema mantap"]);
    fasilitas.push([dateStr, "Perintis", "Fasilitas", "AC Indoor", "Berfungsi Baik", 0, "", "TIDAK"]);


    // ================================================================
    // OUTLET DG TATA (ANOMALI / KPI MERAH / KINERJA BURUK)
    // ================================================================
    // Omset: 3.5jt - 5jt (Target 160jt = 5.3jt/hari) -> Tidak Tercapai
    var omsetD = 3500000 + Math.floor(Math.random() * 1500000);
    var trxD = 100 + Math.floor(Math.random() * 80); // 100 - 180 trx
    var komplainD = (trxD > 120) ? 4 : 1; // Komplain tinggi kalau trx banyak (Fatigue)
    
    dailyD.push([
      dateStr, "Sela", "Dg Tata", "Full Shift", omsetD, komplainD, "Kelelahan staf dan mesin bocor", "https://dummy-url.com/pdf_dgtata", 5333333, trxD, "Lengkap", cuacaD
    ]);

    // Staff Daily Dg Tata (Banyak Telat)
    var isBudiMasuk = (i % 5 !== 0); // Budi libur tiap 5 hari
    var budiStatus = (Math.random() < 0.4) ? "Terlambat" : "Hadir"; // Budi sering telat
    var sitiStatus = (Math.random() < 0.2) ? "Terlambat" : "Hadir";
    
    if (isBudiMasuk) staffDaily.push([dateStr, blnLaporan, "Dg Tata", "Dg Tata", "Sela", "Budi", "Barista", budiStatus, "", "Sering istirahat"]);
    staffDaily.push([dateStr, blnLaporan, "Dg Tata", "Dg Tata", "Sela", "Siti", "Kasir", sitiStatus, "", ""]);
    staffDaily.push([dateStr, blnLaporan, "Dg Tata", "Dg Tata", "Sela", "Anton", "Server", "Hadir", "", ""]);

    // Audit Kas Dg Tata (3x sehari)
    // Target Total Minus Sebulan = -300k. Dengan 30 hari x peluang 30% Budi minus = ~10 hari minus. 
    // Jadi -30.000 per kejadian saat Budi masuk.
    var selisihD = 0;
    if (isBudiMasuk && Math.random() < 0.3) {
       selisihD = -30000; // Minus 30rb
    }
    
    auditKas.push([dateStr, "Dg Tata", "Pagi", 1000000, 500000, 1500000, 0, "Aman"]);
    auditKas.push([dateStr, "Dg Tata", "Siang", 1000000, 500000, 1500000, selisihD, selisihD < 0 ? "Selisih Kas Misterius" : "Aman"]);
    auditKas.push([dateStr, "Dg Tata", "Malam", 1000000, (omsetD - 3000000), (omsetD - 2000000), 0, "Aman"]);

    // Kebersihan Dg Tata (Maksimal 75%)
    var skorBar = 60 + Math.floor(Math.random() * 15);
    var skorToilet = isHujanD ? 50 : 70; // Sangat hancur saat hujan
    var skorLantai = isHujanD ? 45 : 75;
    
    kebersihanD.push([dateStr, "Dg Tata", "Bar Area", "Malam", skorBar, "Kurang Bersih", "Meja Bar Berantakan", "url"]);
    kebersihanD.push([dateStr, "Dg Tata", "Toilet", "Malam", skorToilet, "Kotor", "Bau pesing & tisu habis", "url"]);
    kebersihanD.push([dateStr, "Dg Tata", "Lantai Utama", "Malam", skorLantai, "Cukup", "Banyak noda bekas kaki", "url"]);

    // QC & Fasilitas Dg Tata
    qc.push([dateStr, "Dg Tata", "Menu", "Nasi Varian 1", "Dikomplain", "Rasa hambar / basi"]);
    qc.push([dateStr, "Dg Tata", "Minuman", "Kopi Varian 3", "Remake", "Terlalu manis"]);
    
    fasilitas.push([dateStr, "Dg Tata", "Fasilitas", "Mesin Espresso", "Bocor Halus", 150000, "", "YA"]);
    if (isHujanD) fasilitas.push([dateStr, "Dg Tata", "Fasilitas", "Atap Depan", "Bocor", 500000, "", "YA"]);
  }

  // --- BATCH WRITE TO SHEETS ---
  writeArrayToSheet(ss, "Daily_Perintis", ["Tanggal","Supervisor","Outlet","Shift","Total Omset","Total Komplain","Kendala","URL PDF","Target Penjualan","Total Transaksi","Status Laporan","Cuaca"], dailyP);
  writeArrayToSheet(ss, "Daily_Dg Tata", ["Tanggal","Supervisor","Outlet","Shift","Total Omset","Total Komplain","Kendala","URL PDF","Target Penjualan","Total Transaksi","Status Laporan","Cuaca"], dailyD);
  
  writeArrayToSheet(ss, "Staff_Daily", ["Tanggal","Bulan Laporan","Outlet Tugas","Outlet Asal","Supervisor","Nama Staff","Posisi","Status Kehadiran","Keramahan Terlewat","Catatan Khusus"], staffDaily);
  writeArrayToSheet(ss, "Log_Audit_Kas", ["Tanggal","Outlet","Shift/Jam","Total QRIS","Total Tunai","Aktual Sistem","Selisih","Keterangan"], auditKas);
  
  writeArrayToSheet(ss, "Kebersihan_Perintis", ["Tanggal","Outlet","Area Kebersihan","Waktu Inspeksi","Skor Kebersihan","Status Checklist","Keterangan Tambahan","URL Foto"], kebersihanP);
  writeArrayToSheet(ss, "Kebersihan_Dg Tata", ["Tanggal","Outlet","Area Kebersihan","Waktu Inspeksi","Skor Kebersihan","Status Checklist","Keterangan Tambahan","URL Foto"], kebersihanD);
  
  writeArrayToSheet(ss, "Log_QC", ["Tanggal","Outlet","Kategori","Item/Menu","Status","Keterangan"], qc);
  writeArrayToSheet(ss, "Log_Fasilitas_Bahan", ["Tanggal","Outlet","Tipe","Nama Item","Status/Ketersediaan","Biaya Estimasi","URL Foto","Eskalasi"], fasilitas);
}

function mock_WeeklyMonthly(ss) {
   var w = [];
   var m = [];
   var sw = [];
   var sm = [];

   // July, Aug, Sept
   var periods = ["07-2026", "08-2026", "09-2026"];
   
   for (var p=0; p<periods.length; p++) {
      var pd = periods[p];
      
      // PERINTIS MONTHLY (ALL GREEN) - 26 Columns
      m.push([
        pd, "Nathan", "Perintis", 185000000, 180000000, 103, 5, "https://dummy-url.com/pdf_monthly",
        95, 2, 0, "Aman, Tim Solid", "-", "Pertahankan", "Tidak Ada", "Target terlampaui", "-", "Baik", 0,
        "Aman", "Pertahankan kinerja", 0, 0, "Sangat Baik", "Pertahankan", 0
      ]);
      sm.push([pd, "Perintis", "Nathan", "Eko", "Barista", "Sangat Baik", "Rajin"]);
      sm.push([pd, "Perintis", "Nathan", "Amel", "Kasir", "Baik", "Teliti"]);
      
      // DG TATA MONTHLY (ALL RED) - 26 Columns
      m.push([
        pd, "Sela", "Dg Tata", 125000000, 160000000, 78, 2, "https://dummy-url.com/pdf_monthly",
        68, 45, 4, "Banyak mesin rusak, kelelahan", "Mesin Espresso & Atap", "Rotasi Karyawan", "Butuh Teknisi & Part Time", "-", "Banyak Komplain Pelanggan", "Kurang", 1,
        "Mesin espresso bocor dan toilet kotor", "Perlu evaluasi sdm", 15, 10, "Kurang Baik", "Kalibrasi ulang", 1500000
      ]);
      sm.push([pd, "Dg Tata", "Sela", "Budi", "Barista", "Buruk", "Sering telat dan diduga curang"]);
      sm.push([pd, "Dg Tata", "Sela", "Siti", "Kasir", "Kurang", "Kurang ramah saat lelah"]);

      // WEEKLY (4 weeks per month)
      for (var wk=1; wk<=4; wk++) {
         var wp = "Week " + wk + " " + pd;
         w.push([wp, "Nathan", "Perintis", 46000000, 45000000, 0, "Aman", "https://dummy-url.com/pdf_weekly"]);
         w.push([wp, "Sela", "Dg Tata", 31000000, 40000000, 4, "Mesin espresso bocor", "https://dummy-url.com/pdf_weekly"]);
         
         sw.push([wp, pd, "Perintis", "Nathan", "Eko", "Barista", "Sangat Baik", "-"]);
         sw.push([wp, pd, "Dg Tata", "Sela", "Budi", "Barista", "Buruk (SP1)", "Telat 3x berturut-turut"]);
      }
   }

   writeArrayToSheet(ss, "Weekly", ["Periode", "Supervisor", "Outlet", "Total Real Sales", "Total Target", "Komplain", "Kendala Utama", "URL PDF"], w);
   writeArrayToSheet(ss, "Monthly", [
      "Bulan", "Supervisor", "Outlet", "Total Sales", "Target Sales", "Persen Tercapai", "Rating Kerja", "URL PDF",
      "Kepatuhan SOP", "Total Telat", "Teguran", "Kendala Utama", "Eskalasi Fasilitas", "Strategi", "Kebutuhan GM",
      "Pencapaian", "Tantangan", "Skill", "Turnover Barista",
      "Ringkasan Masalah", "Kesimpulan", "QC Komplain", "QC Remake", "QC Espresso", "QC Rekomendasi", "Pengeluaran Fasilitas"
   ], m);
   
   writeArrayToSheet(ss, "Staff_Weekly", ["Periode", "Bulan Laporan", "Outlet", "Supervisor", "Nama Staff", "Posisi", "Status Evaluasi", "Catatan/Alasan"], sw);
   writeArrayToSheet(ss, "Staff_Monthly", ["Bulan", "Outlet", "Supervisor", "Nama Staff", "Posisi", "Status Evaluasi", "Catatan/Alasan"], sm);
}

function writeArrayToSheet(ss, sheetName, headers, dataArray) {
  var sheet = setupSheet(ss, sheetName, headers);
  // Clear old data except header
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  if (dataArray.length > 0) {
    sheet.getRange(2, 1, dataArray.length, dataArray[0].length).setValues(dataArray);
  }
}

function setupSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  } else {
    var existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
    if (existingHeaders[0] === "") {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}
