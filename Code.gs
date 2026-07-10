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
    "Tanggal", "Supervisor", "Outlet", "Shift", "Total Omset", "Komplain", "Kendala", "URL PDF", "Target Omset", "Transaksi", "Status Laporan", "Cuaca"
  ]);
  
  setupSheet(activeSpreadsheet, "Weekly", [
    "Periode", "Supervisor", "Outlet", "Total Real Sales", "Total Target", "Komplain", "Kendala Utama", "URL PDF"
  ]);
  
  setupSheet(activeSpreadsheet, "Monthly", [
    "Bulan", "Supervisor", "Outlet", "Total Sales", "Target Sales", "Persen Tercapai", "Rating Kerja", "URL PDF",
    "Kepatuhan SOP", "Total Telat", "Teguran", "Kendala Utama", "Eskalasi Fasilitas", "Strategi", "Kebutuhan GM",
    "Pencapaian", "Tantangan", "Skill", "Turnover Barista",
    "Ringkasan Masalah", "Kesimpulan", "QC Komplain", "QC Remake", "QC Espresso", "QC Rekomendasi", "Pengeluaran Fasilitas"
  ]);
  
  setupSheet(activeSpreadsheet, "Staff_Daily", [
    "Tanggal", "Bulan Laporan", "Outlet", "Supervisor", "Nama Staff", "Posisi", "Status Kehadiran", "Keramahan Terlewat", "Catatan Khusus"
  ]);

  setupSheet(activeSpreadsheet, "Staff_Weekly", [
    "Periode", "Bulan Laporan", "Outlet", "Supervisor", "Nama Staff", "Posisi", "Status Evaluasi", "Catatan/Alasan"
  ]);
  
  setupSheet(activeSpreadsheet, "Staff_Monthly", [
    "Bulan", "Outlet", "Supervisor", "Nama Staff", "Posisi", "Status Evaluasi", "Catatan/Alasan"
  ]);
  
  setupSheet(activeSpreadsheet, "Log_Audit_Kas", [
    "Tanggal", "Outlet", "Shift/Jam", "Total QRIS", "Total Tunai", "Aktual Sistem", "Selisih", "Keterangan"
  ]);
  
  setupSheet(activeSpreadsheet, "Log_QC", [
    "Tanggal", "Outlet", "Kategori", "Item/Menu", "Status", "Keterangan"
  ]);

  setupSheet(activeSpreadsheet, "Database_QC", [
    "Tanggal Laporan", "Jam Cek", "Outlet", "Shift", "Supervisor",
    "Produk Random", "Cek Rasa", "Suhu", "Visual", "Catatan",
    "Timestamp", "Action Taken"
  ]);

  // Daily Form data structure (Menambahkan Cuaca)
  setupSheet(activeSpreadsheet, "Daily", [
    "Tanggal Laporan", "Nama Supervisor", "Outlet", "Shift", "Omset Total", 
    "Komplain", "Kinerja Kritis", "Foto Rekap", "Target", "Transaksi", "Status", "Cuaca"
  ]);
  
  setupSheet(activeSpreadsheet, "Log_Fasilitas_Bahan", [
    "Tanggal", "Outlet", "Tipe", "Nama Item", "Status/Ketersediaan", "Biaya Estimasi", "URL Foto", "Eskalasi"
  ]);
  
  setupSheet(activeSpreadsheet, "Config_Target", [
    "Tahun", "Outlet", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]);
  
  setupSheet(activeSpreadsheet, "Config_Parameter", [
    "Outlet", "Kategori", "Nama Event", "Tanggal Mulai", "Tanggal Selesai", "Status"
  ]);
  
  var staffSheet = setupSheet(activeSpreadsheet, "MasterStaff", [
    "ID", "Nama", "Posisi", "Status", "Outlet"
  ]);
  
  // Populate default staff if empty
  if (staffSheet.getLastRow() <= 1) {
    var defaultStaff = [
      [1, "Amel", "Barista", "Aktif", "Perintis"],
      [2, "Irma", "Waitres", "Aktif", "Perintis"],
      [3, "Fitri", "Kitchen", "Aktif", "Perintis"],
      [4, "Syarif", "Barista", "Aktif", "Dg Tata"],
      [5, "Reni", "Kitchen", "Aktif", "Dg Tata"],
      [6, "Gita", "Barista", "Aktif", "Dg Tata"]
    ];
    staffSheet.getRange(2, 1, defaultStaff.length, 5).setValues(defaultStaff);
  }

  var menuSheet = setupSheet(activeSpreadsheet, "MasterMenu", [
    "Kategori", "Nama Menu"
  ]);
  
  // Populate default menu if empty
  if (menuSheet.getLastRow() <= 1) {
    var defaultMenu = [
      ["minuman", "Espresso"], ["minuman", "Americano"], ["minuman", "Kopi Susu Gula Aren"], ["minuman", "Kopi Susu Pandan"],
      ["minuman", "Cappuccino"], ["minuman", "Cafe Latte"], ["minuman", "Vanilla Latte"], ["minuman", "Matcha Latte"],
      ["minuman", "Red Velvet Latte"], ["minuman", "Chocolate"], ["minuman", "Taro Latte"], ["minuman", "Lemon Tea"], ["minuman", "Lychee Tea"],
      ["makanan", "Nasi Goreng Spesial"], ["makanan", "Nasi Goreng Seafood"], ["makanan", "Mie Goreng Jawa"], ["makanan", "Mie Kuah Spesial"],
      ["makanan", "Ricebowl Chicken Katsu"], ["makanan", "Ricebowl Chicken Teriyaki"], ["makanan", "Spaghetti Bolognese"], ["makanan", "Spaghetti Carbonara"],
      ["snack", "Kentang Goreng"], ["snack", "Roti Bakar Coklat"], ["snack", "Roti Bakar Keju"], ["snack", "Pisang Goreng Keju"],
      ["snack", "Dimsum"], ["snack", "Cireng Bumbu Rujak"], ["snack", "Tahu Walik"], ["snack", "Churros"]
    ];
    menuSheet.getRange(2, 1, defaultMenu.length, 2).setValues(defaultMenu);
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
 * Gets a specific sheet for an outlet. Creates a copy from the base template if missing.
 */
function getSheetForOutlet(ss, baseName, outlet) {
  var outletName = outlet || "Perintis"; // Default fallback
  var sheetName = baseName + "_" + outletName;
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    // Fallback: jika belum di-setup, gunakan base sheet untuk sementara agar tidak error
    var baseSheet = ss.getSheetByName(baseName);
    if (baseSheet) {
      sheet = ss.insertSheet(sheetName);
      // Copy headers from baseSheet
      var lastCol = baseSheet.getLastColumn();
      if (lastCol > 0) {
        var headers = baseSheet.getRange(1, 1, 1, lastCol).getValues();
        sheet.getRange(1, 1, 1, lastCol).setValues(headers);
        sheet.getRange(1, 1, 1, lastCol).setFontWeight("bold");
      }
    } else {
      // Jika baseSheet juga tidak ada (aneh), buat kosong
      sheet = ss.insertSheet(sheetName);
    }
  }
  return sheet;
}

/**
 * Gets all split sheets for a given base report (e.g. Daily_Perintis, Daily_Dg Tata).
 * If none found, returns the base sheet (e.g. Daily) as a fallback.
 */
function getAllOutletSheets(ss, baseName) {
  var sheets = ss.getSheets();
  var found = [];
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName();
    if (name.indexOf(baseName + "_") === 0) {
      found.push(sheets[i]);
    }
  }
  
  if (found.length === 0) {
    var baseSheet = ss.getSheetByName(baseName);
    if (baseSheet) found.push(baseSheet);
  }
  return found;
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
          posisi: data[i][2],
          outlet: data[i][4] || ""
        });
      }
    }
    return staffList;
  } catch (err) {
    Logger.log("Error in api_getMasterStaff: " + err.toString());
    return [];
  }
}

