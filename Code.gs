/**
 * Zero Cafe Workspace v2.0 - Backend Code
 * Platform: Google Apps Script
 */

/**
 * Serves the HTML frontend interface.
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  template.scriptUrl = ScriptApp.getService().getUrl();
  return template
    .evaluate()
    .setTitle('Zero Cafe Workspace')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui')
    .addMetaTag('apple-mobile-web-app-capable', 'yes')
    .addMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent')
    .addMetaTag('mobile-web-app-capable', 'yes')
    .addMetaTag('theme-color', '#1a1a1a')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper function to include HTML partials inside index.html.
 */
function include(filename) {
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (err) {
    return `<script>alert("Error including ${filename}: " + ${JSON.stringify(err.toString())});</script>`;
  }
}


/**
 * Initializes the entire spreadsheet structure, headers, and Drive folders.
 * Can be run from the Apps Script editor to auto-setup the project.
 */
function initializeSystem() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var ssId = activeSpreadsheet.getId();
  
  // Set up Sheets
  setupSheet(activeSpreadsheet, "Daily", [
    "Tanggal", "Supervisor", "Outlet", "Shift", "Total Omset", "Komplain", "Kendala", "URL PDF"
  ]);
  
  setupSheet(activeSpreadsheet, "Weekly", [
    "Periode", "Supervisor", "Outlet", "Total Real Sales", "(Reserved)", "Komplain", "Kendala Utama", "URL PDF"
  ]);
  
  setupSheet(activeSpreadsheet, "Monthly", [
    "Bulan", "Supervisor", "Outlet", "Total Sales", "Target Sales", "Persen Tercapai", "Rating Kerja", "URL PDF"
  ]);
  
  var staffSheet = setupSheet(activeSpreadsheet, "MasterStaff", [
    "ID", "Nama", "Posisi", "Status"
  ]);
  
  // Populate default staff if empty
  if (staffSheet.getLastRow() <= 1) {
    var defaultStaff = [
      [1, "Amel", "Barista", "Aktif"],
      [2, "Irma", "Waitres", "Aktif"],
      [3, "Fitri", "Kitchen", "Aktif"],
      [4, "Syarif", "Barista", "Aktif"],
      [5, "Reni", "Kitchen", "Aktif"],
      [6, "Gita", "Barista", "Aktif"]
    ];
    staffSheet.getRange(2, 1, defaultStaff.length, 4).setValues(defaultStaff);
  }
  
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("SPREADSHEET_ID", ssId);
  
  // Set up root folder in Drive
  var rootFolderId = scriptProperties.getProperty("ROOT_FOLDER_ID");
  var rootFolder;
  if (rootFolderId) {
    try {
      rootFolder = DriveApp.getFolderById(rootFolderId);
    } catch(e) {
      rootFolderId = null;
    }
  }
  
  if (!rootFolderId) {
    var folderName = "Zero Cafe Workspace Drive";
    var folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      rootFolder = folders.next();
    } else {
      rootFolder = DriveApp.createFolder(folderName);
    }
    scriptProperties.setProperty("ROOT_FOLDER_ID", rootFolder.getId());
  }
  
  return {
    status: "success",
    spreadsheetId: ssId,
    rootFolderId: rootFolder.getId(),
    message: "Inisialisasi sistem berhasil! Struktur spreadsheet dan folder Drive telah disiapkan."
  };
}

/**
 * Helper to ensure a sheet exists and has correct headers.
 */
function setupSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  return sheet;
}

/**
 * Retrieves the spreadsheet instance using stored properties.
 */
function getSpreadsheet() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var ssId = scriptProperties.getProperty("SPREADSHEET_ID");
  if (!ssId) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
  return SpreadsheetApp.openById(ssId);
}

/**
 * Fetches the master list of active staff.
 */
function api_getMasterStaff() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("MasterStaff");
    if (!sheet) return [];
    
    var data = sheet.getDataRange().getValues();
    var staffList = [];
    
    // Skip headers
    for (var i = 1; i < data.length; i++) {
      var status = data[i][3];
      if (status === "Aktif") {
        staffList.push({
          id: data[i][0],
          nama: data[i][1],
          posisi: data[i][2]
        });
      }
    }
    return staffList;
  } catch (err) {
    Logger.log("Error in api_getMasterStaff: " + err.toString());
    return [];
  }
}

/**
 * Adds a new staff member to the MasterStaff tab.
 */
function api_addStaff(nama, posisi) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("MasterStaff");
    if (!sheet) throw new Error("Tab MasterStaff tidak ditemukan.");
    
    var lastRow = sheet.getLastRow();
    var nextId = 1;
    if (lastRow > 1) {
      nextId = Number(sheet.getRange(lastRow, 1).getValue()) + 1;
    }
    
    sheet.appendRow([nextId, nama, posisi, "Aktif"]);
    return { success: true, message: "Staff baru berhasil ditambahkan." };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Helper to get or create folder structure in Drive: Root -> Year -> Month -> Category
 */
