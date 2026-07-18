/**
 * GENERATOR DATA DUMMY (JULI - SEPTEMBER 2026)
 * Sesuai Arsitektur 9 Sheet (ID_Laporan based)
 */

function runAllMocks() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  mock_MasterData(ss);
  mock_DailyLoop(ss);
  mock_WeeklyMonthly(ss);
  SpreadsheetApp.getUi().alert("Mock Data Selesai", "Data dummy untuk 3 bulan (Juli-Sept 2026) berhasil ditambahkan ke 9 Sheet.", SpreadsheetApp.getUi().ButtonSet.OK);
}

function mock_MasterData(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  var staffSheet = ss.getSheetByName("Master_Staff");
  if (staffSheet && staffSheet.getLastRow() <= 1) {
    var staffs = [
      ["STF-001", "Nathan", "Supervisor", "Aktif", "Perintis"],
      ["STF-002", "Sela", "Supervisor", "Aktif", "Dg Tata"],
      ["STF-003", "Eko", "Barista", "Aktif", "Perintis"],
      ["STF-004", "Amel", "Kasir", "Aktif", "Perintis"],
      ["STF-005", "Budi", "Barista", "Aktif", "Dg Tata"],
      ["STF-006", "Siti", "Kasir", "Aktif", "Dg Tata"],
      ["STF-007", "Anton", "Server", "Aktif", "Dg Tata"],
      ["STF-008", "Joko", "Server", "Aktif", "Perintis"]
    ];
    staffSheet.getRange(2, 1, staffs.length, 5).setValues(staffs);
  }

  var prodSheet = ss.getSheetByName("Master_Produk");
  if (prodSheet && prodSheet.getLastRow() <= 1) {
    var products = [];
    for (var i = 1; i <= 15; i++) {
      products.push(["MNU-M" + i, "Minuman", "Kopi Varian " + i, 20000 + (i*1000), "Aktif"]);
      products.push(["MNU-F" + i, "Makanan", "Nasi Varian " + i, 25000 + (i*1000), "Aktif"]);
      products.push(["MNU-S" + i, "Snack", "Snack Varian " + i, 15000 + (i*500), "Aktif"]);
    }
    prodSheet.getRange(2, 1, products.length, 5).setValues(products);
  }
}