function api_getMasterMenu() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Database_Produk");
    if (!sheet) return { success: false, data: { minuman: [], makanan: [], snack: [] } };
    
    var data = sheet.getDataRange().getValues();
    var menuData = { minuman: [], makanan: [], snack: [] };
    
    for (var i = 1; i < data.length; i++) {
      var cat = (data[i][3] || "").toString().toLowerCase(); // Kategori is in Column D (index 3)
      var name = (data[i][5] || "").toString(); // Nama Produk is in Column F (index 5)
      
      if (cat && name) {
        if (!menuData[cat]) menuData[cat] = [];
        if (menuData[cat].indexOf(name) === -1) {
          menuData[cat].push(name);
        }
      }
    }
    
    // Sort alphabetically
    Object.keys(menuData).forEach(function(k) {
       menuData[k].sort();
    });
    
    return { success: true, data: menuData };
  } catch(err) {
    return { success: false, error: err.toString() };
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
  // [A3] Centralize: selalu baca ROOT_FOLDER_ID dari ScriptProperties
  var scriptProperties = PropertiesService.getScriptProperties();
  var rootFolderId = scriptProperties.getProperty("ROOT_FOLDER_ID");
  var rootFolder;
  
  if (!rootFolderId) {
    Logger.log("ROOT_FOLDER_ID belum diset. Menggunakan fallback ke 'Zero Cafe Database'.");
    rootFolder = getOrCreateSubFolder(DriveApp.getRootFolder(), "Zero Cafe Database");
    scriptProperties.setProperty("ROOT_FOLDER_ID", rootFolder.getId());
  } else {
    try {
      rootFolder = DriveApp.getFolderById(rootFolderId);
    } catch(e) {
      Logger.log("Folder root tidak ditemukan: " + e.toString() + ". Menggunakan fallback.");
      rootFolder = getOrCreateSubFolder(DriveApp.getRootFolder(), "Zero Cafe Database");
      scriptProperties.setProperty("ROOT_FOLDER_ID", rootFolder.getId());
    }
  }
  
  var yearFolder = getOrCreateSubFolder(rootFolder, year);
  var monthFolder = getOrCreateSubFolder(yearFolder, monthName);
  var outletFolder = getOrCreateSubFolder(monthFolder, data.outlet || "Perintis");
  
  if (data.type === "daily") {
    // Format folder struktur (Bulan/Outlet/Hari)
    var dateParts = (data.tanggal || "").split("-");
    var day = dateParts.length === 3 ? dateParts[2] : new Date().getDate(); 
    var dayFolderName = day + " " + monthName;
    return getOrCreateSubFolder(outletFolder, dayFolderName);
  } else if (data.type === "weekly") {
    // Mingguan folder format: <start_day>-<end_day>-<month>-<year>
    var pStart = data.periodeStart ? data.periodeStart.split("-") : [];
    var pEnd = data.periodeEnd ? data.periodeEnd.split("-") : [];
    
    var startDay = pStart.length === 3 ? parseInt(pStart[2], 10) : "1";
    var endDay = pEnd.length === 3 ? parseInt(pEnd[2], 10) : "7";
    
    var folderName = startDay + "-" + endDay + "-" + monthName.toLowerCase() + "-" + year;
    return getOrCreateSubFolder(outletFolder, folderName);
  } else if (data.type === "monthly") {
    // Bulanan folder: "Laporan Bulanan"
    return getOrCreateSubFolder(outletFolder, "Laporan Bulanan");
  }
  
  return outletFolder;
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
    
    var isFase1 = (data.type === "daily" && data.fase === 1);
    var isFase2 = (data.type === "daily" && data.fase === 2);
    
    // FASE 2: Load draft JSON dari Drive terlebih dahulu
    if (isFase2) {
      dateFormatted = data.tanggal;
      var dateParts = dateFormatted.split("-");
      yyyy = dateParts[0]; mm = dateParts[1]; dd = dateParts[2];
      year = yyyy; monthName = getIndonesianMonth(dateFormatted);
      outlet = (data.outlet || "Perintis").replace(/\s+/g, "_");
      
      var ss = getSpreadsheet();
      var sheet = getSheetForOutlet(ss, "Daily", data.outlet);
      var draftFileId = "";
      if (sheet && data.rowIdx) {
        // Ambil File ID yang kita simpan di Kolom 8 saat submit Fase 1
        draftFileId = sheet.getRange(data.rowIdx, 8).getValue();
      }
      
      var draftData = null;
      try {
        var draftFile = DriveApp.getFileById(draftFileId);
        draftData = JSON.parse(draftFile.getBlob().getDataAsString());
      } catch (e) {
        // Fallback: cari by name jika ID gagal (misal untuk data lama)
        var folder = getDynamicFolder(year, monthName, data);
        if (!folder) return { success: false, error: "Gagal mengakses Drive." };
        
        var draftFileName = dd + "-" + mm + "-" + yyyy + "-draft-" + outlet + ".json";
        var draftFiles = folder.getFilesByName(draftFileName);
        
        if (!draftFiles.hasNext()) {
          // SELF-HEALING: Delete the dangling row in the spreadsheet
          var deletionError = "";
          try {
            if (sheet) {
              var allData = sheet.getDataRange().getValues();
              var rowsToDelete = [];
              for (var i = allData.length - 1; i >= 1; i--) {
                var rowStatus = allData[i][10] ? allData[i][10].toString() : "";
                var rowOutlet = allData[i][2] ? allData[i][2].toString() : "";
                if (rowStatus === "Fase 1" && rowOutlet === (data.outlet || "Perintis").replace(/_/g, " ")) {
                   rowsToDelete.push(i + 1);
                }
              }
              for (var r = 0; r < rowsToDelete.length; r++) {
                 sheet.deleteRow(rowsToDelete[r]);
              }
            }
          } catch(err) {
            deletionError = " [ERROR HAPUS: " + err.toString() + "]";
          }
          return { success: false, isDangling: true, message: "Data Laporan Fase 1 (Draft JSON) tidak ditemukan di Drive meskipun sudah dicari berulang kali. Sistem telah menghapus status gantung Anda. Harap Refresh halaman ini dan buat ulang laporan dari awal." };
        }
        draftData = JSON.parse(draftFiles.next().getBlob().getDataAsString());
      }
      
      // Gabungkan data keuangan shift 2
      draftData.penjualan.shift2 = data.penjualan.shift2;
      draftData.penjualan.transaksi = data.penjualan.transaksi;
      draftData.fase = 2;
      draftData.rowIdx = data.rowIdx;
      
      // Preserve pdfBase64 that was sent from frontend
      if (data.pdfBase64) {
        draftData.pdfBase64 = data.pdfBase64;
      }
      
      // Timpa `data` dengan data gabungan untuk pembuatan PDF
      data = draftData;
    }

    
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
      
    } else if (data.type === "weekly") {
      var startDD = "1", endDD = "7";
      if (data.periodeStart && data.periodeEnd) {
        var pStart = data.periodeStart.split("-");
        var pEnd = data.periodeEnd.split("-");
        if (pStart.length === 3 && pEnd.length === 3) {
          startDD = parseInt(pStart[2], 10);
          endDD = parseInt(pEnd[2], 10);
          year = pStart[0];
          monthName = getIndonesianMonth(data.periodeStart);
        }
      } else {
        year = new Date().getFullYear().toString();
        monthName = getIndonesianMonth(new Date());
      }
      supervisor = data.supervisor;
      outlet = (data.outlet || "Perintis").replace(/\s+/g, "_");
      
      // Filename: 1-7-juli-laporan mingguan.pdf
      fileName = startDD + "-" + endDD + "-" + monthName.toLowerCase() + "-laporan mingguan.pdf";
      
    } else if (data.type === "monthly") {
      var parts = (data.bulan || "").split("-");
      year = parts[0] || new Date().getFullYear().toString();
      monthName = getIndonesianMonth((data.bulan || "") + "-01");
      supervisor = data.supervisor;
      outlet = (data.outlet || "Perintis").replace(/\s+/g, "_");
      
      // Filename: Juli-laporan-bulanan.PDF
      fileName = monthName + "-laporan-bulanan.pdf";
    }
    
    // 1. Generate PDF blob (Hanya jika BUKAN Fase 1)
    var pdfBlob = null;
    if (!isFase1 && data.pdfBase64) {
      try {
        var decoded = Utilities.base64Decode(data.pdfBase64);
        pdfBlob = Utilities.newBlob(decoded, "application/pdf", fileName);
      } catch (e) {
        Logger.log("Failed to decode base64: " + e.toString());
      }
    }
    
    if (!isFase1 && !pdfBlob) {
      // Fallback to GAS simple HTML to PDF if client failed or base64 decode failed
      var htmlContent = generateHtmlReport(data);
      var htmlOutput = HtmlService.createHtmlOutput(htmlContent);
      pdfBlob = htmlOutput.getAs("application/pdf").setName(fileName);
    }
    
    // 1.b Generate Kebersihan PDF blob if exists
    var kbPdfBlob = null;
    var kbFileName = data.tanggal + "-checklistbox-" + outlet + ".pdf";
    if (data.type === "daily" && data.kebersihanPdfBase64) {
      try {
        var decodedKb = Utilities.base64Decode(data.kebersihanPdfBase64);
        kbPdfBlob = Utilities.newBlob(decodedKb, "application/pdf", kbFileName);
      } catch (e) {
        Logger.log("Failed to decode kebersihan base64: " + e.toString());
      }
    }
    
    // 2. Save to Google Drive folder
    var folder = getDynamicFolder(year, monthName, data);
    if (!folder) {
      return { success: false, error: "Sistem gagal membuat/mengakses folder di Google Drive. Periksa perizinan Google Drive Anda." };
    }
    
    // 3. Pengecekan Duplikat (Hanya jika BUKAN Fase 2, karena Fase 2 PASTI ada file draft)
    if (!isFase2) {
      var existingFiles = folder.getFilesByName(fileName);
      if (existingFiles.hasNext()) {
        return { 
          success: false, 
          isDuplicate: true, 
          message: "Laporan untuk periode ini sudah ada. Pengiriman ganda digagalkan!" 
        };
      }
    }
    
    var fileUrl = "";
    if (isFase1) {
      // Simpan Draft JSON
      var draftFileName = dd + "-" + mm + "-" + yyyy + "-draft-" + outlet + ".json";
      var draftContent = JSON.stringify(data);
      var draftFile = folder.createFile(draftFileName, draftContent, MimeType.PLAIN_TEXT);
      fileUrl = draftFile.getId(); // Save ID for Fase 2 to retrieve instantly
    } else {
      // Simpan PDF
      var file = folder.createFile(pdfBlob);
      fileUrl = file.getUrl();
    }
    
    // Save Kebersihan PDF to its specific folder
    if (kbPdfBlob) {
      // Find or create "Checklist Kebersihan" folder inside the current MONTH folder
      var kbFolder;
      var parentMonthFolder = (data.type === "daily" && folder.getParents().hasNext()) ? folder.getParents().next() : folder;
      var kbFolders = parentMonthFolder.getFoldersByName("Checklist Kebersihan");
      if (kbFolders.hasNext()) {
        kbFolder = kbFolders.next();
      } else {
        kbFolder = parentMonthFolder.createFolder("Checklist Kebersihan");
      }
      kbFolder.createFile(kbPdfBlob);
    }
    
    // 4. Append row to corresponding Sheet tab
    if (data.type === "daily") {
      var sheet = getSheetForOutlet(ss, "Daily", data.outlet);
      
      if (isFase2) {
        // FASE 2: Update baris yang sudah ada
        if (data.rowIdx) {
          var totalOmset = Number(data.penjualan.shift1 || 0) + Number(data.penjualan.shift2 || 0);
          sheet.getRange(data.rowIdx, 5).setValue(totalOmset); // Col 5: Total Omset
          sheet.getRange(data.rowIdx, 8).setValue(fileUrl);    // Col 8: URL PDF
          sheet.getRange(data.rowIdx, 10).setValue(Number(data.penjualan.transaksi || 0)); // Col 10: Transaksi
          sheet.getRange(data.rowIdx, 11).setValue("Lengkap"); // Col 11: Status Fase
        }
        
        // Return success langsung, tidak perlu catat log audit/QC lagi karena sudah dicatat di Fase 1
        return { success: true, url: fileUrl };
      }
      
      // [A1] Anti-Duplikat: cek kombinasi Tanggal + Outlet sebelum appendRow
      var existingData = sheet.getDataRange().getValues();
      for (var di = 1; di < existingData.length; di++) {
        var existTgl = existingData[di][0].toString();
        var existOutlet = existingData[di][2].toString();
        if (existTgl === data.tanggal && existOutlet === (data.outlet || "Perintis")) {
          return {
            success: false,
            isDuplicate: true,
            message: "Laporan harian untuk " + data.tanggal + " di outlet " + data.outlet + " sudah pernah dikirim. Pengiriman ganda dicegah!"
          };
        }
      }
      
      var statusFase = isFase1 ? "Fase 1" : "Lengkap";
      sheet.appendRow([
        data.tanggal,
        data.supervisor,
        data.outlet,
        data.shift,
        Number(data.penjualan.shift1 || 0) + Number(data.penjualan.shift2 || 0),
        Number(data.feedback.totalKomplain || 0),
        data.penutup.kendala || "",
        fileUrl,
        Number(data.penjualan.target || 0),
        Number(data.penjualan.transaksi || 0),
        statusFase,
        data.cuaca || ""
      ]);
      
      if (data.kas && data.kas.audit && data.kas.audit.length > 0) {
        var auditSheet = setupSheet(ss, "Log_Audit_Kas", ["Tanggal", "Outlet", "Shift/Jam", "Total QRIS", "Total Tunai", "Aktual Sistem", "Selisih", "Keterangan"]);
        data.kas.audit.forEach(function(a) {
          auditSheet.appendRow([data.tanggal, data.outlet, a.jam, Number(a.qris||0), Number(a.tunai||0), Number(a.aktual||0), Number(a.selisih||0), a.keterangan||""]);
        });
      }
      
      var qcSheet = setupSheet(ss, "Log_QC", ["Tanggal", "Outlet", "Kategori", "Item/Menu", "Status", "Keterangan"]);
      if (data.qc && data.qc.espresso) {
        qcSheet.appendRow([data.tanggal, data.outlet, "Espresso", "Kalibrasi Espresso", data.qc.espresso.status || "", data.qc.espresso.keterangan || ""]);
      }
      if (data.qc && data.qc.items && data.qc.items.length > 0) {
        data.qc.items.forEach(function(q) {
          qcSheet.appendRow([data.tanggal, data.outlet, "Menu", q.nama, q.status, q.keterangan || ""]);
        });
      }
      
      var fbSheet = setupSheet(ss, "Log_Fasilitas_Bahan", ["Tanggal", "Outlet", "Tipe", "Nama Item", "Status/Ketersediaan", "Biaya Estimasi", "URL Foto", "Eskalasi"]);
      if (data.fasilitas && data.fasilitas.length > 0) {
        data.fasilitas.forEach(function(f) {
          fbSheet.appendRow([data.tanggal, data.outlet, "Fasilitas", f.item, f.status, 0, f.photoUrl || "", f.eskalasi ? "YA" : "TIDAK"]);
        });
      }
      if (data.bahan && data.bahan.length > 0) {
        data.bahan.forEach(function(b) {
          fbSheet.appendRow([data.tanggal, data.outlet, "Bahan", b.nama, b.ketersediaan, Number(b.harga||0), b.photoUrl || "", "TIDAK"]);
        });
      }
      
      if (data.kebersihan && data.kebersihan.length > 0) {
        var kbSheet = setupSheet(ss, "Database_Kebersihan", [
          "Tanggal", "Outlet", "Area", "Item Pemeriksaan", "Skor", "Status", "Keterangan"
        ]);
        data.kebersihan.forEach(function(k) {
          kbSheet.appendRow([data.tanggal, data.outlet, k.area, k.point, Number(k.skor || 0), k.status || "", k.ket || ""]);
        });
      }
      
      if (data.staff && data.staff.length > 0) {
        var stSheet = getSheetForOutlet(ss, "Staff_Daily", data.outlet);
        if (stSheet.getLastRow() === 0) stSheet.appendRow(["Tanggal", "Bulan Laporan", "Outlet", "Supervisor", "Nama Staff", "Posisi", "Status Kehadiran", "Keramahan Terlewat", "Catatan Khusus"]);
        var bulanLaporan = "";
        if (data.tanggal) {
          // data.tanggal is DD-MM-YYYY, we want MM-YYYY
          bulanLaporan = String(data.tanggal).substring(3, 10);
        }
        data.staff.forEach(function(s) {
          stSheet.appendRow([
            data.tanggal, bulanLaporan, data.outlet, data.supervisor, s.nama, s.posisi, s.status, s.keramahan ? "YA" : "TIDAK", s.keterangan || ""
          ]);
        });
      }
    } else if (data.type === "weekly") {
      var sheet = getSheetForOutlet(ss, "Weekly", data.outlet);
      
      var totalRealSales = 0;
      var totalTargetSales = 0;
      if (data.weekly && data.weekly.salesHarian) {
        data.weekly.salesHarian.forEach(function(s) {
          totalRealSales += Number(s.real || 0);
          totalTargetSales += Number(s.target || 0);
        });
      }
      
      var computedPeriode = data.periode || (data.periodeStart + " s/d " + data.periodeEnd);
      
      sheet.appendRow([
        computedPeriode,
        data.supervisor,
        data.outlet,
        totalRealSales,
        totalTargetSales,
        Number(data.weekly.komplain.total || 0),
        data.weekly.kendalaUtama || "",
        fileUrl
      ]);
      
      if (data.weekly.staff && data.weekly.staff.length > 0) {
        var swSheetName = "Staff_Weekly_" + (data.outlet || "Perintis").replace(/\s+/g, "_");
        var swSheet = setupSheet(ss, swSheetName, [
          "Periode", "Bulan Laporan", "Outlet", "Supervisor", "Nama Staff", "Posisi", "Status Evaluasi", "Catatan/Alasan"
        ]);
        var bulanLaporan = "";
        if (data.periodeStart) {
          bulanLaporan = String(data.periodeStart).substring(0, 7);
        }
        data.weekly.staff.forEach(function(s) {
          swSheet.appendRow([
            computedPeriode, bulanLaporan, data.outlet, data.supervisor, s.nama || "", s.posisi || "", s.status || "", s.alasan || ""
          ]);
        });
      }
    } else if (data.type === "monthly") {
      var sheet = getSheetForOutlet(ss, "Monthly", data.outlet);
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
        fileUrl,
        Number(data.monthly.operasional.kepatuhanSop || 0),
        Number(data.monthly.operasional.telat || 0),
        Number(data.monthly.operasional.teguran || 0),
        data.monthly.operasional.penyebab || "",
        data.monthly.fasilitas.eskalasi || "",
        data.monthly.rencana.strategi || "",
        data.monthly.rencana.gm || "",
        data.monthly.evaluasi.berhasil || "",
        data.monthly.evaluasi.sulit || "",
        data.monthly.evaluasi.skill || "",
        data.monthly.operasional.resignList ? data.monthly.operasional.resignList.length : 0, // Jumlah Resign
        data.monthly.ringkasan.masalah || "",
        data.monthly.ringkasan.kesimpulan || "",
        Number(data.monthly.qc.komplain || 0),
        Number(data.monthly.qc.remake || 0),
        data.monthly.qc.espresso || "",
        data.monthly.qc.rekomendasi || "",
        Number(data.monthly.fasilitas.pengeluaran || 0)
      ]);
      
      // Auto-Sync Turnover Barista to MasterStaff
      if (data.monthly.operasional.resignList && data.monthly.operasional.resignList.length > 0) {
        var masterSheet = ss.getSheetByName("MasterStaff");
        if (masterSheet) {
          var mData = masterSheet.getDataRange().getValues();
          data.monthly.operasional.resignList.forEach(function(resignItem) {
            if (!resignItem.id) return;
            for (var i = 1; i < mData.length; i++) {
              if (mData[i][0].toString() === resignItem.id.toString()) {
                masterSheet.getRange(i + 1, 4).setValue("Resign"); // Kolom D (Status)
                break;
              }
            }
          });
        }
      }
      
      if (data.monthly.staff && Array.isArray(data.monthly.staff)) {
        var smSheet = setupSheet(ss, "Staff_Monthly", [
          "Bulan", "Outlet", "Supervisor", "Nama Staff", "Posisi", "Status Evaluasi", "Catatan/Alasan"
        ]);
        data.monthly.staff.forEach(function(s) {
          smSheet.appendRow([
            bulanFormatted, data.outlet, data.supervisor, s.nama || "", s.posisi || "", s.status || "", s.alasan || ""
          ]);
        });
      }
    }
    
    // 5. Database Produk Terpusat
    var produkSheet = setupSheet(ss, "Database_Produk", [
      "Periode", "Tipe Laporan", "Outlet", "Kategori", "Peringkat", "Nama Produk", "Terjual", "Rencana/Action"
    ]);
    
    var periodeValue = data.tanggal || data.periode || data.bulan || "";
    if (data.type === "weekly" && !data.periode) {
      periodeValue = (data.periodeStart || "") + " s/d " + (data.periodeEnd || "");
    }
    var produkObj = data.produk || (data.weekly && data.weekly.produk) || (data.monthly && data.monthly.produk);
    
    if (produkObj) {
      var categories = [
        { keyTop: "topMinuman", keyBottom: "bottomMinuman", label: "Minuman" },
        { keyTop: "topMakanan", keyBottom: "bottomMakanan", label: "Makanan" },
        { keyTop: "topSnack", keyBottom: "bottomSnack", label: "Snack" }
      ];
      
      categories.forEach(function(cat) {
        if (produkObj[cat.keyTop] && Array.isArray(produkObj[cat.keyTop])) {
          produkObj[cat.keyTop].forEach(function(item) {
            if (item && item.nama && item.nama.trim() !== "") {
              produkSheet.appendRow([periodeValue, data.type, data.outlet || "Perintis", cat.label, "Top", item.nama, item.terjual || 0, ""]);
            }
          });
        }
        if (produkObj[cat.keyBottom] && Array.isArray(produkObj[cat.keyBottom])) {
          produkObj[cat.keyBottom].forEach(function(item) {
            if (item && item.nama && item.nama.trim() !== "") {
              produkSheet.appendRow([periodeValue, data.type, data.outlet || "Perintis", cat.label, "Bottom", item.nama, item.terjual || 0, item.rencana || item.tindakan || ""]);
            }
          });
        }
      });
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

function calculateAggregatedProducts(startDate, endDate, outlet) {
  var ss = getSpreadsheet();
  var dbSheet = ss.getSheetByName("Database_Produk");
  if (!dbSheet) return null;
  
  var dbData = dbSheet.getDataRange().getValues();
  function parseFilterDate(str) {
    if (!str) return 0;
    var p = str.split("-");
    if (p.length === 3) {
      var y = parseInt(p[0], 10), m = parseInt(p[1], 10) - 1, d = parseInt(p[2], 10);
      if (y < 2000) { y = parseInt(p[2], 10); d = parseInt(p[0], 10); } // Handle DD-MM-YYYY
      return new Date(y, m, d).getTime();
    }
    return new Date(str).getTime();
  }
  
  var start = parseFilterDate(startDate);
  var end = parseFilterDate(endDate);
  
  var agg = {
    topMinuman: {}, bottomMinuman: {},
    topMakanan: {}, bottomMakanan: {},
    topSnack: {}, bottomSnack: {}
  };
  
  for (var i = 1; i < dbData.length; i++) {
    var row = dbData[i];
    var tipe = String(row[1]); // Tipe Laporan
    var rowOutlet = String(row[2]);
    
    var isOutletMatch = (!outlet || String(outlet).toLowerCase() === "semua" || rowOutlet.toLowerCase() === String(outlet).toLowerCase());
    
    if (tipe === "daily" && isOutletMatch) {
      var rowDateObj = row[0];
      var rowDate = null;
      if (rowDateObj instanceof Date) {
        rowDate = new Date(rowDateObj.getFullYear(), rowDateObj.getMonth(), rowDateObj.getDate()).getTime();
      } else {
        var dateParts = String(row[0]).replace(/^'/, "").split("-");
        if (dateParts.length === 3) {
          var y = parseInt(dateParts[0], 10);
          var m = parseInt(dateParts[1], 10) - 1;
          var d = parseInt(dateParts[2], 10);
          if (y < 2000) { y = parseInt(dateParts[2], 10); d = parseInt(dateParts[0], 10); }
          rowDate = new Date(y, m, d).getTime();
        }
      }
      
      if (rowDate && rowDate >= start && rowDate <= end) {
        var kategori = String(row[3]).toLowerCase().trim(); // Minuman/Makanan/Snack
        var peringkat = String(row[4]).toLowerCase().trim(); // Top/Bottom
        var nama = String(row[5]);
        var terjual = Number(row[6]) || 0;
        var rencana = String(row[7]);
        
        var key = "";
        if (peringkat.indexOf("top") !== -1) {
          if (kategori === "minuman") key = "topMinuman";
          else if (kategori === "makanan") key = "topMakanan";
          else if (kategori === "snack") key = "topSnack";
        } else if (peringkat.indexOf("bottom") !== -1) {
          if (kategori === "minuman") key = "bottomMinuman";
          else if (kategori === "makanan") key = "bottomMakanan";
          else if (kategori === "snack") key = "bottomSnack";
        }
        
        if (key && nama) {
          if (!agg[key][nama]) {
            agg[key][nama] = { nama: nama, terjual: 0, rencana: "" };
          }
          agg[key][nama].terjual += terjual;
          if (rencana) {
            agg[key][nama].rencana = rencana;
          }
        }
      }
    }
  }
  
  // Convert dict to array, sort, and take top 5 / bottom 3
  var formatResult = function(obj, isTop) {
    var arr = Object.keys(obj).map(function(k) { return obj[k]; });
    if (isTop) {
      arr.sort(function(a, b) { return b.terjual - a.terjual; });
      return arr.slice(0, 5);
    } else {
      arr.sort(function(a, b) { return a.terjual - b.terjual; }); // lowest sold first
      return arr.slice(0, 3);
    }
  };
  
  return {
    topMinuman: formatResult(agg.topMinuman, true),
    bottomMinuman: formatResult(agg.bottomMinuman, false),
    topMakanan: formatResult(agg.topMakanan, true),
    bottomMakanan: formatResult(agg.bottomMakanan, false),
    topSnack: formatResult(agg.topSnack, true),
    bottomSnack: formatResult(agg.bottomSnack, false)
  };
}

/**
 * Fetches daily sales data (Realisasi & Target) for a given week period.
 * startDateStr and endDateStr should be YYYY-MM-DD.
 */
function api_getWeeklyData(startDateStr, endDateStr, outlet) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Daily");
    if (!sheet) return { success: false, error: "Tab Daily tidak ditemukan" };
    
    var data = sheet.getDataRange().getValues();
    var startD = new Date(startDateStr);
    var endD = new Date(endDateStr);
    var start = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate()).getTime();
    var end = new Date(endD.getFullYear(), endD.getMonth(), endD.getDate()).getTime();
    
    var dailyTotals = {
      "Senin": { target: 0, real: 0 },
      "Selasa": { target: 0, real: 0 },
      "Rabu": { target: 0, real: 0 },
      "Kamis": { target: 0, real: 0 },
      "Jumat": { target: 0, real: 0 },
      "Sabtu": { target: 0, real: 0 },
      "Minggu": { target: 0, real: 0 }
    };
    
    // Convert JS day 0-6 (Sun-Sat) to our day names
    var daysMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rowDate = null;
      if (row[0] instanceof Date) {
        rowDate = row[0];
      } else {
        var dateParts = String(row[0]).split("-");
        if (dateParts.length === 3) {
          var d = parseInt(dateParts[0], 10);
          var m = parseInt(dateParts[1], 10) - 1;
          var y = parseInt(dateParts[2], 10);
          if (y < 2000) { // Format is likely YYYY-MM-DD
            y = parseInt(dateParts[0], 10);
            d = parseInt(dateParts[2], 10);
          }
          rowDate = new Date(y, m, d);
        }
      }
      
      if (rowDate) {
        // Normalize the time to midnight for accurate comparison
        var t = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate()).getTime();
        
        if (t >= start && t <= end && String(row[2]).toLowerCase() === String(outlet).toLowerCase()) {
          var dayName = daysMap[rowDate.getDay()];
          dailyTotals[dayName].real += Number(row[4] || 0);
          dailyTotals[dayName].target += Number(row[8] || 0); // target is column 9 (index 8)
        }
      }
    }
    
    var result = [
      { hari: "Senin", target: dailyTotals["Senin"].target, real: dailyTotals["Senin"].real },
      { hari: "Selasa", target: dailyTotals["Selasa"].target, real: dailyTotals["Selasa"].real },
      { hari: "Rabu", target: dailyTotals["Rabu"].target, real: dailyTotals["Rabu"].real },
      { hari: "Kamis", target: dailyTotals["Kamis"].target, real: dailyTotals["Kamis"].real },
      { hari: "Jumat", target: dailyTotals["Jumat"].target, real: dailyTotals["Jumat"].real },
      { hari: "Sabtu", target: dailyTotals["Sabtu"].target, real: dailyTotals["Sabtu"].real },
      { hari: "Minggu", target: dailyTotals["Minggu"].target, real: dailyTotals["Minggu"].real }
    ];
    
    var aggregatedProducts = calculateAggregatedProducts(startDateStr, endDateStr, outlet);
    
    return { success: true, data: result, produk: aggregatedProducts };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Fetches monthly summary data (Total Omset, Target, Komplain) for a given month and outlet.
 * monthStr should be YYYY-MM.
 */