function getStructuredFolder(year, monthName, category) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var rootFolderId = scriptProperties.getProperty("ROOT_FOLDER_ID");
  var rootFolder;
  
  if (rootFolderId) {
    try {
      rootFolder = DriveApp.getFolderById(rootFolderId);
    } catch(e) {
      rootFolderId = null;
    }
  }
  
  if (!rootFolderId) {
    var folders = DriveApp.getFoldersByName("Zero Cafe Workspace Drive");
    if (folders.hasNext()) {
      rootFolder = folders.next();
    } else {
      rootFolder = DriveApp.createFolder("Zero Cafe Workspace Drive");
    }
    scriptProperties.setProperty("ROOT_FOLDER_ID", rootFolder.getId());
  }
  
  var yearFolder = getOrCreateSubFolder(rootFolder, year);
  var monthFolder = getOrCreateSubFolder(yearFolder, monthName);
  var categoryFolder = getOrCreateSubFolder(monthFolder, category);
  
  return categoryFolder;
}

/**
 * Creates dynamic folder hierarchy based on report type.
 */
function getDynamicFolder(year, monthName, data) {
  var rootFolderId = "1cpwnFb5lh4OVJxbFpezBA48iLEglSZyj";
  var rootFolder;
  
  try {
    rootFolder = DriveApp.getFolderById(rootFolderId);
  } catch(e) {
    Logger.log("Folder root tidak ditemukan");
    return null;
  }
  
  var yearFolder = getOrCreateSubFolder(rootFolder, year);
  var monthFolder = getOrCreateSubFolder(yearFolder, monthName);
  
  if (data.type === "daily") {
    // Daily report goes directly into month folder: Root > 2026 > Juli
    return monthFolder;
  } else if (data.type === "weekly") {
    // Mingguan folder: "1-7 juli Laporan mingguan"
    var periodeStr = data.periode || (data.periodeStart + "-" + data.periodeEnd) || "1-7";
    var periodeClean = periodeStr.replace(/\s+/g, '');
    var folderName = periodeClean + " " + monthName.toLowerCase() + " Laporan mingguan";
    return getOrCreateSubFolder(monthFolder, folderName);
  } else if (data.type === "monthly") {
    // Bulanan folder: "Laporan Bulanan"
    return getOrCreateSubFolder(monthFolder, "Laporan Bulanan");
  }
  
  return monthFolder;
}

function getOrCreateSubFolder(parentFolder, folderName) {
  var folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parentFolder.createFolder(folderName);
}

/**
 * Maps numeric month index or date string to Indonesian Month Name.
 */
function getIndonesianMonth(dateStr) {
  var date = new Date(dateStr);
  var months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return months[date.getMonth()];
}

/**
 * Submits a report, generates PDF, uploads to Drive, and appends to Sheets.
 */
