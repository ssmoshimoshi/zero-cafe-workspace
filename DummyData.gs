function generateDummyData2Bulan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Read existing Master Staff & Unique Products to preserve them
  var staffSheet = ss.getSheetByName("MasterStaff");
  var staffList = [];
  if (staffSheet) {
    var sData = staffSheet.getDataRange().getValues();
    for (var i = 1; i < sData.length; i++) {
      if (sData[i][0]) staffList.push(sData[i][0]);
    }
  }
  if (staffList.length === 0) staffList = ["Andi", "Budi", "Citra", "Dewi"];
  
  var produkSheet = ss.getSheetByName("Database_Produk");
  var produkUnik = { minuman: [], makanan: [], snack: [] };
  if (produkSheet) {
    var pData = produkSheet.getDataRange().getValues();
    for (var i = 1; i < pData.length; i++) {
      var kat = (pData[i][3] || "").toString().toLowerCase();
      var nama = (pData[i][5] || "").toString();
      if (nama && (kat === "minuman" || kat === "makanan" || kat === "snack")) {
        if (produkUnik[kat].indexOf(nama) === -1) produkUnik[kat].push(nama);
      }
    }
  }
  if (produkUnik.minuman.length < 8) produkUnik.minuman = ["Kopi Susu Zero", "Americano", "Cafe Latte", "Matcha Latte", "Red Velvet", "Lychee Tea", "Lemon Tea", "Kopi Hitam"];
  if (produkUnik.makanan.length < 8) produkUnik.makanan = ["Nasi Goreng", "Mie Goreng", "Ricebowl Ayam", "Kwetiau", "Nasi Gila", "Ayam Geprek", "Nasi Ayam Bakar", "Spaghetti"];
  if (produkUnik.snack.length < 8) produkUnik.snack = ["French Fries", "Dimsum", "Roti Bakar", "Pisang Goreng", "Cireng", "Singkong Keju", "Onion Rings", "Jamur Crispy"];
  
  // 2. Clear transactional sheets
  var sheetsToClear = ["Daily", "Weekly", "Monthly", "Database_Kebersihan", "Database_Produk", "Staff_Daily", "Staff_Weekly", "Log_QC", "Log_Fasilitas_Bahan", "Log_Audit_Kas"];
  sheetsToClear.forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (sheet && sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    }
  });
  
  // Setup sheets with EXACT real headers
  var dailySheet = ss.getSheetByName("Daily") || setupSheet(ss, "Daily", ["Tanggal", "Supervisor", "Outlet", "Shift", "Total Omset", "Komplain", "Kendala", "URL PDF", "Target Omset", "Transaksi", "Status Laporan", "Cuaca"]);
  var kbSheet = ss.getSheetByName("Database_Kebersihan") || setupSheet(ss, "Database_Kebersihan", ["Tanggal", "Outlet", "Area", "Item Pemeriksaan", "Skor", "Status", "Keterangan"]);
  var dbProdukSheet = ss.getSheetByName("Database_Produk") || setupSheet(ss, "Database_Produk", ["Periode", "Tipe Laporan", "Outlet", "Kategori", "Peringkat", "Nama Produk", "Terjual", "Rencana/Action"]);
  var stDailySheet = ss.getSheetByName("Staff_Daily") || setupSheet(ss, "Staff_Daily", ["Tanggal", "Bulan Laporan", "Outlet", "Supervisor", "Nama Staff", "Posisi", "Status Kehadiran", "Keramahan Terlewat", "Catatan Khusus"]);
  var weeklySheet = ss.getSheetByName("Weekly") || setupSheet(ss, "Weekly", ["Periode", "Supervisor", "Outlet", "Total Real Sales", "Total Target", "Komplain", "Kendala Utama", "URL PDF"]);
  var monthlySheet = ss.getSheetByName("Monthly") || setupSheet(ss, "Monthly", ["Bulan", "Supervisor", "Outlet", "Total Real Sales", "Total Target", "% Pencapaian", "Rating Kinerja", "URL PDF", "Kepatuhan SOP", "Total Telat", "Teguran", "Penyebab Kendala", "Eskalasi Fasilitas", "Strategi Depan", "Kebutuhan GM", "Berhasil", "Sulit", "Skill", "Jumlah Resign", "Masalah Utama", "Kesimpulan", "Komplain", "Remake", "Espresso", "Rekomendasi", "Pengeluaran"]);

  // BATCH ARRAYS
  var dailyRows = [], kbRows = [], produkRows = [], stDailyRows = [], weeklyRows = [], monthlyRows = [];

  // 3. Generate Data for 2 Months: July and August 2026
  var startDate = new Date(2026, 6, 1); // July 1, 2026
  var endDate = new Date(2026, 7, 31); // August 31, 2026
  var outlets = ["Perintis", "Dg Tata"];
  var supervisors = ["SPV A", "SPV B"];
  var kebersihanAreas = ["Kaca dan Kusen", "Lantai", "Tembok", "Toilet", "Wastafel", "Parking Area", "Bar", "Musholah"];
  
  var dailyAcc = { "Perintis": 0, "Dg Tata": 0 };
  var monthlyAcc = { "Perintis": 0, "Dg Tata": 0 };
  var dailyTarget = 2500000;
  var targetWeekly = dailyTarget * 7;
  
  for (var d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    var yyyy = d.getFullYear();
    var mm = ("0" + (d.getMonth() + 1)).slice(-2);
    var dd = ("0" + d.getDate()).slice(-2);
    
    var dateRaw = dd + "-" + mm + "-" + yyyy; // Pure DD-MM-YYYY
    var dateStr = "'" + dateRaw; // Prepend quote to force Plain Text in Google Sheets
    var monthStr = "'" + mm + "-" + yyyy; // Prepend quote to prevent MM-YYYY becoming Date
    var isWeekend = (d.getDay() === 0 || d.getDay() === 6);
    
    outlets.forEach(function(outlet, oIdx) {
      var spv = supervisors[oIdx];
      var baseOmset = isWeekend ? 3000000 : 1800000;
      var randomOmset = baseOmset + Math.floor(Math.random() * 1000000) - 500000;
      var randomTransaksi = Math.floor(randomOmset / 25000);
      var randomKomplain = Math.floor(Math.random() * 3);
      
      dailyAcc[outlet] += randomOmset;
      monthlyAcc[outlet] += randomOmset;
      
      // Random Weather
      var weathers = ["Cerah / Panas", "Mendung / Berawan", "Hujan Gerimis", "Hujan Deras / Badai"];
      var randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      
      // Daily (12 Columns, matching real sheet)
      // Tanggal, Supervisor, Outlet, Shift, Total Omset, Komplain, Kendala, URL PDF, Target Omset, Transaksi, Status laporan, Cuaca
      dailyRows.push([dateStr, spv, outlet, "Shift 1 & 2", randomOmset, randomKomplain, "-", "-", dailyTarget, randomTransaksi, "Lengkap", randomWeather]);
      
      // Kebersihan
      kebersihanAreas.forEach(function(area) {
        var skor = (isWeekend ? 75 : 85) + Math.floor(Math.random() * 15) - 5;
        if (skor > 100) skor = 100;
        var status = skor >= 90 ? "Bersih" : (skor >= 70 ? "Cukup Bersih" : "Kotor");
        var ket = skor < 80 ? "Perlu pembersihan ekstra" : "-";
        kbRows.push([dateStr, outlet, area, "Area " + area, skor, status, ket]);
      });
      
      // Produk
      ["minuman", "makanan", "snack"].forEach(function(kat) {
        // Top 5
        for (var i = 0; i < 5; i++) {
          var terjualTop = Math.floor(Math.random() * 50) + 10;
          produkRows.push([dateStr, "daily", outlet, kat, "Top", produkUnik[kat][i] || kat + " A", terjualTop, ""]);
        }
        // Bottom 3
        for (var i = 5; i < 8; i++) {
          if (produkUnik[kat][i]) {
            var terjualBot = Math.floor(Math.random() * 5);
            produkRows.push([dateStr, "daily", outlet, kat, "Bottom", produkUnik[kat][i], terjualBot, "Promo/Bundling"]);
          }
        }
      });
      
      // Staff Daily
      var shiftStaff = staffList.slice(0, 3);
      shiftStaff.forEach(function(nama) {
        var telat = Math.random() > 0.9 ? "Terlambat" : "Tepat Waktu";
        var noSenyum = Math.random() > 0.95 ? "YA" : "TIDAK";
        stDailyRows.push([dateStr, monthStr, outlet, spv, nama, "Barista", telat, noSenyum, ""]);
      });
      
      // Weekly
      if (d.getDay() === 0) {
        var pStart = new Date(d); pStart.setDate(d.getDate() - 6);
        var pStartStr = ("0"+pStart.getDate()).slice(-2) + "-" + ("0"+(pStart.getMonth()+1)).slice(-2) + "-" + pStart.getFullYear();
        var periode = pStartStr + " s/d " + dateRaw;
        // Periode, Supervisor, Outlet, Total Real Sales, Total Target, Komplain, Kendala Utama, URL PDF
        weeklyRows.push([periode, spv, outlet, dailyAcc[outlet], targetWeekly, Math.floor(Math.random() * 5), "Stabil", "-"]);
        dailyAcc[outlet] = 0;
      }
    });
    
    // Monthly
    var isEndOfMonth = (d.getDate() === new Date(yyyy, d.getMonth() + 1, 0).getDate());
    if (isEndOfMonth) {
      outlets.forEach(function(outlet, oIdx) {
        var spv = supervisors[oIdx];
        var targetMonthly = dailyTarget * d.getDate();
        var pencapaianM = Math.round((monthlyAcc[outlet] / targetMonthly) * 100);
        var rating = pencapaianM >= 100 ? "A" : (pencapaianM >= 85 ? "B" : "C");
        
        // 26 Columns matching real sheet
        monthlyRows.push([monthStr, spv, outlet, monthlyAcc[outlet], targetMonthly, pencapaianM, rating, "-", 88, Math.floor(Math.random()*10), Math.floor(Math.random()*2), "Fluktuasi", "AC", "Upsell", "Training", "Promo laris", "Retensi", "Latte Art", 0, "Antrian", "Stabil", Math.floor(Math.random()*15), Math.floor(Math.random()*10), "Baik", "Matcha", Math.floor(Math.random()*2000000)]);
        monthlyAcc[outlet] = 0;
      });
    }
  }

  // 4. BATCH INSERT ALL DATA
  if (dailyRows.length > 0) dailySheet.getRange(dailySheet.getLastRow() + 1, 1, dailyRows.length, dailyRows[0].length).setValues(dailyRows);
  if (kbRows.length > 0) kbSheet.getRange(kbSheet.getLastRow() + 1, 1, kbRows.length, kbRows[0].length).setValues(kbRows);
  if (produkRows.length > 0) dbProdukSheet.getRange(dbProdukSheet.getLastRow() + 1, 1, produkRows.length, produkRows[0].length).setValues(produkRows);
  if (stDailyRows.length > 0) stDailySheet.getRange(stDailySheet.getLastRow() + 1, 1, stDailyRows.length, stDailyRows[0].length).setValues(stDailyRows);
  if (weeklyRows.length > 0) weeklySheet.getRange(weeklySheet.getLastRow() + 1, 1, weeklyRows.length, weeklyRows[0].length).setValues(weeklyRows);
  if (monthlyRows.length > 0) monthlySheet.getRange(monthlySheet.getLastRow() + 1, 1, monthlyRows.length, monthlyRows[0].length).setValues(monthlyRows);
}