function api_getMonthlyData(monthStr, outlet) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Daily");
    if (!sheet) return { success: false, error: "Tab Daily tidak ditemukan" };
    
    var data = sheet.getDataRange().getValues();
    var monthParts = monthStr.split("-"); // [YYYY, MM]
    var targetYear = parseInt(monthParts[0], 10);
    var targetMonth = parseInt(monthParts[1], 10) - 1; // JS months are 0-11
    
    var totalReal = 0;
    var totalTarget = 0;
    var totalKomplain = 0;
    
    var totalTelat = 0;
    var sopTotalStaff = 0;
    var sopCompliantStaff = 0;
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rowDate = null;
      if (row[0] instanceof Date) {
        rowDate = row[0];
      } else {
        var dateParts = String(row[0]).split("-");
        if (dateParts.length === 3) {
          var d = parseInt(dateParts[0], 10);
          var m = parseInt(dateParts[1], 10) - 1;
          var y = parseInt(dateParts[2], 10);
          if (y < 2000) { // Format is likely YYYY-MM-DD
            y = parseInt(dateParts[0], 10);
            d = parseInt(dateParts[2], 10);
          }
          rowDate = new Date(y, m, d);
        }
      }
      
      if (rowDate) {
        if (rowDate.getFullYear() === targetYear && rowDate.getMonth() === targetMonth && String(row[2]).toLowerCase() === String(outlet).toLowerCase()) {
          totalReal += Number(row[4] || 0); // Col E: Total Omset (shift1+shift2)
          totalKomplain += Number(row[5] || 0); // Col F: Komplain
          totalTarget += Number(row[8] || 0); // Col I: Target
        }
      }
    }
    
    var stSheet = ss.getSheetByName("Staff_Daily");
    if (stSheet) {
      var stData = stSheet.getDataRange().getValues();
      for (var s = 1; s < stData.length; s++) {
        var sRow = stData[s];
        if (String(sRow[1]) === monthStr && String(sRow[2]).toLowerCase() === String(outlet).toLowerCase()) {
          var posisi = String(sRow[5]);
          var statusHadir = String(sRow[6]);
          var keramahanMiss = String(sRow[7]);
          
          if (statusHadir === 'Terlambat') {
            totalTelat++;
          }
          
          if (posisi !== 'Kitchen' && (statusHadir === 'Hadir' || statusHadir === 'Terlambat')) {
            sopTotalStaff++;
            if (keramahanMiss === 'TIDAK') {
              sopCompliantStaff++;
            }
          }
        }
      }
    }
    
    var kepatuhanSop = 0;
    if (sopTotalStaff > 0) {
      kepatuhanSop = Math.round((sopCompliantStaff / sopTotalStaff) * 100);
    }
    
    var totalTeguran = 0;
    var swSheet = ss.getSheetByName("Staff_Weekly");
    var staffMap = {};

    if (swSheet) {
      var swData = swSheet.getDataRange().getValues();
      for (var w = 1; w < swData.length; w++) {
        var wRow = swData[w];
        if (String(wRow[1]) === monthStr && String(wRow[2]).toLowerCase() === String(outlet).toLowerCase()) {
          var nama = String(wRow[4]);
          var posisi = String(wRow[5]);
          var evalStatus = String(wRow[6]);
          var catatan = String(wRow[7]);

          if (evalStatus === 'Menurun' || evalStatus === 'Menurun / Perlu Evaluasi') {
            totalTeguran++;
          }
          
          if (!staffMap[nama]) {
            staffMap[nama] = { posisi: posisi, evals: [], catatans: [] };
          }
          staffMap[nama].evals.push(evalStatus);
          if (catatan) staffMap[nama].catatans.push(catatan);
        }
      }
    }
    
    // Hitung Tren Performa per Staf (Mode / Mayoritas)
    var staffEvaluations = [];
    for (var nama in staffMap) {
      var s = staffMap[nama];
      var counts = {};
      var maxCount = 0;
      var modeEval = "Stagnan";
      
      s.evals.forEach(function(e) {
        counts[e] = (counts[e] || 0) + 1;
        if (counts[e] > maxCount) {
          maxCount = counts[e];
          modeEval = e;
        }
      });
      
      // Normalisasi status untuk UI Bulanan
      var finalStatus = "Stagnan";
      if (modeEval.indexOf("Berkembang") !== -1) finalStatus = "Berkembang";
      else if (modeEval.indexOf("Stagnan") !== -1) finalStatus = "Stagnan";
      else if (modeEval.indexOf("Menurun") !== -1) finalStatus = "Menurun";
      
      var finalCatatan = s.catatans.join("; ");
      
      staffEvaluations.push({
        nama: nama,
        posisi: s.posisi,
        status: finalStatus,
        alasan: finalCatatan
      });
    }
    
    var startDateStr = targetYear + "-" + (targetMonth + 1 < 10 ? "0" + (targetMonth + 1) : (targetMonth + 1)) + "-01";
    var endDateStr = targetYear + "-" + (targetMonth + 1 < 10 ? "0" + (targetMonth + 1) : (targetMonth + 1)) + "-" + new Date(targetYear, targetMonth + 1, 0).getDate();
    var aggregatedProducts = calculateAggregatedProducts(startDateStr, endDateStr, outlet);
    
    return { 
      success: true, 
      totalReal: totalReal, 
      totalTarget: totalTarget, 
      totalKomplain: totalKomplain,
      totalTelat: totalTelat,
      kepatuhanSop: kepatuhanSop,
      totalTeguran: totalTeguran,
      staffEvaluations: staffEvaluations,
      produk: aggregatedProducts
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Verifikasi PIN SPV untuk menentukan akses ke Outlet
 */
function api_verifyPIN(pin) {
  // Sesuai requirement: 1234 -> Perintis, 5678 -> Dg Tata
  if (pin === "1234") {
    return JSON.stringify({ success: true, outlet: "Perintis" });
  } else if (pin === "5678") {
    return JSON.stringify({ success: true, outlet: "Dg Tata" });
  } else {
    return JSON.stringify({ success: false, error: "PIN tidak valid!" });
  }
}

/**
 * Mengecek apakah ada laporan harian (Fase 1) yang belum dilengkapi keuangan (Fase 2)
 */
function api_checkPendingLaporan() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Daily");
    if (!sheet) return JSON.stringify({ status: "success", pendings: [] });
    
    var data = sheet.getDataRange().getValues();
    var pendings = [];
    
    // Cari dari bawah (data terbaru) ke atas, limit ke 60 baris terakhir untuk efisiensi
    var limit = Math.max(1, data.length - 60);
    for (var i = data.length - 1; i >= limit; i--) {
      var rowOutlet = data[i][2] ? data[i][2].toString() : "";
      var rowStatus = data[i][10] ? data[i][10].toString() : ""; 
      
      if (rowStatus === "Fase 1") {
        var rawDate = data[i][0];
        var formattedDate = "";
        if (rawDate instanceof Date) {
          var y = rawDate.getFullYear();
          var m = ("0" + (rawDate.getMonth() + 1)).slice(-2);
          var d = ("0" + rawDate.getDate()).slice(-2);
          formattedDate = y + "-" + m + "-" + d;
        } else {
          var ds = rawDate.toString();
          var parts = ds.split("-");
          if (parts.length === 3) {
            formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
          } else {
            formattedDate = ds;
          }
        }
        
        pendings.push({
          outlet: rowOutlet,
          tanggal: formattedDate,
          supervisor: data[i][1].toString(),
          shift1: data[i][4] ? Number(data[i][4]) : 0,
          rowIdx: i + 1
        });
      }
    }
    
    return JSON.stringify({ status: "success", pendings: pendings });
  } catch(e) {
    return JSON.stringify({ status: "error", error: e.toString() });
  }
}