function submitFullReport(payloadStr) {
  try {
    var data = JSON.parse(payloadStr);
    var ss = getSpreadsheet();
    
    var year, monthName, dateFormatted, supervisor, outlet, pdfCategory;
    var fileName = "";
    var dd, mm, yyyy;
    
    if (data.type === "daily") {
      dateFormatted = data.tanggal; // YYYY-MM-DD
      var dateParts = dateFormatted.split("-");
      yyyy = dateParts[0];
      mm = dateParts[1];
      dd = dateParts[2];
      year = yyyy;
      monthName = getIndonesianMonth(dateFormatted);
      supervisor = data.supervisor;
      outlet = (data.outlet || "Perintis").replace(/\s+/g, "_");
      
      // Filename: 01-juli-laporan harian.PDF
      fileName = dd + "-" + monthName.toLowerCase() + "-laporan harian.pdf";
      
      // Update spreadsheet format to DD-MM-YYYY
      data.tanggal = dd + "-" + mm + "-" + yyyy;
      
    } else if (data.type === "weekly") {
      var periodeStr = data.periode || (data.periodeStart + "-" + data.periodeEnd) || "1-7";
      // Ensure no spaces in periode for filename
      var periodeClean = periodeStr.replace(/\s+/g, '');
      
      // Extract year and month from the end date if possible, else current
      var parts = (data.periodeEnd || data.periode || "").split("-");
      if (parts.length >= 3) {
        year = parts[0];
        monthName = getIndonesianMonth(data.periodeEnd);
      } else {
        year = new Date().getFullYear().toString();
        monthName = getIndonesianMonth(new Date());
      }
      supervisor = data.supervisor;
      outlet = (data.outlet || "Perintis").replace(/\s+/g, "_");
      
      // Filename: 1-7-juli-laporan-mingguan.PDF
      fileName = periodeClean + "-" + monthName.toLowerCase() + "-laporan-mingguan.pdf";
      
    } else if (data.type === "monthly") {
      var parts = (data.bulan || "").split("-");
      year = parts[0] || new Date().getFullYear().toString();
      monthName = getIndonesianMonth((data.bulan || "") + "-01");
      supervisor = data.supervisor;
      outlet = (data.outlet || "Perintis").replace(/\s+/g, "_");
      
      // Filename: Juli-laporan-bulanan.PDF
      fileName = monthName + "-laporan-bulanan.pdf";
    }
    
    // 1. Generate PDF blob
    var pdfBlob = null;
    if (data.pdfBase64) {
      try {
        var decoded = Utilities.base64Decode(data.pdfBase64);
        pdfBlob = Utilities.newBlob(decoded, "application/pdf", fileName);
      } catch (e) {
        Logger.log("Failed to decode base64: " + e.toString());
      }
    }
    
    if (!pdfBlob) {
      // Fallback to GAS simple HTML to PDF if client failed or base64 decode failed
      var htmlContent = generateHtmlReport(data);
      var htmlOutput = HtmlService.createHtmlOutput(htmlContent);
      pdfBlob = htmlOutput.getAs("application/pdf").setName(fileName);
    }
    
    // 2. Save to Google Drive folder
    var folder = getDynamicFolder(year, monthName, data);
    var file = folder.createFile(pdfBlob);
    var fileUrl = file.getUrl();
    
    // 4. Append row to corresponding Sheet tab
    if (data.type === "daily") {
      var sheet = ss.getSheetByName("Daily");
      sheet.appendRow([
        data.tanggal,
        data.supervisor,
        data.outlet,
        data.shift,
        Number(data.penjualan.shift1 || 0) + Number(data.penjualan.shift2 || 0),
        Number(data.feedback.totalKomplain || 0),
        data.penutup.kendala || "",
        fileUrl
      ]);
    } else if (data.type === "weekly") {
      var sheet = ss.getSheetByName("Weekly");
      var totalRealSales = 0;
      if (data.weekly && data.weekly.salesHarian) {
        data.weekly.salesHarian.forEach(function(s) {
          totalRealSales += Number(s.real || 0);
        });
      }
      sheet.appendRow([
        data.periode,
        data.supervisor,
        data.outlet,
        totalRealSales,
        0, // Reserved
        Number(data.weekly.komplain.total || 0),
        data.weekly.kendalaUtama || "",
        fileUrl
      ]);
    } else if (data.type === "monthly") {
      var sheet = ss.getSheetByName("Monthly");
      var bulanFormatted = data.bulan;
      if (bulanFormatted && bulanFormatted.indexOf("-") !== -1) {
        var p = bulanFormatted.split("-");
        bulanFormatted = p[1] + "-" + p[0]; // MM-YYYY
      }
      sheet.appendRow([
        bulanFormatted,
        data.supervisor,
        data.outlet,
        Number(data.monthly.sales.total || 0),
        Number(data.monthly.sales.target || 0),
        Number(data.monthly.sales.persen || 0),
        Number(data.monthly.evaluasi.ratingKerja || 0),
        fileUrl
      ]);
    }
    // We can just construct a more accurate path string or just use the folder's name.
    var folderPath = "";
    try {
      folderPath = folder.getName();
    } catch(e) {
      folderPath = year + " / " + monthName;
    }

    return { 
      success: true, 
      url: fileUrl,
      folderPath: folderPath
    };
  } catch (err) {
    Logger.log("Error in submitFullReport: " + err.toString());
    return { success: false, error: err.toString() };
  }
}

/**
 * Fetches dashboard analytics data for GM.
 */
function api_gm_fetchReports(monthName, year) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Daily");
    if (!sheet) throw new Error("Tab Daily tidak ditemukan.");
    
    var data = sheet.getDataRange().getValues();
    var omsetTotal = 0;
    var komplainTotal = 0;
    var listLaporan = [];
    var chartData = [];
    
    // Map month names to 2-digit format
    var monthsIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    var monthIdx = monthsIndo.indexOf(monthName);
    var monthPrefix = "";
    if (monthIdx !== -1) {
      monthPrefix = year + "-" + (monthIdx + 1 < 10 ? "0" : "") + (monthIdx + 1);
    }
    
    // Skip headers
    for (var i = 1; i < data.length; i++) {
      var rowDateObj = data[i][0];
      var rowDate = "";
      if (rowDateObj instanceof Date) {
        var m = rowDateObj.getMonth() + 1;
        var d = rowDateObj.getDate();
        rowDate = rowDateObj.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
      } else {
        rowDate = (rowDateObj || "").toString();
      }
      
      if (rowDate.startsWith(monthPrefix)) {
        var rowOmset = Number(data[i][4] || 0);
        omsetTotal += rowOmset;
        komplainTotal += Number(data[i][5] || 0);
        listLaporan.push({
          name: "Daily Report - " + rowDate + " (" + data[i][1] + ")",
          url: data[i][7],
          dateCreated: rowDate
        });
        chartData.push({
          date: rowDate,
          omset: rowOmset
        });
      }
    }
    
    // Also grab weekly and monthly reports for listing
    var weeklySheet = ss.getSheetByName("Weekly");
    if (weeklySheet) {
      var wData = weeklySheet.getDataRange().getValues();
      for (var i = 1; i < wData.length; i++) {
        var period = wData[i][0].toString();
        // If the period matches our target month
        if (period.indexOf(monthName) !== -1) {
          listLaporan.push({
            name: "Weekly Report - " + period + " (" + wData[i][1] + ")",
            url: wData[i][7],
            dateCreated: period
          });
        }
      }
    }
    
    var monthlySheet = ss.getSheetByName("Monthly");
    if (monthlySheet) {
      var mData = monthlySheet.getDataRange().getValues();
      for (var i = 1; i < mData.length; i++) {
        var bul = mData[i][0].toString(); // YYYY-MM
        if (bul === monthPrefix) {
          listLaporan.push({
            name: "Monthly Report - " + bul + " (" + mData[i][1] + ")",
            url: mData[i][7],
            dateCreated: bul
          });
        }
      }
    }
    
    // Calculate simulated transaction total
    var transaksiTotal = listLaporan.length * 45; // arbitrary placeholder simulation
    
    var currentFolderId = PropertiesService.getScriptProperties().getProperty("ROOT_FOLDER_ID") || "";
    
    // Get target omset for the selected month
    var targetOmsetKey = "TARGET_OMSET_" + monthName + "_" + year;
    var targetOmset = PropertiesService.getScriptProperties().getProperty(targetOmsetKey) || "0";
    
    var resultObj = {
      status: "success",
      data: {
        omsetTotal: omsetTotal || 0,
        transaksiTotal: transaksiTotal || 0,
        komplainTotal: komplainTotal || 0,
        listLaporan: listLaporan || [],
        currentFolderId: currentFolderId || "",
        targetOmset: Number(targetOmset) || 0,
        chartData: chartData.sort(function(a, b) { return a.date.localeCompare(b.date); }) || []
      }
    };
    return JSON.stringify(resultObj);
  } catch (err) {
    return JSON.stringify({ status: "error", error: err.toString() });
  }
}