function mock_DailyLoop(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  var startDate = new Date(2026, 6, 1); // 1 July 2026
  var endDate = new Date(2026, 8, 30);  // 30 Sept 2026

  var harian = [], briefing = [], kehadiran = [], kas = [], produk = [], inspeksi = [];
  var outlets = ["Perintis", "Dg Tata"];
  var spvs = [["Nathan", "Bima"], ["Sela", "Rani"]];
  
  var cuacaList = ["Cerah / Panas", "Berawan", "Hujan Gerimis", "Hujan Deras"];

  var dt = new Date(startDate);
  
  var realProduk = { Minuman: [], Makanan: [], Snack: [] };
  var mpSheet = ss.getSheetByName("Master_Produk");
  if (mpSheet) {
    var mpData = mpSheet.getDataRange().getValues();
    for (var m = 1; m < mpData.length; m++) {
      var status = String(mpData[m][4] || "").trim().toLowerCase();
      if (status === "aktif") {
        var pCat = String(mpData[m][1] || "").trim();
        var matchedCat = null;
        if (pCat.toLowerCase() === "minuman") matchedCat = "Minuman";
        else if (pCat.toLowerCase() === "makanan") matchedCat = "Makanan";
        else if (pCat.toLowerCase() === "snack") matchedCat = "Snack";
        
        if (matchedCat && realProduk[matchedCat]) {
          realProduk[matchedCat].push(String(mpData[m][2] || "").trim());
        }
      }
    }
  }
  
  while (dt <= endDate) {
    var yyyy = dt.getFullYear();
    var mm = ("0" + (dt.getMonth() + 1)).slice(-2);
    var dd = ("0" + dt.getDate()).slice(-2);
    var dateStr = dd + "-" + mm + "-" + yyyy;
    var blnLaporan = mm + "-" + yyyy;

    for (var o = 0; o < outlets.length; o++) {
      var outlet = outlets[o];
      var spv = spvs[o][Math.floor(Math.random() * spvs[o].length)];
      var idLaporan = dateStr + "-" + outlet.replace(/\s+/g, "_");
      
      // LOGIKA KINERJA: Perintis bagus, Dg Tata agak kurang (terutama jika ada hujan)
      var isHujan = Math.random() > 0.7;
      var cuaca = isHujan ? cuacaList[3] : cuacaList[0];
      
      var eventLokalList = ["Normal / Tidak Ada", "Event Kampus / Wisuda", "Tanggal Muda / Gajian", "Tanggal Tua"];
      var profilList = ["Mahasiswa Nugas (Solo/Duo)", "Pekerja WFC (Solo)", "Rombongan Nongkrong"];
      var randEvent = eventLokalList[Math.floor(Math.random() * eventLokalList.length)];
      var randProfil = profilList[Math.floor(Math.random() * profilList.length)];
      
      var targetOmset = outlet === "Perintis" ? 6000000 : 5300000;
      var baseOmset = outlet === "Perintis" ? 6500000 : 4500000;
      if (isHujan) baseOmset -= 1000000; // Omset turun kalau hujan
      
      var omsetTotal = baseOmset + Math.floor(Math.random() * 1000000);
      var transaksi = Math.floor(omsetTotal / 25000);
      var kendala = isHujan ? "Sepi karena hujan deras" : "Tidak ada kendala berarti";
      var saran = isHujan ? "Perbanyak promo delivery" : "Lanjutkan strategi upselling";
      
      harian.push([idLaporan, "'" + dateStr, blnLaporan, outlet, spv, cuaca, omsetTotal, targetOmset, transaksi, kendala, saran, "-", randEvent, randProfil]);
      
      var briefingFokusList = [
        "Tingkatkan upselling minuman dan keramahan",
        "Jaga kebersihan area meja pelanggan",
        "Percepat pelayanan di jam sibuk",
        "Cek stok bahan baku sebelum shift",
        "Disiplin datang tepat waktu",
        "Keramahan dan upselling makanan"
      ];
      var bFokus = briefingFokusList[Math.floor(Math.random() * briefingFokusList.length)];
      var bEvaluasi = isHujan ? "Pelayanan lambat saat hujan, lantai kotor" : "Kemarin cukup bagus, pertahankan";
      
      briefing.push([idLaporan, targetOmset, bFokus, bEvaluasi, "Tawarkan bundling dan jaga kebersihan"]);
      
      // Kehadiran (Perintis: Aman, Dg Tata: Sering Telat)
      if (outlet === "Perintis") {
        kehadiran.push([idLaporan, "Eko", "Barista", "Perintis", "Perintis", "Hadir", "TIDAK", "-"]);
        kehadiran.push([idLaporan, "Amel", "Kasir", "Perintis", "Perintis", "Hadir", "TIDAK", "-"]);
      } else {
        var telatBudi = Math.random() > 0.5 ? "Terlambat" : "Hadir";
        kehadiran.push([idLaporan, "Budi", "Barista", "Dg Tata", "Dg Tata", telatBudi, "YA", telatBudi === "Terlambat" ? "Sering telat" : "-"]);
        kehadiran.push([idLaporan, "Siti", "Kasir", "Dg Tata", "Dg Tata", "Hadir", "TIDAK", "-"]);
      }
      
      // Kas
      kas.push([idLaporan, "Shift 1", outlet==="Perintis"?"Amel":"Siti", 1000000, 500000, 1500000, 2000000, 0, "Aman"]);
      var selisih = Math.random() > 0.8 ? -50000 : 0; // Kasir Minus terjadi di semua outlet
      kas.push([idLaporan, "Shift 2", outlet==="Perintis"?"Amel":"Siti", 1000000, 800000, 2000000, 2800000, selisih, selisih < 0 ? "Kurang kembalian" : "Aman"]);
      
      // Helper function to shuffle and pick unique items
      function getUniqueRandomItems(arr, count, fallbackPrefix) {
        var shuffled = arr.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = shuffled[i];
          shuffled[i] = shuffled[j];
          shuffled[j] = temp;
        }
        var result = [];
        for (var k = 0; k < count; k++) {
          if (k < shuffled.length) {
            result.push(shuffled[k]);
          } else {
            result.push(fallbackPrefix + " " + (k + 1));
          }
        }
        return result;
      }

      // Produk (Generate Top and Bottom for each category using real names)
      var categories = ["Minuman", "Makanan", "Snack"];
      categories.forEach(function(cat) {
        var available = realProduk[cat] && realProduk[cat].length > 0 ? realProduk[cat] : [];
        var chosen = getUniqueRandomItems(available, 8, cat + " Default");
        
        for (var i = 0; i < 5; i++) {
          produk.push([idLaporan, cat, "Top", chosen[i], Math.floor(Math.random() * 20) + 20, "-"]);
        }
        for (var j = 5; j < 8; j++) {
          produk.push([idLaporan, cat, "Bottom", chosen[j], Math.floor(Math.random() * 5) + 1, "-"]);
        }
      });
      
      // Inspeksi
      inspeksi.push([idLaporan, "Kebersihan", "Toilet", isHujan && outlet==="Dg Tata" ? 60 : 90, 0, isHujan && outlet==="Dg Tata" ? "Kotor bekas sepatu" : "Bersih"]);
      inspeksi.push([idLaporan, "Kebersihan", "Bar", 95, 0, "Bersih"]);
      if (Math.random() > 0.95) inspeksi.push([idLaporan, "Fasilitas", "Mesin Kopi", "Bocor Halus", 150000, "Tunggu teknisi"]);
    }
    dt.setDate(dt.getDate() + 1);
  }

  writeArrayToSheet(ss, "DB_Laporan_Harian", harian);
  writeArrayToSheet(ss, "DB_Briefing_Shift", briefing);
  writeArrayToSheet(ss, "DB_Kehadiran_Staf", kehadiran);
  writeArrayToSheet(ss, "DB_Audit_Kas", kas);
  writeArrayToSheet(ss, "DB_Kinerja_Produk", produk);
  writeArrayToSheet(ss, "DB_Inspeksi_Operasional", inspeksi);
}