/**
 * Fetches dashboard analytics data for GM.
 */
function api_gm_fetchReports(startDate, endDate, outletFilter) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Daily");
    if (!sheet) throw new Error("Tab Daily tidak ditemukan.");
    
    var data = sheet.getDataRange().getValues();
    var omsetTotal = 0;
    var targetOmset = 0;
    var omsetBulanLalu = 0;
    var komplainTotal = 0;
    var transaksiTotal = 0;
    var listLaporan = [];
    var chartData = [];
    var cuacaHujan = 0;
    var cuacaCerah = 0;
    var outletStats = {};
    var omsetYTD = 0;
    
    var year = startDate ? startDate.substring(0, 4) : new Date().getFullYear().toString();
    var targetYTDStr = PropertiesService.getScriptProperties().getProperty("GM_TARGET_TAHUNAN_" + year);
    var targetYTD = targetYTDStr ? Number(targetYTDStr) : 0;
    
    // Define monthName and monthPrefix for compatibility with Weekly/Monthly fetching
    var startMonthIdx = new Date(startDate).getMonth();
    var monthsIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    var monthName = monthsIndo[startMonthIdx] || "";
    var monthPrefix = startDate ? startDate.substring(0, 7) : "";
    
    // Calculate previous period for comparison (same duration immediately preceding)
    var startD = new Date(startDate);
    var endD = new Date(endDate);
    var diffTime = Math.abs(endD - startD);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    var prevEndD = new Date(startD);
    prevEndD.setDate(prevEndD.getDate() - 1);
    var prevStartD = new Date(prevEndD);
    prevStartD.setDate(prevStartD.getDate() - diffDays);
    
    var formatDate = function(d) {
      var m = d.getMonth() + 1;
      var day = d.getDate();
      return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
    };
    var prevStartDateStr = formatDate(prevStartD);
    var prevEndDateStr = formatDate(prevEndD);
    
    // Skip headers
    for (var i = 1; i < data.length; i++) {
      var rowDateObj = data[i][0];
      var rowDate = "";
      // [A2] Standarisasi: hanya satu logika parsing DD-MM-YYYY → internal YYYY-MM-DD
      if (rowDateObj instanceof Date) {
        var m = rowDateObj.getMonth() + 1;
        var d = rowDateObj.getDate();
        rowDate = rowDateObj.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
      } else {
        var str = (rowDateObj || "").toString().replace(/^'/, "").trim();
        var parts = str.split("-");
        if (parts.length === 3) {
          if (parts[2].length === 4) {
            // Format DD-MM-YYYY (format resmi aplikasi)
            rowDate = parts[2] + "-" + parts[1] + "-" + parts[0];
          } else if (parts[0].length === 4) {
            // Format YYYY-MM-DD (legacy/DummyData) → tetap bisa dibaca
            rowDate = str;
          }
        }
      }
      
      var rowOutlet = (data[i][2] || "").toString();
      var matchesFilter = !outletFilter || outletFilter === "Semua" || rowOutlet === outletFilter;
      
      if (matchesFilter) {
        var rowOmset = Number(data[i][4] || 0);
        var rowTarget = Number(data[i][8] || 0); // Col I
        
        // Year-to-Date Calculation
        if (rowDate.startsWith(year)) {
          omsetYTD += rowOmset;
        }
        
        if (rowDate >= startDate && rowDate <= endDate) {
          omsetTotal += rowOmset;
          // targetOmset += rowTarget; (Removed: Now calculated dynamically from Config_Target)
          komplainTotal += Number(data[i][5] || 0);
          transaksiTotal += Number(data[i][9] || 0); // Read real transaction data from col 10
          
          var rowCuaca = (data[i][11] || "Cerah / Panas").toString().toLowerCase();
          if (rowCuaca.indexOf("hujan") !== -1 || rowCuaca.indexOf("mendung") !== -1) {
            cuacaHujan++;
          } else {
            cuacaCerah++;
          }
          
          listLaporan.push({
            name: "Daily Report - " + rowDate + " (" + data[i][1] + ")",
            url: data[i][7],
            dateCreated: rowDate
          });
          chartData.push({
            date: rowDate,
            omset: rowOmset
          });
          
          // Leaderboard Outlet
          var outletName = rowOutlet || "Unknown";
          if (!outletStats[outletName]) {
            outletStats[outletName] = 0;
          }
          outletStats[outletName] += rowOmset;
          
        } else if (rowDate >= prevStartDateStr && rowDate <= prevEndDateStr) {
          omsetBulanLalu += rowOmset;
        }
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
          var rowOutlet = (wData[i][2] || "").toString();
          if (!outletFilter || outletFilter === "Semua" || rowOutlet === outletFilter) {
            listLaporan.push({
              name: "Weekly Report - " + period + " (" + wData[i][1] + ")",
              url: wData[i][7],
              dateCreated: period
            });
          }
        }
      }
    }
    
    // --- Real-Time SDM Aggregation ---
    var totalTelatRealtime = 0;
    var staffSheet = ss.getSheetByName("Staff_Daily");
    if (staffSheet) {
      var sdData = staffSheet.getDataRange().getValues();
      for (var s = 1; s < sdData.length; s++) {
        var rowDateStr = "";
        var dObj = sdData[s][0];
        if (dObj instanceof Date) {
          rowDateStr = formatDate(dObj);
        } else {
          var str = (dObj||"").toString().replace(/^'/, "").trim();
          var p = str.split("-");
          if(p.length===3) {
            if(p[0].length===4) rowDateStr = str;
            else if(p[2].length===4) rowDateStr = p[2]+"-"+p[1]+"-"+p[0];
          }
        }
        var rowOutlet = (sdData[s][2] || "").toString();
        if (rowDateStr >= startDate && rowDateStr <= endDate) {
          if (!outletFilter || outletFilter === "Semua" || rowOutlet === outletFilter) {
            var statusHadir = (sdData[s][6] || "").toString().toLowerCase();
            if (statusHadir === "terlambat") {
              totalTelatRealtime++;
            }
          }
        }
      }
    }

    var operasionalData = null;
    var monthlySheet = ss.getSheetByName("Monthly");
    if (monthlySheet) {
      var mData = monthlySheet.getDataRange().getValues();
      // We need to compare monthPrefix (YYYY-MM) with the sheet format (MM-YYYY)
      var targetBul = monthPrefix;
      if (monthPrefix.indexOf("-") !== -1) {
        var p = monthPrefix.split("-");
        targetBul = p[1] + "-" + p[0];
      }
      
      for (var i = 1; i < mData.length; i++) {
        var bulObj = mData[i][0];
        var bul = "";
        if (bulObj instanceof Date) {
           var m = bulObj.getMonth() + 1;
           var y = bulObj.getFullYear();
           bul = (m < 10 ? "0" + m : m) + "-" + y;
        } else {
           bul = (bulObj || "").toString();
        }
        
        if (bul === targetBul) {
          var rowOutlet = (mData[i][2] || "").toString();
          if (!outletFilter || outletFilter === "Semua" || rowOutlet === outletFilter) {
            listLaporan.push({
              name: "Monthly Report - " + bul + " (" + mData[i][1] + ")",
              url: mData[i][7],
              dateCreated: bul
            });
            
            operasionalData = {
              isFallback: false,
              kepatuhanSop: null, // UI will use hygieneScore instead
              totalTelat: totalTelatRealtime, // Override with real-time data
              totalTeguran: mData[i][10] !== "" ? Number(mData[i][10]) : null,
              kendalaUtama: (mData[i][11] || "").toString(),
              eskalasiFasilitas: (mData[i][12] || "").toString(),
              strategiDepan: (mData[i][13] || "").toString(),
              kebutuhanGM: (mData[i][14] || "").toString(),
              pencapaian: (mData[i][15] || "").toString(),
              tantangan: (mData[i][16] || "").toString(),
              skill: (mData[i][17] || "").toString(),
              turnoverBarista: mData[i][18] !== "" ? Number(mData[i][18]) : null
            };
          }
        }
      }
    }
    
    // Fallback if Monthly not found
    if (!operasionalData) {
      operasionalData = {
        isFallback: true,
        kepatuhanSop: null,
        totalTelat: totalTelatRealtime,
        totalTeguran: null,
        kendalaUtama: "Menunggu Laporan Bulanan (Snapshot Sementara)",
        eskalasiFasilitas: "-",
        strategiDepan: "-",
        kebutuhanGM: "-",
        pencapaian: "-",
        tantangan: "-",
        skill: "-",
        turnoverBarista: null
      };
    }

    // Transaction total is now calculated inside the main loop
    // var transaksiTotal = listLaporan.length * 45;
    var currentFolderId = PropertiesService.getScriptProperties().getProperty("ROOT_FOLDER_ID") || "";
    
    // targetOmset is now calculated directly from the Daily sheet
    
    // --- Dynamic Target Calculation from Config_Target ---
    var dStartObj = new Date(startDate);
    var dEndObj = new Date(endDate || startDate);
    var durationDays = Math.round((dEndObj - dStartObj) / (1000 * 60 * 60 * 24)) + 1;
    
    var mForTarget = dStartObj.getMonth() + 1;
    var targetBulanStr = (mForTarget < 10 ? "0" + mForTarget : mForTarget) + "-" + dStartObj.getFullYear();
    
    var configSheet = ss.getSheetByName("Config_Target");
    var monthlyTarget = 0;
    if (configSheet) {
      var cData = configSheet.getDataRange().getValues();
      var targetTotalSemua = 0;
      var foundSpecific = false;
      
      for (var c = 1; c < cData.length; c++) {
        var rowBulanTahun = (cData[c][0] || "").toString();
        if (rowBulanTahun === targetBulanStr) {
          var cOutlet = (cData[c][2] || "").toString();
          if (cOutlet === outletFilter && outletFilter !== "Semua") {
            monthlyTarget = Number(cData[c][3] || 0);
            foundSpecific = true;
            break;
          }
          if (!outletFilter || outletFilter === "Semua") {
             targetTotalSemua += Number(cData[c][3] || 0);
          }
        }
      }
      if (!foundSpecific && (!outletFilter || outletFilter === "Semua")) {
        monthlyTarget = targetTotalSemua;
      }
    }
    
    var daysInMonth = new Date(dStartObj.getFullYear(), dStartObj.getMonth() + 1, 0).getDate();
    var dailyTarget = monthlyTarget / daysInMonth;
    targetOmset = dailyTarget * durationDays;
    
    var productsData = {
      minuman: { top: [], bottom: [] },
      makanan: { top: [], bottom: [] },
      snack: { top: [], bottom: [] }
    };
    
    var aggProducts = calculateAggregatedProducts(startDate, endDate, outletFilter || "Semua");
    if (aggProducts) {
      productsData = {
        minuman: { top: aggProducts.topMinuman, bottom: aggProducts.bottomMinuman },
        makanan: { top: aggProducts.topMakanan, bottom: aggProducts.bottomMakanan },
        snack: { top: aggProducts.topSnack, bottom: aggProducts.bottomSnack }
      };
    }
    
    // Sort Outlet Leaderboard
    var leaderboard = [];
    for (var out in outletStats) {
      leaderboard.push({ name: out, omset: outletStats[out] });
    }
    leaderboard.sort(function(a, b) { return b.omset - a.omset; });

    // Calculate Kebersihan (Hygiene) Score
    var hygieneScoreTotal = 0;
    var hygieneCount = 0;
    var hygieneAreas = {};
    var kbSheet = ss.getSheetByName("Database_Kebersihan");
    if (kbSheet) {
      var kbData = kbSheet.getDataRange().getValues();
      for (var i = 1; i < kbData.length; i++) {
        var rowDateStr = "";
        var dObj = kbData[i][0];
        if (dObj instanceof Date) {
          rowDateStr = formatDate(dObj);
        } else {
          var str = (dObj||"").toString();
          var p = str.split("-");
          if(p.length===3) {
            if(p[0].length===4) rowDateStr = str;
            else if(p[2].length===4) rowDateStr = p[2]+"-"+p[1]+"-"+p[0];
          }
        }
        var rowOutlet = (kbData[i][1] || "").toString();
        var matches = !outletFilter || outletFilter === "Semua" || rowOutlet === outletFilter;
        if (matches && rowDateStr >= startDate && rowDateStr <= endDate) {
          var area = kbData[i][2];
          var skor = Number(kbData[i][4]);
          var ket = kbData[i][6];
          hygieneScoreTotal += skor;
          hygieneCount++;
          
          if (!hygieneAreas[area]) hygieneAreas[area] = { totalSkor: 0, count: 0, logs: [] };
          hygieneAreas[area].totalSkor += skor;
          hygieneAreas[area].count++;
          if (ket && ket.trim() !== "") {
            hygieneAreas[area].logs.push(ket);
          }
        }
      }
    }
    
    var hygieneScore = hygieneCount > 0 ? Math.round(hygieneScoreTotal / hygieneCount) : 0;
    var hygieneKritis = [];
    for (var area in hygieneAreas) {
      hygieneKritis.push({
        area: area,
        avg: Math.round(hygieneAreas[area].totalSkor / hygieneAreas[area].count),
        ket: hygieneAreas[area].logs.length > 0 ? hygieneAreas[area].logs[0] : "-"
      });
    }
    hygieneKritis.sort(function(a,b) { return a.avg - b.avg; });
    hygieneKritis = hygieneKritis.slice(0, 3);

    // --- PREDICTIVE SYSTEM ENGINE (v3.0 - Context-Aware Shapeshifter) ---
    var predictiveAlert = "";
    var systemVerdict = "Normal";
    var dStart = new Date(startDate);
    var dEnd = new Date(endDate || startDate);
    
    // Calculate Duration in Days
    var durationDays = Math.round((dEnd - dStart) / (1000 * 60 * 60 * 24)) + 1;
    
    var dday = dStart.getDate();
    var isTanggalMuda = (dday >= 25 || dday <= 5);
    var isTanggalTua = (dday >= 15 && dday <= 24);
    
    // Check Macro Parameters (Akademik, etc)
    var activeEvent = "";
    var pSheet = ss.getSheetByName("Config_Parameter");
    if (pSheet) {
      var pData = pSheet.getDataRange().getValues();
      for (var pIdx = 1; pIdx < pData.length; pIdx++) {
        var pStatus = (pData[pIdx][5] || "").toString();
        var pOutlet = (pData[pIdx][0] || "").toString();
        if (pStatus === "Aktif" && (!outletFilter || outletFilter === "Semua" || pOutlet === "Semua" || pOutlet === outletFilter)) {
          var pMulai = (pData[pIdx][3] || "").toString();
          var pSelesai = (pData[pIdx][4] || "").toString();
          if (startDate >= pMulai && startDate <= pSelesai) {
             activeEvent = pData[pIdx][2];
             break;
          }
        }
      }
    }

    var pacingOmset = targetOmset > 0 ? (omsetTotal / targetOmset) : 0;
    
    // DYNAMIC AI DECISION MATRIX
    if (durationDays <= 2) {
      // TIER 1: TACTICAL MODE (Harian / 1-2 Hari)
      if (activeEvent !== "" && isTanggalTua) {
        systemVerdict = "Kuning";
        predictiveAlert = "Trafik Padat, Daya Beli Rendah (Event: " + activeEvent + " + Tanggal Tua): Kedai akan ramai namun pengunjung mayoritas berhemat. Action: Jangan tambah staf ekstra, alihkan energi ke kebersihan area. Jangan push menu premium, fokus tawarkan promo paket hemat.";
      } 
      else if (activeEvent !== "" && isTanggalMuda) {
        systemVerdict = "Hijau";
        predictiveAlert = "Momen Emas (Event: " + activeEvent + " + Tanggal Muda): Peluang mencetak rekor omset harian. Action: Pastikan staf full-team & prima. Push upselling menu premium. Kecepatan dapur adalah kunci.";
      }
      else if (activeEvent === "" && isTanggalTua && (operasionalData.kepatuhanSop < 85 || komplainTotal > 1)) {
        systemVerdict = "Merah";
        predictiveAlert = "Bahaya Kualitas Harian: Trafik sepi (Tanggal Tua) namun staf lalai (SOP turun/Komplain ada). Ini berisiko mengusir pelanggan solo yang tersisa. Action: Berikan teguran ke SPV shift hari ini.";
      }
      else if (activeEvent === "" && isTanggalMuda && targetOmset > 0 && omsetTotal < targetOmset) {
        systemVerdict = "Merah";
        predictiveAlert = "Darurat Trafik Harian: Harusnya daya beli kuat (Tanggal Muda) namun omset belum capai target. Action: Minta SPV periksa kendala lapangan mendadak (hujan/jalan ditutup) atau jalankan Flash Promo lokal.";
      }
      else {
        systemVerdict = "Biru";
        predictiveAlert = "Kinerja Taktis Harian: Operasional stabil dan tidak ada anomali cuaca/tanggal yang ekstrem. Terus pantau pelayanan harian.";
      }

    } else if (durationDays > 2 && durationDays <= 14) {
      // TIER 2: MOMENTUM MODE (Mingguan / Short Trend)
      if (pacingOmset >= 1 && komplainTotal > 3) {
        systemVerdict = "Kuning";
        predictiveAlert = "Warning Momentum: Kecepatan omset (Run-Rate) mingguan sangat baik, namun mengorbankan kualitas (Komplain Tinggi). Action: Evaluasi kecepatan penyajian dapur dan kontrol kualitas.";
      }
      else if (pacingOmset < 0.85 && operasionalData.kepatuhanSop >= 95) {
        systemVerdict = "Merah";
        predictiveAlert = "Darurat Trafik Mingguan: Kepatuhan SOP sempurna namun kecepatan omset (Pacing) sangat lambat (<85%). Kinerja layanan bukan masalah, masalahnya murni pada kurangnya trafik. Action: Luncurkan promo lokal / perkuat konten iklan akhir pekan.";
      }
      else if (pacingOmset >= 1 && operasionalData.kepatuhanSop >= 90) {
        systemVerdict = "Hijau";
        predictiveAlert = "Momentum Positif: Tren pertumbuhan mingguan sangat stabil dengan pelayanan terjaga. Pertahankan formasi tim ini menjelang akhir pekan.";
      }
      else {
        systemVerdict = "Biru";
        predictiveAlert = "Evaluasi Mingguan: Tren mingguan berjalan fluktuatif namun masih dalam batas toleransi wajar. Tidak ada indikator kritis.";
      }

    } else {
      // TIER 3: STRATEGIC MACRO MODE (Bulanan / 15+ Hari)
      var rasioTelat = (operasionalData.telat || 0) / durationDays;
      if (pacingOmset < 0.90 && rasioTelat > 0.2) {
        systemVerdict = "Merah";
        predictiveAlert = "Krisis Kepemimpinan Bulanan: Pencapaian target GAGAL. Analisis sistem menemukan korelasi kuat antara lambatnya pertumbuhan dengan tingginya tingkat ketidakdisiplinan staf (Keterlambatan). Ada indikasi Toxic Workplace di lapangan.";
      }
      else if (pacingOmset >= 1 && komplainTotal > (durationDays * 0.3)) {
        systemVerdict = "Kuning";
        predictiveAlert = "Pertumbuhan Semu (Hollow Growth): Target finansial bulanan TERCAPAI, namun citra *brand* rusak (Komplain sangat tinggi secara akumulatif). Action: Anda butuh Manpower tambahan atau efisiensi dapur sebelum pelanggan churn permanen.";
      }
      else if (pacingOmset >= 1 && operasionalData.kepatuhanSop >= 95 && komplainTotal < (durationDays * 0.1)) {
        systemVerdict = "Hijau";
        predictiveAlert = "Golden Era (Sukses Eksekutif): Keseimbangan sempurna operasional dan finansial skala makro tercapai. Kinerja ini layak dijadikan benchmark. Action: Cairkan insentif maksimal untuk jajaran manajerial.";
      }
      else if (pacingOmset < 0.90) {
        systemVerdict = "Merah";
        predictiveAlert = "Kegagalan Target Periode: Target gagal dicapai. Evaluasi seluruh matriks *Marketing Intelligence*, produk andalan (Top 5), dan rasio promosi. Perlu perombakan strategi menyeluruh untuk siklus berikutnya.";
      }
      else {
        systemVerdict = "Biru";
        predictiveAlert = "Kinerja Makro Stabil: Seluruh matriks utama (Finansial, SOP, SDM) dalam satu bulan penuh menunjukkan titik aman tanpa anomali ekstrem. Target tercapai moderat.";
      }
    }

    var resultObj = {
      status: "success",
      data: {
        omsetTotal: omsetTotal || 0,
        omsetBulanLalu: omsetBulanLalu || 0,
        omsetYTD: omsetYTD || 0,
        targetYTD: targetYTD || 0,
        transaksiTotal: transaksiTotal || 0,
        komplainTotal: komplainTotal || 0,
        listLaporan: listLaporan || [],
        currentFolderId: currentFolderId || "",
        targetOmset: Number(targetOmset) || 0,
        chartData: chartData.sort(function(a, b) { return a.date.localeCompare(b.date); }) || [],
        productsData: productsData,
        operasionalData: operasionalData,
        leaderboard: leaderboard,
        hygieneScore: hygieneScore,
        hygieneKritis: hygieneKritis,
        cuacaHujan: cuacaHujan,
        cuacaCerah: cuacaCerah,
        predictiveAlert: predictiveAlert,
        systemVerdict: systemVerdict
      }
    };
    return JSON.stringify(resultObj);
  } catch (err) {
    return JSON.stringify({ status: "error", error: err.toString() });
  }
}