/**
 * HTML Report Generator for PDF.
 */
function generateHtmlReport(data) {
  var html = `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; font-size: 11pt; color: #333; margin: 20px; }
      h1 { text-align: center; color: #1f2937; border-bottom: 2px solid #374151; padding-bottom: 10px; margin-bottom: 20px; }
      h2 { color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-top: 25px; margin-bottom: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
      th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
      th { backgroundColor: #f3f4f6; color: #111827; fontWeight: bold; }
      .meta-table td { border: none; padding: 4px; }
      .text-right { text-align: right; }
      .highlight { font-weight: bold; color: #1e3a8a; }
    </style>
  </head>
  <body>
  `;
  
  if (data.type === "daily") {
    html += `<h1>DAILY OPERATIONAL REPORT</h1>`;
    html += `<table class="meta-table">
      <tr><td><strong>Tanggal:</strong> ${data.tanggal}</td><td><strong>Supervisor:</strong> ${data.supervisor}</td></tr>
      <tr><td><strong>Outlet:</strong> ${data.outlet}</td><td><strong>Shift:</strong> ${data.shift}</td></tr>
    </table>`;
    
    html += `<h2>A. Penjualan & Transaksi</h2>`;
    var totalReal = Number(data.penjualan.shift1 || 0) + Number(data.penjualan.shift2 || 0);
    html += `<table>
      <tr><th>Shift 1</th><th>Shift 2</th><th>Total Realisasi</th><th>Target Harian</th><th>Total Transaksi</th></tr>
      <tr>
        <td>Rp ${Number(data.penjualan.shift1 || 0).toLocaleString('id-ID')}</td>
        <td>Rp ${Number(data.penjualan.shift2 || 0).toLocaleString('id-ID')}</td>
        <td class="highlight">Rp ${totalReal.toLocaleString('id-ID')}</td>
        <td>Rp ${Number(data.penjualan.target || 0).toLocaleString('id-ID')}</td>
        <td>${data.penjualan.transaksi || 0}</td>
      </tr>
    </table>`;
    
    html += `<h2>B. Penjualan Top Produk</h2>`;
    html += `<table>
      <tr><th>Kategori</th><th>Top 1</th><th>Top 2</th><th>Top 3</th></tr>
      <tr><td><strong>Makanan</strong></td><td>${data.produk.makanan[0] || '-'}</td><td>${data.produk.makanan[1] || '-'}</td><td>${data.produk.makanan[2] || '-'}</td></tr>
      <tr><td><strong>Minuman</strong></td><td>${data.produk.minuman[0] || '-'}</td><td>${data.produk.minuman[1] || '-'}</td><td>${data.produk.minuman[2] || '-'}</td></tr>
    </table>`;
    
    html += `<h2>C. Audit Kas Kasir</h2>`;
    html += `<p>Modal Awal: <strong>Rp ${Number(data.kas.modalAwal || 0).toLocaleString('id-ID')}</strong></p>`;
    html += `<table>
      <tr><th>Jam</th><th>Aktual</th><th>QRIS</th><th>Tunai</th><th>Keterangan</th></tr>`;
    if (data.kas.audit && data.kas.audit.length > 0) {
      data.kas.audit.forEach(function(row) {
        html += `<tr>
          <td>${row.jam || '-'}</td>
          <td>Rp ${Number(row.aktual || 0).toLocaleString('id-ID')}</td>
          <td>Rp ${Number(row.qris || 0).toLocaleString('id-ID')}</td>
          <td>Rp ${Number(row.tunai || 0).toLocaleString('id-ID')}</td>
          <td>${row.keterangan || '-'}</td>
        </tr>`;
      });
    } else {
      html += `<tr><td colspan="5" style="text-align:center;">Tidak ada audit kas.</td></tr>`;
    }
    html += `</table>`;
    
    html += `<h2>D. Absensi & Evaluasi Staff</h2>`;
    html += `<table>
      <tr><th>Nama Staff</th><th>Posisi</th><th>Status Kehadiran</th><th>Keramahan Terlewat</th><th>Keterangan</th></tr>`;
    if (data.staff && data.staff.length > 0) {
      data.staff.forEach(function(row) {
        html += `<tr>
          <td>${row.nama || '-'}</td>
          <td>${row.posisi || '-'}</td>
          <td>${row.status || '-'}</td>
          <td>${row.keramahan ? 'Ya' : 'Tidak'}</td>
          <td>${row.keterangan || '-'}</td>
        </tr>`;
      });
    } else {
      html += `<tr><td colspan="5" style="text-align:center;">Tidak ada data staff.</td></tr>`;
    }
    html += `</table>`;
    
    html += `<h2>E. Briefing Shift</h2>`;
    html += `<p><strong>Evaluasi Kemarin:</strong><br/>${data.briefing.evaluasi || '-'}</p>`;
    html += `<p><strong>Fokus Hari Ini:</strong><br/>${data.briefing.fokus || '-'}</p>`;
    
    html += `<h2>F. Quality Control (QC)</h2>`;
    html += `<p><strong>Espresso QC:</strong> ${data.qc.espresso.status || 'Belum Diperiksa'} (${data.qc.espresso.jam || '-'}) - <em>${data.qc.espresso.keterangan || '-'}</em></p>`;
    html += `<table>
      <tr><th>Jam</th><th>Nama Item</th><th>Status</th><th>Keterangan</th></tr>`;
    if (data.qc.items && data.qc.items.length > 0) {
      data.qc.items.forEach(function(row) {
        html += `<tr>
          <td>${row.jam || '-'}</td>
          <td>${row.nama || '-'}</td>
          <td>${row.status || '-'}</td>
          <td>${row.keterangan || '-'}</td>
        </tr>`;
      });
    } else {
      html += `<tr><td colspan="4" style="text-align:center;">Tidak ada item QC tambahan.</td></tr>`;
    }
    html += `</table>`;
    
    html += `<h2>G. Komplain & Feedback Pelanggan</h2>`;
    html += `<p>Total Komplain: <strong>${data.feedback.totalKomplain || 0}</strong> | Total Remake: <strong>${data.feedback.totalRemake || 0}</strong></p>`;
    if (Number(data.feedback.totalRemake || 0) >= 3) {
      html += `<p><strong>Analisis Penyebab Remake:</strong><br/>${data.feedback.analisisRemake || '-'}</p>`;
    }
    html += `<table>
      <tr><th>Jam</th><th>Inisial</th><th>Keluhan</th><th>Remake?</th><th>Eskalasi GM?</th><th>Respon</th></tr>`;
    if (data.feedback.items && data.feedback.items.length > 0) {
      data.feedback.items.forEach(function(row) {
        html += `<tr>
          <td>${row.jam || '-'}</td>
          <td>${row.inisial || '-'}</td>
          <td>${row.isi || '-'}</td>
          <td>${row.remake ? 'Ya' : 'Tidak'}</td>
          <td>${row.eskalasi ? 'Ya' : 'Tidak'}</td>
          <td>${row.respon || '-'}</td>
        </tr>`;
      });
    } else {
      html += `<tr><td colspan="6" style="text-align:center;">Tidak ada insiden komplain.</td></tr>`;
    }
    html += `</table>`;
    
    html += `<h2>H. Fasilitas & Bahan Penunjang</h2>`;
    html += `<h3>Kondisi Fasilitas</h3>`;
    html += `<table>
      <tr><th>Fasilitas</th><th>Status</th><th>Eskalasi</th><th>Keterangan</th></tr>`;
    if (data.fasilitas && data.fasilitas.length > 0) {
      data.fasilitas.forEach(function(row) {
        html += `<tr>
          <td>${row.item || '-'}</td>
          <td>${row.status || '-'}</td>
          <td>${row.eskalasi ? 'Ya' : 'Tidak'}</td>
          <td>${row.keterangan || '-'}</td>
        </tr>`;
      });
    } else {
      html += `<tr><td colspan="4" style="text-align:center;">Semua fasilitas dalam kondisi baik.</td></tr>`;
    }
    html += `</table>`;
    
    html += `<h3>Bahan Penunjang</h3>`;
    html += `<table>
      <tr><th>Bahan</th><th>Ketersediaan</th><th>Harga Satuan</th></tr>`;
    if (data.bahan && data.bahan.length > 0) {
      data.bahan.forEach(function(row) {
        html += `<tr>
          <td>${row.nama || '-'}</td>
          <td>${row.ketersediaan || '-'}</td>
          <td>Rp ${Number(row.harga || 0).toLocaleString('id-ID')}</td>
        </tr>`;
      });
    } else {
      html += `<tr><td colspan="3" style="text-align:center;">Tidak ada bahan dilaporkan.</td></tr>`;
    }
    html += `</table>`;
    
    html += `<h2>I. Penutup</h2>`;
    html += `<p><strong>Kendala Utama:</strong><br/>${data.penutup.kendala || '-'}</p>`;
    html += `<p><strong>Rekomendasi Besok:</strong><br/>${data.penutup.rekomendasi || '-'}</p>`;
    
  } else if (data.type === "weekly") {
    html += `<h1>WEEKLY PERFORMANCE REPORT</h1>`;
    html += `<table class="meta-table">
      <tr><td><strong>Periode:</strong> ${data.periode}</td><td><strong>Supervisor:</strong> ${data.supervisor}</td></tr>
      <tr><td><strong>Outlet:</strong> ${data.outlet}</td></tr>
    </table>`;
    
    html += `<h2>A. Rekap Sales Harian</h2>`;
    html += `<table>
      <tr><th>Hari</th><th>Target</th><th>Realisasi</th></tr>`;
    if (data.weekly.salesHarian && data.weekly.salesHarian.length > 0) {
      data.weekly.salesHarian.forEach(function(s) {
        html += `<tr>
          <td>${s.hari || '-'}</td>
          <td>Rp ${Number(s.target || 0).toLocaleString('id-ID')}</td>
          <td>Rp ${Number(s.real || 0).toLocaleString('id-ID')}</td>
        </tr>`;
      });
    }
    html += `</table>`;
    
    html += `<h2>B. Evaluasi Produk</h2>`;
    html += `<h3>Top Produk</h3>`;
    html += `<p><strong>Makanan:</strong> ${data.weekly.produk.topMakanan.join(", ") || '-'}</p>`;
    html += `<p><strong>Minuman:</strong> ${data.weekly.produk.topMinuman.join(", ") || '-'}</p>`;
    
    html += `<h3>Bottom Produk (Perlu Tindakan)</h3>`;
    html += `<table><tr><th>Makanan</th><th>Tindakan</th></tr>`;
    if (data.weekly.produk.bottomMakanan && data.weekly.produk.bottomMakanan.length > 0) {
      data.weekly.produk.bottomMakanan.forEach(function(item) {
        html += `<tr><td>${item.nama || '-'}</td><td>${item.tindakan || '-'}</td></tr>`;
      });
    }
    html += `</table>`;
    html += `<table><tr><th>Minuman</th><th>Tindakan</th></tr>`;
    if (data.weekly.produk.bottomMinuman && data.weekly.produk.bottomMinuman.length > 0) {
      data.weekly.produk.bottomMinuman.forEach(function(item) {
        html += `<tr><td>${item.nama || '-'}</td><td>${item.tindakan || '-'}</td></tr>`;
      });
    }
    html += `</table>`;
    
    html += `<h2>C. Komplain & Kendala</h2>`;
    html += `<p>Total Komplain: <strong>${data.weekly.komplain.total || 0}</strong> | Total Remake: <strong>${data.weekly.komplain.remake || 0}</strong></p>`;
    html += `<p><strong>Penyebab Utama:</strong> ${data.weekly.komplain.penyebab || '-'}</p>`;
    html += `<p><strong>Kendala Utama Berulang:</strong><br/>${data.weekly.kendalaUtama || '-'}</p>`;
    
    html += `<h2>D. Performa & Evaluasi Staf</h2>`;
    html += `<table>
      <tr><th>Nama</th><th>Posisi</th><th>Status Performa</th><th>Alasan</th></tr>`;
    if (data.weekly.staff && data.weekly.staff.length > 0) {
      data.weekly.staff.forEach(function(s) {
        html += `<tr>
          <td>${s.nama || '-'}</td>
          <td>${s.posisi || '-'}</td>
          <td>${s.status || '-'}</td>
          <td>${s.alasan || '-'}</td>
        </tr>`;
      });
    }
    html += `</table>`;
    
    html += `<h2>E. Rencana Tindakan & Kebutuhan</h2>`;
    html += `<h3>Rencana Perbaikan:</h3>`;
    html += `<ol>`;
    if (data.weekly.rencana && data.weekly.rencana.length > 0) {
      data.weekly.rencana.forEach(function(r) { if(r) html += `<li>${r}</li>`; });
    }
    html += `</ol>`;
    html += `<h3>Kebutuhan SPV:</h3>`;
    html += `<ol>`;
    if (data.weekly.kebutuhan && data.weekly.kebutuhan.length > 0) {
      data.weekly.kebutuhan.forEach(function(k) { if(k) html += `<li>${k}</li>`; });
    }
    html += `</ol>`;
    
  } else if (data.type === "monthly") {
    html += `<h1>MONTHLY EXECUTIVE REPORT</h1>`;
    html += `<table class="meta-table">
      <tr><td><strong>Bulan:</strong> ${data.bulan}</td><td><strong>Supervisor:</strong> ${data.supervisor}</td></tr>
      <tr><td><strong>Outlet:</strong> ${data.outlet}</td></tr>
    </table>`;
    
    html += `<h2>A. Ringkasan Eksekutif</h2>`;
    html += `<p><strong>Pencapaian Utama:</strong><br/>${data.monthly.ringkasan.pencapaian || '-'}</p>`;
    html += `<p><strong>Masalah Utama:</strong><br/>${data.monthly.ringkasan.masalah || '-'}</p>`;
    html += `<p><strong>Kesimpulan:</strong><br/>${data.monthly.ringkasan.kesimpulan || '-'}</p>`;
    
    html += `<h2>B. Metrik Penjualan</h2>`;
    html += `<table>
      <tr><th>Total Sales</th><th>Target Sales</th><th>Pencapaian %</th></tr>
      <tr>
        <td class="highlight">Rp ${Number(data.monthly.sales.total || 0).toLocaleString('id-ID')}</td>
        <td>Rp ${Number(data.monthly.sales.target || 0).toLocaleString('id-ID')}</td>
        <td>${data.monthly.sales.persen || 0}%</td>
      </tr>
    </table>`;
    
    html += `<h2>C. Evaluasi Produk</h2>`;
    html += `<h3>Top Produk (Paling Laku)</h3>`;
    html += `<table><tr><th>Makanan</th><th>Terjual</th></tr>`;
    if (data.monthly.produk.topMakanan && data.monthly.produk.topMakanan.length > 0) {
      data.monthly.produk.topMakanan.forEach(function(item) {
        html += `<tr><td>${item.nama || '-'}</td><td>${item.terjual || 0}</td></tr>`;
      });
    }
    html += `</table>`;
    html += `<table><tr><th>Minuman</th><th>Terjual</th></tr>`;
    if (data.monthly.produk.topMinuman && data.monthly.produk.topMinuman.length > 0) {
      data.monthly.produk.topMinuman.forEach(function(item) {
        html += `<tr><td>${item.nama || '-'}</td><td>${item.terjual || 0}</td></tr>`;
      });
    }
    html += `</table>`;
    
    html += `<h3>Bottom Produk (Kurang Laku)</h3>`;
    html += `<table><tr><th>Makanan</th><th>Terjual</th><th>Rencana Tindakan</th></tr>`;
    if (data.monthly.produk.bottomMakanan && data.monthly.produk.bottomMakanan.length > 0) {
      data.monthly.produk.bottomMakanan.forEach(function(item) {
        html += `<tr><td>${item.nama || '-'}</td><td>${item.terjual || 0}</td><td>${item.rencana || '-'}</td></tr>`;
      });
    }
    html += `</table>`;
    html += `<table><tr><th>Minuman</th><th>Terjual</th><th>Rencana Tindakan</th></tr>`;
    if (data.monthly.produk.bottomMinuman && data.monthly.produk.bottomMinuman.length > 0) {
      data.monthly.produk.bottomMinuman.forEach(function(item) {
        html += `<tr><td>${item.nama || '-'}</td><td>${item.terjual || 0}</td><td>${item.rencana || '-'}</td></tr>`;
      });
    }
    html += `</table>`;
    
    html += `<h2>D. Staff & QC (Operasional)</h2>`;
    html += `<p>Kepatuhan SOP: <strong>${data.monthly.operasional.kepatuhanSop || 0}%</strong></p>`;
    html += `<p>Staff Terlambat: <strong>${data.monthly.operasional.telat || 0} kali</strong></p>`;
    html += `<p>Surat Teguran: <strong>${data.monthly.operasional.teguran || 0} kali</strong></p>`;
    html += `<p><strong>Penyebab Utama Masalah Staff:</strong> ${data.monthly.operasional.penyebab || '-'}</p>`;
    
    html += `<h3>Evaluasi Performa Staf</h3>`;
    html += `<table>
      <tr><th>Nama</th><th>Posisi</th><th>Status Performa</th><th>Catatan</th></tr>`;
    if (data.monthly.staff && data.monthly.staff.length > 0) {
      data.monthly.staff.forEach(function(s) {
        html += `<tr>
          <td>${s.nama || '-'}</td>
          <td>${s.posisi || '-'}</td>
          <td>${s.status || '-'}</td>
          <td>${s.alasan || '-'}</td>
        </tr>`;
      });
    }
    html += `</table>`;
    
    html += `<h2>E. Quality Control & Komplain</h2>`;
    html += `<p>Total Komplain: <strong>${data.monthly.qc.komplain || 0}</strong> | Total Remake: <strong>${data.monthly.qc.remake || 0}</strong></p>`;
    html += `<p><strong>Evaluasi QC Espresso:</strong><br/>${data.monthly.qc.espresso || '-'}</p>`;
    html += `<p><strong>Penyebab Utama Komplain/Remake:</strong> ${data.monthly.qc.penyebab || '-'}</p>`;
    html += `<p><strong>Rekomendasi QC:</strong> ${data.monthly.qc.rekomendasi || '-'}</p>`;
    
    html += `<h2>F. Fasilitas & Rencana Strategis</h2>`;
    html += `<p><strong>Pengeluaran Perbaikan Fasilitas:</strong> Rp ${Number(data.monthly.fasilitas.pengeluaran || 0).toLocaleString('id-ID')}</p>`;
    html += `<p><strong>Eskalasi Kerusakan Utama:</strong> ${data.monthly.fasilitas.eskalasi || '-'}</p>`;
    html += `<p><strong>Strategi Bulan Depan:</strong><br/>${data.monthly.rencana.strategi || '-'}</p>`;
    html += `<p><strong>Kebutuhan Supervisor:</strong><br/>${data.monthly.rencana.gm || '-'}</p>`;
    
    html += `<h2>G. Evaluasi Mandiri Supervisor</h2>`;
    html += `<p><strong>Apa yang berhasil dikembangkan:</strong> ${data.monthly.evaluasi.berhasil || '-'}</p>`;
    html += `<p><strong>Apa yang sulit dihadapi:</strong> ${data.monthly.evaluasi.sulit || '-'}</p>`;
    html += `<p><strong>Skill yang perlu ditingkatkan:</strong> ${data.monthly.evaluasi.skill || '-'}</p>`;
    html += `<p class="highlight">Rating Kinerja Pribadi: ${data.monthly.evaluasi.ratingKerja || 0} / 10</p>`;
  }
  
  html += `</body></html>`;
  return html;
}