function mock_WeeklyMonthly(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  
  var realProduk = { Minuman: [], Makanan: [], Snack: [] };
  var mpSheet = ss.getSheetByName("Master_Produk");
  if (mpSheet) {
    var mpData = mpSheet.getDataRange().getValues();
    for (var m = 1; m < mpData.length; m++) {
      var status = String(mpData[m][4] || "").trim().toLowerCase();
      if (status === "aktif") {
        var pCat = String(mpData[m][1] || "").trim();
        var matchedCat = null;
        if (pCat.toLowerCase() === "minuman") matchedCat = "Minuman";
        else if (pCat.toLowerCase() === "makanan") matchedCat = "Makanan";
        else if (pCat.toLowerCase() === "snack") matchedCat = "Snack";
        
        if (matchedCat && realProduk[matchedCat]) {
          realProduk[matchedCat].push(String(mpData[m][2] || "").trim());
        }
      }
    }
  }

  var minggu = [], bulan = [], evStaf = [];
  var outlets = ["Perintis", "Dg Tata"];
  var spvs = ["Nathan", "Sela"];
  var periods = ["07-2026", "08-2026", "09-2026"];
  
  // Bulanan
  for (var p = 0; p < periods.length; p++) {
    var pd = periods[p];
    for (var o = 0; o < outlets.length; o++) {
      var outlet = outlets[o];
      var spv = spvs[o];
      var idBulan = pd + "-" + outlet.replace(/\s+/g, "_");
      
      var targetSales = outlet === "Perintis" ? 180000000 : 160000000;
      var actualSales = outlet === "Perintis" ? 195000000 : 140000000;
      var persen = Math.round((actualSales/targetSales)*100);
      var rating = persen >= 100 ? 95 : 75;
      var telat = outlet === "Perintis" ? 2 : 15;
      var teguran = outlet === "Perintis" ? 0 : 3;
      var tantangan = outlet === "Perintis" ? "Mempertahankan omset" : "Mesin sering rusak, SDM telat";
      var biayaEkstra = outlet === "Perintis" ? 0 : 1500000;
      var turnoverDummy = outlet === "Perintis" ? 0 : 1;
      var strategiDummy = outlet === "Perintis" ? "Tingkatkan promosi" : "Perbaikan alat & rekrutmen";
      var kebutuhanGMDummy = outlet === "Perintis" ? "-" : "Approval budget teknisi";
      
      bulan.push([idBulan, pd, outlet, spv, actualSales, targetSales, persen, rating, rating, telat, "Sesuai Target", tantangan, biayaEkstra, turnoverDummy, strategiDummy, kebutuhanGMDummy, "-"]);
      
      // Evaluasi Staf Bulanan
      if (outlet === "Perintis") {
        evStaf.push([idBulan, "Eko", "Barista", "Perintis", "A", "Kinerja bagus"]);
      } else {
        evStaf.push([idBulan, "Budi", "Barista", "Dg Tata", "C", "SP1 karena sering telat"]);
      }
    }
  }
  
  // Bulanan: Tambahkan Saran Produk dari SPV ke DB_Kinerja_Produk
  var kpSheet = ss.getSheetByName("DB_Kinerja_Produk");
  for (var p = 0; p < periods.length; p++) {
    for (var o = 0; o < outlets.length; o++) {
      var idBulan = periods[p] + "-" + outlets[o].replace(/\s+/g, "_");
      // Helper function to shuffle and pick unique items for monthly suggestions
      function getUniqueRandomItems(arr, count, fallbackPrefix) {
        var shuffled = arr.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = shuffled[i];
          shuffled[i] = shuffled[j];
          shuffled[j] = temp;
        }
        var result = [];
        for (var k = 0; k < count; k++) {
          if (k < shuffled.length) {
            result.push(shuffled[k]);
          } else {
            result.push(fallbackPrefix + " " + (k + 1));
          }
        }
        return result;
      }

      var categories = ["Minuman", "Makanan", "Snack"];
      categories.forEach(function(cat) {
        var available = realProduk[cat] && realProduk[cat].length > 0 ? realProduk[cat] : [];
        var chosen = getUniqueRandomItems(available, 8, cat + " Default");
        
        for (var i = 0; i < 5; i++) {
          kpSheet.appendRow([idBulan, cat, "Top", chosen[i], 0, ""]);
        }
        for (var j = 5; j < 8; j++) {
          kpSheet.appendRow([idBulan, cat, "Bottom", chosen[j], 0, "Saran Laporan Bulanan: Diskon 50% atau hapus menu"]);
        }
      });
    }
  }

  // Mingguan (Ambil sample week 1 per bulan)
  for (var p = 0; p < periods.length; p++) {
    var pd = periods[p];
    for (var o = 0; o < outlets.length; o++) {
      var outlet = outlets[o];
      var spv = spvs[o];
      var idMinggu = "W1_" + pd + "-" + outlet.replace(/\s+/g, "_");
      minggu.push([idMinggu, "W1 " + pd, outlet, spv, 45000000, 40000000, outlet==="Perintis"?0:3, "-"]);
      
      if (outlet === "Perintis") {
        evStaf.push([idMinggu, "Eko", "Barista", "Perintis", "A", "Disiplin"]);
      } else {
        evStaf.push([idMinggu, "Budi", "Barista", "Dg Tata", "C", "Sering bolos"]);
      }
    }
  }

  writeArrayToSheet(ss, "DB_Laporan_Mingguan", minggu);
  writeArrayToSheet(ss, "DB_Laporan_Bulanan", bulan);
  writeArrayToSheet(ss, "DB_Evaluasi_Staf", evStaf);
}

function writeArrayToSheet(ss, sheetName, dataArray) {
  var sheet = ss.getSheetByName(sheetName);
  if (sheet && dataArray.length > 0) {
    if (sheet.getLastRow() > 1) {
      // Clear exactly as many columns as we have in the new data to prevent errors
      sheet.getRange(2, 1, sheet.getLastRow() - 1, Math.max(sheet.getLastColumn(), dataArray[0].length)).clearContent();
    }
    sheet.getRange(2, 1, dataArray.length, dataArray[0].length).setValues(dataArray);
  }
}