/**
 * Menambahkan Parameter Makro Baru (Misal: Kalender Akademik)
 */
function api_saveParameter(payloadStr) {
  try {
    var data = JSON.parse(payloadStr);
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Config_Parameter");
    if (!sheet) throw new Error("Tab Config_Parameter tidak ditemukan. Jalankan Setup ulang.");
    
    // Validasi data
    if (!data.kategori || !data.namaEvent || !data.tglMulai || !data.tglSelesai) {
      throw new Error("Data parameter tidak lengkap.");
    }
    
    var rowData = [
      data.outlet || "Semua",
      data.kategori,
      data.namaEvent,
      data.tglMulai,
      data.tglSelesai,
      "Aktif"
    ];
    
    sheet.appendRow(rowData);
    return JSON.stringify({ status: "success", message: "Parameter berhasil disimpan." });
  } catch(e) {
    return JSON.stringify({ status: "error", error: e.toString() });
  }
}

/**
 * Mengambil daftar Parameter Makro
 */
function api_getParameters(outlet) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Config_Parameter");
    if (!sheet) return JSON.stringify({ status: "success", data: [] });
    
    var data = sheet.getDataRange().getValues();
    var results = [];
    
    for (var i = 1; i < data.length; i++) {
      var rowOutlet = (data[i][0] || "").toString();
      if (!outlet || outlet === "Semua" || rowOutlet === "Semua" || rowOutlet === outlet) {
        results.push({
          rowIdx: i + 1,
          outlet: rowOutlet,
          kategori: data[i][1],
          namaEvent: data[i][2],
          tglMulai: data[i][3],
          tglSelesai: data[i][4],
          status: data[i][5]
        });
      }
    }
    
    return JSON.stringify({ status: "success", data: results });
  } catch(e) {
    return JSON.stringify({ status: "error", error: e.toString() });
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
    html += `<h3>Produk Terlaris (Top 3)</h3>
    <table border="1" cellpadding="5">
      <tr><th>Kategori</th><th>#1</th><th>#2</th><th>#3</th></tr>
      <tr><td><strong>Makanan</strong></td><td>${data.produk.topMakanan ? (data.produk.topMakanan[0]?.nama || '-') : '-'}</td><td>${data.produk.topMakanan ? (data.produk.topMakanan[1]?.nama || '-') : '-'}</td><td>${data.produk.topMakanan ? (data.produk.topMakanan[2]?.nama || '-') : '-'}</td></tr>
      <tr><td><strong>Minuman</strong></td><td>${data.produk.topMinuman ? (data.produk.topMinuman[0]?.nama || '-') : '-'}</td><td>${data.produk.topMinuman ? (data.produk.topMinuman[1]?.nama || '-') : '-'}</td><td>${data.produk.topMinuman ? (data.produk.topMinuman[2]?.nama || '-') : '-'}</td></tr>
      <tr><td><strong>Snack</strong></td><td>${data.produk.topSnack ? (data.produk.topSnack[0]?.nama || '-') : '-'}</td><td>${data.produk.topSnack ? (data.produk.topSnack[1]?.nama || '-') : '-'}</td><td>${data.produk.topSnack ? (data.produk.topSnack[2]?.nama || '-') : '-'}</td></tr>
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
    // [A3] Centralize: selalu baca ROOT_FOLDER_ID dari ScriptProperties
    var rootFolderId = PropertiesService.getScriptProperties().getProperty("ROOT_FOLDER_ID");
    var rootFolder;
    
    if (!rootFolderId) {
      return { success: false, error: "Root folder belum dikonfigurasi. Set ROOT_FOLDER_ID di Dasbor GM terlebih dahulu." };
    }
    
    try {
      rootFolder = DriveApp.getFolderById(rootFolderId);
    } catch (e) {
      Logger.log("Folder root tidak ditemukan: " + e.toString());
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
 * Save GM Settings (Fixed Annual Target)
 */
function api_gm_saveSettings(payloadStr) {
  try {
    var payload = JSON.parse(payloadStr);
    var year = payload.year || new Date().getFullYear().toString();
    var target = payload.target || "0";
    
    PropertiesService.getScriptProperties().setProperty("GM_TARGET_TAHUNAN_" + year, target);
    
    return JSON.stringify({ status: "success", message: "Target tahun " + year + " berhasil disimpan!" });
  } catch (e) {
    return JSON.stringify({ status: "error", error: e.toString() });
  }
}

/**
 * =========================================================================
 * AI MARKETING INTELLIGENCE ENGINE — v3.0
 * Checkpoint 12: Zero Cafe Workspace
 * =========================================================================
 * Membaca pola dari data historis SPV (Daily, Weekly, Monthly, Kebersihan,
 * Produk) dan menghasilkan insight action-oriented untuk Dasbor GM.
 */
function api_gm_getMarketingInsights(payloadStr) {
  try {
    var payload = JSON.parse(payloadStr);
    var startDate = payload.startDate; // YYYY-MM-DD
    var endDate = payload.endDate;
    var outlet = payload.outlet || "Semua";
    var benchmarkATS = Number(payload.benchmarkATS || 30000);

    var ss = getSpreadsheet();
    var insights = [];

    // ─────────────────────────────────────────────────────────────────
    // HELPER: Normalisasi tanggal ke YYYY-MM-DD (DD-MM-YYYY atau Date obj)
    // ─────────────────────────────────────────────────────────────────
    function normDate(raw) {
      if (!raw) return "";
      if (raw instanceof Date) {
        var m = raw.getMonth() + 1;
        var d = raw.getDate();
        return raw.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
      }
      var str = raw.toString().trim();
      var p = str.split("-");
      if (p.length === 3) {
        if (p[2].length === 4) return p[2] + "-" + p[1] + "-" + p[0]; // DD-MM-YYYY
        if (p[0].length === 4) return str; // YYYY-MM-DD
      }
      return "";
    }

    function outletMatch(rowOutlet) {
      return !outlet || outlet === "Semua" || rowOutlet === outlet;
    }

    // ─────────────────────────────────────────────────────────────────
    // MODUL C1: Tren Omset Mingguan
    // Baca Weekly sheet, bandingkan total sales per minggu dalam rentang
    // ─────────────────────────────────────────────────────────────────
    var weeklySheet = ss.getSheetByName("Weekly");
    var weeklyInsight = { modul: "Tren Omset Mingguan", status: "insufficient", level: "info", title: "", desc: "", action: "" };

    if (weeklySheet) {
      var wData = weeklySheet.getDataRange().getValues();
      var weeklySales = []; // array { periode, sales }

      for (var i = 1; i < wData.length; i++) {
        var periodeStr = wData[i][0].toString();
        var rowOut = wData[i][2].toString();
        var wSales = Number(wData[i][3] || 0);

        // Cek apakah periode minggu ini masuk dalam rentang filter
        // Format periode: "YYYY-MM-DD s/d YYYY-MM-DD" atau "DD-MM-YYYY s/d DD-MM-YYYY"
        var periodeStart = "";
        if (periodeStr.indexOf("s/d") !== -1) {
          periodeStart = normDate(periodeStr.split("s/d")[0].trim());
        }
        if (!periodeStart) continue;
        if (periodeStart < startDate || periodeStart > endDate) continue;
        if (!outletMatch(rowOut)) continue;

        weeklySales.push({ periode: periodeStart, sales: wSales });
      }

      weeklySales.sort(function(a, b) { return a.periode.localeCompare(b.periode); });

      if (weeklySales.length < 3) {
        weeklyInsight.status = "insufficient";
        weeklyInsight.desc = "Dibutuhkan minimal 3 minggu data Weekly untuk mendeteksi tren.";
      } else {
        var n = weeklySales.length;
        var last = weeklySales[n - 1].sales;
        var prev = weeklySales[n - 2].sales;
        var prev2 = weeklySales[n - 3].sales;

        var isNaik3 = last > prev && prev > prev2;
        var isTurun2 = last < prev && prev < prev2;
        var isTurun3 = last < prev && prev < prev2;
        var growthPct = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;

        weeklyInsight.status = "ok";
        if (isNaik3) {
          weeklyInsight.level = "positive";
          weeklyInsight.title = "Tren Naik 3 Minggu Berturut";
          weeklyInsight.desc = "Omset konsisten naik selama 3 minggu terakhir (" + (growthPct > 0 ? "+" : "") + growthPct + "% minggu ini). Momentum ini sangat ideal untuk memperkenalkan menu baru atau program bundling.";
          weeklyInsight.action = "Manfaatkan momentum: luncurkan 1 promo baru minggu ini saat traffic sedang tinggi.";
        } else if (isTurun2) {
          weeklyInsight.level = "critical";
          weeklyInsight.title = "Tren Turun 2–3 Minggu Berturut";
          weeklyInsight.desc = "Omset turun " + Math.abs(growthPct) + "% dan sudah berlangsung lebih dari 2 minggu. Ini bukan fluktuasi biasa — ada sesuatu yang sistemik.";
          weeklyInsight.action = "Tindakan segera: evaluasi apakah ada kompetitor baru, perubahan jam ramai, atau penurunan kualitas layanan.";
        } else if (Math.abs(growthPct) < 5) {
          weeklyInsight.level = "warning";
          weeklyInsight.title = "Omset Stagnan (Flat)";
          weeklyInsight.desc = "Perubahan omset minggu ini sangat kecil (" + growthPct + "%). Bisnis tidak tumbuh dan tidak turun — tapi stagnansi adalah sinyal bahaya jangka panjang.";
          weeklyInsight.action = "Coba strategi baru: promo limited-time, konten sosmed, atau bundling produk yang kurang laris.";
        } else {
          weeklyInsight.level = "info";
          weeklyInsight.title = "Omset Fluktuatif Normal";
          weeklyInsight.desc = "Omset bergerak " + (growthPct > 0 ? "naik" : "turun") + " " + Math.abs(growthPct) + "% minggu ini. Fluktuasi masih dalam batas wajar.";
          weeklyInsight.action = "Pantau tren 2–3 minggu ke depan untuk deteksi pola lebih kuat.";
        }
      }
    }
    insights.push(weeklyInsight);

    // ─────────────────────────────────────────────────────────────────
    // MODUL C2: Dead Menu / Hero Product
    // Baca Database_Produk, hitung konsistensi top/bottom per produk
    // ─────────────────────────────────────────────────────────────────
    var produkSheet = ss.getSheetByName("Database_Produk");
    var produkInsight = { modul: "Analisis Menu", status: "insufficient", level: "info", title: "", desc: "", action: "" };

    if (produkSheet) {
      var pData = produkSheet.getDataRange().getValues();
      var bottomCount = {}; // { nama: count }
      var topCount = {};
      var totalWeeks = 0;
      var seenWeeks = {};

      for (var i = 1; i < pData.length; i++) {
        var rowDate = normDate(pData[i][0]);
        var rowOut = pData[i][2].toString();
        var peringkat = pData[i][4].toString();
        var nama = pData[i][5].toString();

        if (!rowDate || rowDate < startDate || rowDate > endDate) continue;
        if (!outletMatch(rowOut)) continue;
        if (!nama) continue;

        if (!seenWeeks[rowDate]) { seenWeeks[rowDate] = true; totalWeeks++; }

        if (peringkat === "Bottom") {
          bottomCount[nama] = (bottomCount[nama] || 0) + 1;
        } else if (peringkat === "Top") {
          topCount[nama] = (topCount[nama] || 0) + 1;
        }
      }

      var weekThreshold = Math.max(2, Math.floor(totalWeeks * 0.6)); // 60% dari periode

      var deadMenus = [];
      for (var nm in bottomCount) {
        if (bottomCount[nm] >= weekThreshold) deadMenus.push({ nama: nm, count: bottomCount[nm] });
      }
      var heroMenus = [];
      for (var nm in topCount) {
        if (topCount[nm] >= weekThreshold) heroMenus.push({ nama: nm, count: topCount[nm] });
      }

      produkInsight.status = totalWeeks < 4 ? "insufficient" : "ok";
      if (produkInsight.status === "insufficient") {
        produkInsight.desc = "Dibutuhkan minimal 4 minggu data produk untuk mendeteksi pola konsisten.";
      } else if (deadMenus.length > 0 && heroMenus.length > 0) {
        produkInsight.level = "warning";
        produkInsight.title = "Produk Mati & Produk Andalan Terdeteksi";
        produkInsight.desc = "MATI: " + deadMenus.map(function(x){ return x.nama; }).join(", ") + ". ANDALAN: " + heroMenus.map(function(x){ return x.nama; }).join(", ") + ".";
        produkInsight.action = "Pertimbangkan discontinue produk mati atau rebranding. Pastikan stok produk andalan tidak pernah habis.";
      } else if (deadMenus.length > 0) {
        produkInsight.level = "critical";
        produkInsight.title = "Dead Menu Alert: " + deadMenus.length + " Produk Tidak Bergerak";
        produkInsight.desc = "Produk yang konsisten di Bottom: " + deadMenus.map(function(x){ return x.nama + " (" + x.count + "x)"; }).join(", ") + ". Ini membuang slot menu dan stok bahan baku.";
        produkInsight.action = "Evaluasi menu ini: discontinue, ganti resep, atau bundling dengan produk lain agar lebih menarik.";
      } else if (heroMenus.length > 0) {
        produkInsight.level = "positive";
        produkInsight.title = "Hero Product: " + heroMenus.map(function(x){ return x.nama; }).join(", ");
        produkInsight.desc = "Produk ini konsisten jadi terlaris. Mesin pendapatan kafe Anda yang sesungguhnya.";
        produkInsight.action = "Jadikan produk ini focal point promosi. Pastikan bahannya selalu tersedia dan barista mahir membuatnya.";
      } else {
        produkInsight.level = "info";
        produkInsight.title = "Penjualan Produk Seimbang";
        produkInsight.desc = "Tidak ada produk yang dominan sebagai terlaris atau terendah secara konsisten. Penjualan relatif merata.";
        produkInsight.action = "Lakukan A/B testing promo pada beberapa produk untuk mulai membentuk 'Hero Product'.";
      }
    }
    insights.push(produkInsight);

    // ─────────────────────────────────────────────────────────────────
    // MODUL C3: Korelasi Kebersihan × Omset
    // ─────────────────────────────────────────────────────────────────
    var dailySheet = ss.getSheetByName("Daily");
    var kbSheet2 = ss.getSheetByName("Database_Kebersihan");
    var hygieneInsight = { modul: "Korelasi Kebersihan & Omset", status: "insufficient", level: "info", title: "", desc: "", action: "" };

    if (dailySheet && kbSheet2) {
      // Hitung omset rata-rata harian dalam periode
      var dData = dailySheet.getDataRange().getValues();
      var totalOmset = 0, omsetCount = 0;
      var targetTotal = 0;
      for (var i = 1; i < dData.length; i++) {
        var rd = normDate(dData[i][0]);
        if (!rd || rd < startDate || rd > endDate) continue;
        if (!outletMatch(dData[i][2].toString())) continue;
        totalOmset += Number(dData[i][4] || 0);
        targetTotal += Number(dData[i][8] || 0);
        omsetCount++;
      }

      // Hitung skor kebersihan rata-rata
      var kbData2 = kbSheet2.getDataRange().getValues();
      var kbTotal = 0, kbCount = 0;
      for (var i = 1; i < kbData2.length; i++) {
        var krd = normDate(kbData2[i][0]);
        if (!krd || krd < startDate || krd > endDate) continue;
        if (!outletMatch(kbData2[i][1].toString())) continue;
        kbTotal += Number(kbData2[i][4] || 0);
        kbCount++;
      }

      if (omsetCount < 7 || kbCount < 7) {
        hygieneInsight.status = "insufficient";
        hygieneInsight.desc = "Dibutuhkan minimal 7 hari data harian dan kebersihan untuk korelasi yang valid.";
      } else {
        hygieneInsight.status = "ok";
        var avgOmset = totalOmset / omsetCount;
        var avgTarget = targetTotal / omsetCount;
        var targetPct = avgTarget > 0 ? (avgOmset / avgTarget) * 100 : 0;
        var avgHygiene = kbTotal / kbCount;

        if (targetPct >= 90 && avgHygiene < 70) {
          hygieneInsight.level = "critical";
          hygieneInsight.title = "The Perfect Storm: Ramai tapi Kotor";
          hygieneInsight.desc = "Omset mencapai " + Math.round(targetPct) + "% target namun Hygiene Score hanya " + Math.round(avgHygiene) + "%. Kondisi ini berbahaya — tamu datang banyak tapi kondisi kafe tidak layak. Satu ulasan negatif viral bisa menghancurkan tren ini.";
          hygieneInsight.action = "Prioritas: tambah jadwal cleaning di jam-jam sibuk. Evaluasi apakah perlu tenaga kebersihan tambahan.";
        } else if (targetPct < 70 && avgHygiene < 70) {
          hygieneInsight.level = "critical";
          hygieneInsight.title = "The Lazy Shift: Sepi dan Kotor";
          hygieneInsight.desc = "Omset hanya " + Math.round(targetPct) + "% dari target dan Hygiene Score " + Math.round(avgHygiene) + "%. Kafe sepi, bukan alasan untuk dibiarkan kotor — ini sinyal kuat kemalasan atau kurang disiplin tim.";
          hygieneInsight.action = "Lakukan sidak mendadak. Pertimbangkan evaluasi kinerja tim dan revisi SOP kebersihan.";
        } else if (avgHygiene >= 90 && targetPct >= 85) {
          hygieneInsight.level = "positive";
          hygieneInsight.title = "The Good Standard: Performa Ideal";
          hygieneInsight.desc = "Omset " + Math.round(targetPct) + "% dari target dengan Hygiene Score " + Math.round(avgHygiene) + "%. Standar operasional terjaga dengan sangat baik. Tim lapangan memberikan kinerja terbaik.";
          hygieneInsight.action = "Pertahankan standar ini. Dokumentasikan sebagai benchmark untuk outlet lain.";
        } else if (avgHygiene < 80) {
          hygieneInsight.level = "warning";
          hygieneInsight.title = "Hygiene Score di Bawah Standar";
          hygieneInsight.desc = "Kebersihan rata-rata " + Math.round(avgHygiene) + "% — belum mencapai standar ideal (>80%). Risiko komplain tamu meningkat.";
          hygieneInsight.action = "Review checklist kebersihan. Pastikan SPV mengaudit setiap shift, bukan hanya pagi.";
        } else {
          hygieneInsight.level = "info";
          hygieneInsight.title = "Operasional Normal";
          hygieneInsight.desc = "Omset " + Math.round(targetPct) + "% target, Hygiene " + Math.round(avgHygiene) + "%. Tidak ada korelasi anomali yang perlu diwaspadai.";
          hygieneInsight.action = "Pantau tren kebersihan tiap minggu untuk mencegah degradasi bertahap.";
        }
      }
    }
    insights.push(hygieneInsight);

    // ─────────────────────────────────────────────────────────────────
    // MODUL C4: SDM & Risiko Operasional
    // Baca Monthly sheet untuk tren telat dan resign
    // ─────────────────────────────────────────────────────────────────
    var monthlySheet2 = ss.getSheetByName("Monthly");
    var sdmInsight = { modul: "SDM & Risiko Operasional", status: "insufficient", level: "info", title: "", desc: "", action: "" };

    if (monthlySheet2) {
      var mData = monthlySheet2.getDataRange().getValues();
      var sdmRows = [];

      for (var i = 1; i < mData.length; i++) {
        var rowOut = mData[i][2].toString();
        if (!outletMatch(rowOut)) continue;
        // Col: [0]Bulan [9]Telat [10]Teguran [18]Resign [21]Komplain
        sdmRows.push({
          bulan: mData[i][0].toString(),
          telat: Number(mData[i][9] || 0),
          teguran: Number(mData[i][10] || 0),
          resign: Number(mData[i][18] || 0),
          komplain: Number(mData[i][21] || 0)
        });
      }

      sdmRows.sort(function(a, b) { return a.bulan.localeCompare(b.bulan); });

      if (sdmRows.length < 1) {
        sdmInsight.status = "insufficient";
        sdmInsight.desc = "Dibutuhkan minimal 1 Laporan Bulanan untuk analisis SDM.";
      } else {
        sdmInsight.status = "ok";
        var latest = sdmRows[sdmRows.length - 1];
        var issues = [];

        if (latest.resign > 0 && latest.komplain > 5) {
          sdmInsight.level = "critical";
          sdmInsight.title = "Sinyal Bahaya: Resign + Komplain Naik Bersamaan";
          sdmInsight.desc = latest.resign + " staf resign bulan ini dan komplain mencapai " + latest.komplain + " kasus. Kemungkinan besar kualitas layanan turun karena kekosongan SDM.";
          sdmInsight.action = "Prioritas rekrutmen pengganti. Bagi tugas tim sisa secara merata dan awasi kualitas layanan ekstra ketat.";
        } else if (latest.telat >= 5) {
          sdmInsight.level = "warning";
          sdmInsight.title = "Keterlambatan Staf Tinggi: " + latest.telat + " Kali";
          sdmInsight.desc = "Jumlah keterlambatan " + latest.telat + " kali bulan ini melebihi batas toleransi. Ini biasanya sinyal jadwal shift tidak cocok atau masalah motivasi.";
          sdmInsight.action = "Evaluasi jadwal shift. Pertimbangkan reward/punishment berbasis kehadiran yang lebih ketat.";
        } else if (latest.teguran >= 3) {
          sdmInsight.level = "warning";
          sdmInsight.title = latest.teguran + " Teguran (SP) Bulan Ini";
          sdmInsight.desc = "Jumlah SP (Surat Peringatan) yang dikeluarkan cukup tinggi. Jika ini berlanjut, ada risiko turnover yang tidak direncanakan.";
          sdmInsight.action = "Review penyebab utama SP. Apakah ada pola berulang dari staf yang sama?";
        } else {
          sdmInsight.level = "positive";
          sdmInsight.title = "Tim Stabil & Disiplin";
          sdmInsight.desc = "Telat: " + latest.telat + ", Teguran: " + latest.teguran + ", Resign: " + latest.resign + ". Tidak ada indikator risiko SDM yang mengkhawatirkan.";
          sdmInsight.action = "Pertahankan budaya kerja positif. Pertimbangkan program apresiasi (Employee of the Month).";
        }
      }
    }
    insights.push(sdmInsight);

    // ─────────────────────────────────────────────────────────────────
    // MODUL C5: Benchmarking ATS (Average Ticket Size)
    // Bandingkan ATS aktual dengan benchmark yang di-set GM
    // ─────────────────────────────────────────────────────────────────
    var atsInsight = { modul: "Benchmarking ATS Industri", status: "insufficient", level: "info", title: "", desc: "", action: "" };
    
    var savedBenchmark = PropertiesService.getScriptProperties().getProperty("GM_BENCHMARK_ATS");
    var effectiveBenchmark = savedBenchmark ? Number(savedBenchmark) : benchmarkATS;

    if (dailySheet) {
      var dData2 = dailySheet.getDataRange().getValues();
      var totalOmsetATS = 0, totalTransATS = 0;
      for (var i = 1; i < dData2.length; i++) {
        var rd = normDate(dData2[i][0]);
        if (!rd || rd < startDate || rd > endDate) continue;
        if (!outletMatch(dData2[i][2].toString())) continue;
        totalOmsetATS += Number(dData2[i][4] || 0);
        totalTransATS += Number(dData2[i][9] || 0);
      }

      if (totalTransATS < 50) {
        atsInsight.status = "insufficient";
        atsInsight.desc = "Dibutuhkan minimal 50 transaksi untuk kalkulasi ATS yang representatif.";
      } else {
        atsInsight.status = "ok";
        var actualATS = Math.round(totalOmsetATS / totalTransATS);
        var atsDiff = actualATS - effectiveBenchmark;
        var atsPct = effectiveBenchmark > 0 ? Math.round((atsDiff / effectiveBenchmark) * 100) : 0;

        if (actualATS < effectiveBenchmark * 0.8) {
          atsInsight.level = "critical";
          atsInsight.title = "ATS Jauh di Bawah Benchmark (" + atsPct + "%)";
          atsInsight.desc = "ATS aktual Rp " + actualATS.toLocaleString("id-ID") + " vs benchmark Rp " + effectiveBenchmark.toLocaleString("id-ID") + ". Pelanggan rata-rata menghabiskan jauh lebih sedikit dari potensinya.";
          atsInsight.action = "Latih staf untuk upselling: tawarkan paket minuman + snack, size upgrade, atau add-on topping kepada setiap pelanggan.";
        } else if (actualATS < effectiveBenchmark) {
          atsInsight.level = "warning";
          atsInsight.title = "ATS Masih di Bawah Benchmark (" + atsPct + "%)";
          atsInsight.desc = "ATS Rp " + actualATS.toLocaleString("id-ID") + " — belum mencapai benchmark industri Rp " + effectiveBenchmark.toLocaleString("id-ID") + ". Ada ruang untuk meningkatkan nilai transaksi per pelanggan.";
          atsInsight.action = "Coba strategi bundling: 'minuman + snack dengan harga spesial'. Tampilkan di papan menu dengan visual menarik.";
        } else {
          atsInsight.level = "positive";
          atsInsight.title = "ATS di Atas Benchmark (+" + atsPct + "%)";
          atsInsight.desc = "ATS Rp " + actualATS.toLocaleString("id-ID") + " — melampaui benchmark industri Rp " + effectiveBenchmark.toLocaleString("id-ID") + ". Pelanggan rela menghabiskan lebih banyak di kafe ini.";
          atsInsight.action = "Pertahankan strategi pricing dan upselling yang sudah berjalan. Coba naikkan benchmark untuk mendorong pertumbuhan lebih jauh.";
        }
      }
    }
    insights.push(atsInsight);

    // ─────────────────────────────────────────────────────────────────
    // Hitung ringkasan: berapa kritis, peringatan, positif
    // ─────────────────────────────────────────────────────────────────
    var summary = { critical: 0, warning: 0, positive: 0, insufficient: 0 };
    insights.forEach(function(ins) {
      if (ins.status === "insufficient") summary.insufficient++;
      else if (ins.level === "critical") summary.critical++;
      else if (ins.level === "warning") summary.warning++;
      else if (ins.level === "positive") summary.positive++;
    });

    return JSON.stringify({
      status: "success",
      summary: summary,
      insights: insights,
      benchmarkATS: effectiveBenchmark
    });

  } catch (e) {
    Logger.log("Error in api_gm_getMarketingInsights: " + e.toString());
    return JSON.stringify({ status: "error", error: e.toString() });
  }
}

/**
 * Simpan benchmark ATS yang dikonfigurasi GM
 */
function api_gm_saveBenchmarkATS(newATS) {
  try {
    PropertiesService.getScriptProperties().setProperty("GM_BENCHMARK_ATS", newATS.toString());
    return JSON.stringify({ status: "success" });
  } catch(e) {
    return JSON.stringify({ status: "error", error: e.toString() });
  }
}

/**
 * Simpan Target Omset Bulanan per Outlet ke Config_Target
 */
function api_saveConfigTarget(bulanTahun, outlet, targetOmset) {
  try {
    var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID"));
    var sheet = ss.getSheetByName("Config_Target");
    if (!sheet) {
      sheet = ss.insertSheet("Config_Target");
      sheet.appendRow(["Bulan", "Tahun", "Outlet", "Target Omset"]);
    }
    
    var data = sheet.getDataRange().getValues();
    var tahun = bulanTahun.split("-")[1] || new Date().getFullYear().toString();
    
    // Check if exists
    var found = false;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString() === bulanTahun && data[i][2].toString() === outlet) {
        sheet.getRange(i + 1, 4).setValue(Number(targetOmset));
        found = true;
        break;
      }
    }
    
    if (!found) {
      sheet.appendRow([bulanTahun, tahun, outlet, Number(targetOmset)]);
    }
    
    return JSON.stringify({ status: "success" });
  } catch (e) {
    Logger.log("Error in api_saveConfigTarget: " + e.toString());
    return JSON.stringify({ status: "error", error: e.toString() });
  }
}

/**
 * Get Target Bulanan for a specific outlet
 */
function api_getTargetBulanan(outlet, monthYear) {
  try {
    var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID"));
    var sheet = ss.getSheetByName("Config_Target");
    if (!sheet) return JSON.stringify({ status: "success", target: 0 });
    
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0].toString() === monthYear && data[i][2].toString() === outlet) {
        return JSON.stringify({ status: "success", target: Number(data[i][3]) });
      }
    }
    return JSON.stringify({ status: "success", target: 0 });
  } catch (e) {
    return JSON.stringify({ status: "error", error: e.toString() });
  }
}

/**
 * Migration Script: Setup multi-outlet sheets (Run once by GM)
 */
function setup_MultiOutletSheets() {
  var ss = getSpreadsheet();
  var outlets = ["Perintis", "Dg Tata"];
  var baseSheets = ["Daily", "Weekly", "Monthly"]; // Opsional: MasterStaff, dll.
  
  for (var i = 0; i < baseSheets.length; i++) {
    var baseSheet = ss.getSheetByName(baseSheets[i]);
    if (baseSheet) {
      for (var j = 0; j < outlets.length; j++) {
        var newSheetName = baseSheets[i] + "_" + outlets[j];
        var newSheet = ss.getSheetByName(newSheetName);
        if (!newSheet) {
          // Buat sheet baru
          newSheet = ss.insertSheet(newSheetName);
          // Copy header
          var lastCol = baseSheet.getLastColumn();
          if (lastCol > 0) {
            var headers = baseSheet.getRange(1, 1, 1, lastCol).getValues();
            newSheet.getRange(1, 1, 1, lastCol).setValues(headers);
            newSheet.getRange(1, 1, 1, lastCol).setFontWeight("bold");
          }
          Logger.log("Created: " + newSheetName);
        } else {
          Logger.log("Already exists: " + newSheetName);
        }
      }
    }
  }
  return "Setup Multi-Outlet Sheets Complete!";
}