/**
 * Uploads a base64 encoded image to Google Drive and returns its URL.
 */
function api_uploadImage(base64Data, filename, category) {
  try {
    var date = new Date();
    var year = date.getFullYear().toString();
    var monthName = getIndonesianMonth(date.toISOString().split('T')[0]);
    
    // Get or create category folder inside month folder
    var rootFolderId = "1cpwnFb5lh4OVJxbFpezBA48iLEglSZyj";
    var rootFolder;
    
    try {
      rootFolder = DriveApp.getFolderById(rootFolderId);
    } catch (e) {
      Logger.log("Folder root tidak ditemukan");
      return { success: false, error: "Root folder not found" };
    }
    
    var yearFolder = getOrCreateSubFolder(rootFolder, year);
    var monthFolder = getOrCreateSubFolder(yearFolder, monthName);
    var categoryFolder = getOrCreateSubFolder(monthFolder, category || "Lain-lain");
    
    // Remove base64 prefix if exists (e.g., "data:image/jpeg;base64,")
    var cleanBase64 = base64Data;
    if (cleanBase64.indexOf(",") !== -1) {
      cleanBase64 = cleanBase64.split(",")[1];
    }
    
    var blob = Utilities.newBlob(Utilities.base64Decode(cleanBase64), "image/jpeg", filename);
    var file = categoryFolder.createFile(blob);
    
    return {
      success: true,
      url: file.getUrl(),
      id: file.getId()
    };
  } catch (error) {
    Logger.log("Error uploading image: " + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Updates the ROOT_FOLDER_ID dynamically via the UI
 */
function api_gm_updateFolderId(newId) {
  if (!newId || newId.trim() === "") {
    return { success: false, error: "ID Folder tidak boleh kosong." };
  }
  
  try {
    var folder = DriveApp.getFolderById(newId.trim());
    var folderName = folder.getName(); // test access
    
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty("ROOT_FOLDER_ID", newId.trim());
    
    return { success: true, folderName: folderName };
  } catch (err) {
    return { success: false, error: "ID Folder tidak valid atau Anda tidak memiliki akses ke folder tersebut." };
  }
}

/**
 * =========================================================================
 * KONFIGURASI FOLDER GOOGLE DRIVE KHUSUS UNTUK GM
 * =========================================================================
 * 
 * JALANKAN FUNGSI DI BAWAH INI JIKA ANDA INGIN MENGUBAH FOLDER PENYIMPANAN PDF.
 * Cukup ganti "PASTE_ID_FOLDER_BARU_DISINI" dengan ID folder yang baru, lalu
 * jalankan fungsi ini dengan menekan tombol "Run" (Jalankan) di atas.
 */
function JALANKAN_INI_UNTUK_UBAH_FOLDER() {
  // Ganti teks di dalam tanda kutip dengan ID Folder Google Drive Anda yang baru.
  // Pastikan ID-nya benar dan Anda memiliki akses ke folder tersebut.
  // Contoh ID: "1cpwnFb5lh4OVJxbFpezBA48iLEglSZyj"
  var idFolderBaru = "1cpwnFb5lh4OVJxbFpezBA48iLEglSZyj"; 
  
  try {
    // Tes apakah folder bisa diakses
    var folder = DriveApp.getFolderById(idFolderBaru);
    
    // Simpan ke Script Properties
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty("ROOT_FOLDER_ID", idFolderBaru);
    
    Logger.log("SUKSES: Target folder penyimpanan PDF berhasil diubah ke: " + folder.getName());
  } catch (e) {
    Logger.log("GAGAL: Error: " + e.toString());
  }
}

/**
 * =========================================================================
 * KONFIGURASI TARGET OMSET GM
 * =========================================================================
 */
function api_gm_setTargetOmset(monthName, year, targetValue) {
  try {
    var key = "TARGET_OMSET_" + monthName + "_" + year;
    var props = PropertiesService.getScriptProperties();
    props.setProperty(key, targetValue.toString());
    return { success: true };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

