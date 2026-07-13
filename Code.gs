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
function hardResetDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  
  // 1. Buat sheet sementara agar Spreadsheet tidak error (minimal harus ada 1 sheet)
  var tempSheet = ss.insertSheet("TEMP_WIPE_" + new Date().getTime());
  
  // 2. Hapus seluruh sheet lama
  for (var i = 0; i < sheets.length; i++) {
    ss.deleteSheet(sheets[i]);
  }
  
  // Script akan berhenti di sini untuk Tahap 1.
  SpreadsheetApp.getUi().alert("Hard Reset Berhasil", "Seluruh sheet lama telah dihapus. Hanya tersisa sheet sementara. Silakan jalankan 'Build New Architecture' untuk membuat sheet baru.", SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Tahap 2: Re-build 9 Sheet Architecture
 */
function buildNewArchitecture() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssId = ss.getId();
  
  // 1. Transactional Sheets (Daily)
  setupSheet(ss, "DB_Laporan_Harian", [
    "ID_Laporan", "Tanggal", "Bulan_Laporan", "Outlet", "Supervisor", "Cuaca", 
    "Omset_Total", "Target_Omset", "Total_Transaksi", "Kendala_Operasional", "Rekomendasi", "URL_PDF"
  ]);
  
  setupSheet(ss, "DB_Briefing_Shift", [
    "ID_Laporan", "Target_Harian", "Fokus_Briefing", "Kendala_Sebelumnya", "Solusi_Eksekusi"
  ]);
  
  setupSheet(ss, "DB_Kehadiran_Staf", [
    "ID_Laporan", "Nama_Staf", "Posisi", "Outlet_Tugas", "Outlet_Asal", 
    "Status_Kehadiran", "SOP_Keramahan_Miss", "Catatan_Kinerja"
  ]);
  
  setupSheet(ss, "DB_Audit_Kas", [
    "ID_Laporan", "Waktu_Audit", "Kasir_Bertugas", "Modal_Awal", 
    "Total_QRIS", "Total_Tunai", "Aktual_Sistem", "Selisih", "Keterangan"
  ]);
  
  setupSheet(ss, "DB_Kinerja_Produk", [
    "ID_Laporan", "Kategori", "Peringkat", "Nama_Produk", "Qty_Terjual", "Keterangan_Promo"
  ]);
  
  setupSheet(ss, "DB_Inspeksi_Operasional", [
    "ID_Laporan", "Tipe_Inspeksi", "Objek_Dicek", "Skor_Kondisi", "Estimasi_Biaya", "Tindakan_Catatan"
  ]);
  
  // 2. Evaluasi & Agregasi Sheets (Weekly & Monthly)
  setupSheet(ss, "DB_Laporan_Mingguan", [
    "ID_Laporan_Mingguan", "Periode_Tanggal", "Outlet", "Supervisor", 
    "Omset_Aktual", "Omset_Target", "Komplain_Utama", "URL_PDF"
  ]);
  
  setupSheet(ss, "DB_Laporan_Bulanan", [
    "ID_Laporan_Bulanan", "Bulan_Laporan", "Outlet", "Supervisor", 
    "Omset_Aktual", "Omset_Target", "Persen_Tercapai", "Rating_Kerja", 
    "Kepatuhan_SOP", "Total_Telat", "Pencapaian", "Tantangan", "Total_Pengeluaran_Ekstra",
    "Total_Turnover", "Strategi_Bulan_Depan", "Kebutuhan_Approval_GM", "URL_PDF"
  ]);
  
  setupSheet(ss, "DB_Evaluasi_Staf", [
    "ID_Laporan_Evaluasi", "Nama_Staf", "Posisi", "Outlet", "Status_Evaluasi", "Catatan_Kinerja"
  ]);
  
  // 3. Master Data
  var masterStaff = setupSheet(ss, "Master_Staff", [
    "ID_Staff", "Nama", "Posisi", "Status_Aktif", "Outlet_Utama"
  ]);
  if (masterStaff.getLastRow() <= 1) {
    masterStaff.appendRow(["STF-001", "Nathan", "Supervisor", "Aktif", "Perintis"]);
    masterStaff.appendRow(["STF-002", "Sela", "Supervisor", "Aktif", "Dg Tata"]);
    masterStaff.appendRow(["STF-003", "Eko", "Barista", "Aktif", "Perintis"]);
    masterStaff.appendRow(["STF-004", "Amel", "Kasir", "Aktif", "Perintis"]);
    masterStaff.appendRow(["STF-005", "Budi", "Barista", "Aktif", "Dg Tata"]);
    masterStaff.appendRow(["STF-006", "Siti", "Kasir", "Aktif", "Dg Tata"]);
    masterStaff.appendRow(["STF-007", "Anton", "Server", "Aktif", "Dg Tata"]);
  }
  
  var masterProduk = setupSheet(ss, "Master_Produk", [
    "ID_Menu", "Kategori", "Nama_Menu", "Harga_Jual", "Status"
  ]);
  if (masterProduk.getLastRow() <= 1) {
    masterProduk.appendRow(["MNU-001", "Minuman", "Kopi Susu Zero", 18000, "Aktif"]);
    masterProduk.appendRow(["MNU-002", "Minuman", "Americano", 15000, "Aktif"]);
    masterProduk.appendRow(["MNU-003", "Makanan", "Nasi Goreng Spesial", 25000, "Aktif"]);
    masterProduk.appendRow(["MNU-004", "Snack", "Kentang Goreng", 15000, "Aktif"]);
  }
  
  // 4. Drive Folder Init
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("SPREADSHEET_ID", ssId);
  var rootFolderId = "1S6qbhiWtyPri63fK4caO2gXz1ZJ0yNqa";
  var rootFolder;
  try {
    rootFolder = DriveApp.getFolderById(rootFolderId);
  } catch(e) {
    var folderName = "Zero Cafe Workspace Drive";
    var folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      rootFolder = folders.next();
    } else {
      rootFolder = DriveApp.createFolder(folderName);
    }
  }
  scriptProperties.setProperty("ROOT_FOLDER_ID", rootFolder.getId());

  // 5. Delete Temporary Sheets created by hardResetDatabase
  var allSheets = ss.getSheets();
  for (var i = 0; i < allSheets.length; i++) {
    var sName = allSheets[i].getName();
    if (sName.indexOf("TEMP_WIPE_") === 0) {
      ss.deleteSheet(allSheets[i]);
    }
  }
  
  SpreadsheetApp.getUi().alert("Re-build Berhasil", "Sistem berhasil membangun 9 Sheet baru sesuai arsitektur PRD.", SpreadsheetApp.getUi().ButtonSet.OK);
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
  var found = [];
  var baseSheet = ss.getSheetByName(baseName);
  if (baseSheet) {
    found.push(baseSheet);
  }
  return found;
}

/**
 * Helper to get all data rows from all outlet sheets for a specific report type.
 * Returns an array of rows (including a dummy header at index 0 to match existing 1-indexed loops).
 */
function getAggregatedData(ss, baseName) {
  var sheets = getAllOutletSheets(ss, baseName);
  var allData = [ [] ]; // Dummy header at index 0
  for (var s = 0; s < sheets.length; s++) {
    var data = sheets[s].getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      allData.push(data[i]);
    }
  }
  return allData;
}

/**
 * Parses a date string (DD-MM-YYYY or YYYY-MM-DD) or Date object into a JS Date object.
 */
function parseDateToObj(d) {
  if (!d) return null;
  if (d instanceof Date) return d;
  var str = d.toString().trim();
  var parts = str.split("-");
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      // DD-MM-YYYY
      return new Date(parts[2], parseInt(parts[1], 10) - 1, parts[0]);
    } else if (parts[0].length === 4) {
      // YYYY-MM-DD
      return new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
    }
  }
  var parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Helper to match outlet names in a case-insensitive, space-trimmed, dot-and-underscore resilient way.
 */
function matchesOutlet(rowOutlet, filter) {
  if (!filter || filter === "Semua") return true;
  if (!rowOutlet) return false;
  var cleanRow = rowOutlet.toString().trim().toLowerCase().replace(/[\._\s]+/g, '');
  var cleanFilter = filter.toString().trim().toLowerCase().replace(/[\._\s]+/g, '');
  return cleanRow === cleanFilter;
}

function getStaffFromRow(row, headers, rowIndex) {
  if (!row || !headers) {
    return { id: "STF-" + rowIndex, nama: "", posisi: "", status: "Aktif", outlet: "" };
  }
  
  var lowerHeaders = headers.map(function(h) {
    return h ? h.toString().toLowerCase().trim() : "";
  });
  
  var idIdx = -1;
  var namaIdx = -1;
  var posisiIdx = -1;
  var statusIdx = -1;
  var outletIdx = -1;
  
  for (var k = 0; k < lowerHeaders.length; k++) {
    var h = lowerHeaders[k];
    if (h === "id") {
      idIdx = k;
    } else if (h.indexOf("nama") !== -1) {
      namaIdx = k;
    } else if (h.indexOf("posisi") !== -1 || h.indexOf("jabatan") !== -1) {
      posisiIdx = k;
    } else if (h.indexOf("status") !== -1) {
      statusIdx = k;
    } else if (h.indexOf("outlet") !== -1) {
      outletIdx = k;
    }
  }
  
  // Fallbacks if not found (using standard indices of Zero Cafe MasterStaff)
  if (namaIdx === -1 && row.length > 0) {
    namaIdx = row.length > 1 ? 1 : 0;
  }
  if (posisiIdx === -1 && row.length > 1) {
    posisiIdx = row.length > 2 ? 2 : 1;
  }
  if (statusIdx === -1 && row.length > 2) {
    statusIdx = row.length > 3 ? 3 : -1;
  }
  if (outletIdx === -1 && row.length > 3) {
    outletIdx = row.length > 4 ? 4 : -1;
  }
  
  var name = (namaIdx !== -1 && namaIdx < row.length && row[namaIdx] !== undefined) ? row[namaIdx].toString().trim() : "";
  var posisi = (posisiIdx !== -1 && posisiIdx < row.length && row[posisiIdx] !== undefined) ? row[posisiIdx].toString().trim() : "";
  var status = (statusIdx !== -1 && statusIdx < row.length && row[statusIdx] !== undefined && row[statusIdx] !== "") ? row[statusIdx].toString().trim() : "Aktif";
  var outlet = (outletIdx !== -1 && outletIdx < row.length && row[outletIdx] !== undefined) ? row[outletIdx].toString().trim() : "";
  var id = (idIdx !== -1 && idIdx < row.length && row[idIdx] !== undefined && row[idIdx] !== "") ? row[idIdx].toString().trim() : (name || "STF-" + rowIndex);
  
  return {
    id: id,
    nama: name,
    posisi: posisi,
    status: status,
    outlet: outlet
  };
}

/**
 * Fetches the master list of active staff.
 */
function api_getMasterStaff() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Master_Staff");
    if (!sheet) return [];
    
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    var headers = data[0];
    var staffList = [];
    
    for (var i = 1; i < data.length; i++) {
      var staff = getStaffFromRow(data[i], headers, i);
      if (staff.status === "Aktif") {
        staffList.push(staff);
      }
    }
    return staffList;
  } catch (err) {
    Logger.log("Error in api_getMasterStaff: " + err.toString());
    return [];
  }
}

function api_getAllMasterStaff() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Master_Staff");
    if (!sheet) return [];
    
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    var headers = data[0];
    var staffList = [];
    
    for (var i = 1; i < data.length; i++) {
      staffList.push(getStaffFromRow(data[i], headers, i));
    }
    return staffList;
  } catch (err) {
    Logger.log("Error in api_getAllMasterStaff: " + err.toString());
    return [];
  }
}

/**
 * Adds a new master staff record.
 */
function api_addMasterStaff(nama, posisi, outlet) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Master_Staff");
    if (!sheet) {
      sheet = ss.insertSheet("Master_Staff");
      sheet.appendRow(["ID", "Nama", "Posisi", "Status", "Outlet"]);
    }
    
    var id = "STF-" + new Date().getTime();
    var status = "Aktif";
    var outletAsal = outlet || "";
    
    sheet.appendRow([id, nama, posisi, status, outletAsal]);
    
    return {success: true, id: id};
  } catch (err) {
    Logger.log("Error in api_addMasterStaff: " + err.toString());
    return {success: false, error: err.toString()};
  }
}

/**
 * Updates a master staff record.
 */
function api_updateMasterStaff(id, nama, posisi, status, outlet) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Master_Staff");
    if (!sheet) return {success: false, error: "Sheet Master_Staff tidak ditemukan"};
    
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        // Found the row
        var row = i + 1;
        // Col 2: Nama
        sheet.getRange(row, 2).setValue(nama);
        // Col 3: Posisi
        sheet.getRange(row, 3).setValue(posisi);
        // Col 4: Status
        sheet.getRange(row, 4).setValue(status);
        // Col 5: Outlet
        sheet.getRange(row, 5).setValue(outlet);
        
        return {success: true};
      }
    }
    
    return {success: false, error: "Staff dengan ID tersebut tidak ditemukan"};
  } catch (err) {
    Logger.log("Error in api_updateMasterStaff: " + err.toString());
    return {success: false, error: err.toString()};
  }
}

function api_getMasterMenu() {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Master_Produk");
    if (!sheet) return { success: false, data: { minuman: [], makanan: [], snack: [] } };
    
    var data = sheet.getDataRange().getValues();
    var menuData = { minuman: [], makanan: [], snack: [] };
    
    for (var i = 1; i < data.length; i++) {
      var status = (data[i][4] || "").toString().toLowerCase(); // Col E (index 4): Status
      if (status !== "aktif") continue;
      
      var cat = (data[i][1] || "").toString().toLowerCase(); // Col B (index 1): Kategori
      var name = (data[i][2] || "").toString(); // Col C (index 2): Nama Produk
      
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
    var sheet = ss.getSheetByName("Master_Staff");
    if (!sheet) throw new Error("Tab Master_Staff tidak ditemukan.");
    
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
  // [A3] Centralize: selalu gunakan ROOT_FOLDER_ID yang diminta user
  var scriptProperties = PropertiesService.getScriptProperties();
  var rootFolderId = scriptProperties.getProperty("ROOT_FOLDER_ID");
  var rootFolder;
  
  if (rootFolderId) {
    try {
      rootFolder = DriveApp.getFolderById(rootFolderId);
    } catch(e) {
      Logger.log("Folder root tidak valid/dihapus: " + e.toString());
      rootFolderId = null;
    }
  }
  
  if (!rootFolderId) {
    Logger.log("Menggunakan fallback pembuatan folder root.");
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
  var outletFolder = getOrCreateSubFolder(monthFolder, data.outlet || "Perintis");
  
  // A1: Ensure the base subfolders exist for this outlet
  getOrCreateSubFolder(outletFolder, "Checklist Kebersihan");
  getOrCreateSubFolder(outletFolder, "Fasilitas");
  getOrCreateSubFolder(outletFolder, "Pengeluaran");
  
  if (data.type === "daily") {
    return getOrCreateSubFolder(outletFolder, "Daily Reports");
  } else if (data.type === "weekly") {
    return getOrCreateSubFolder(outletFolder, "Laporan Mingguan");
  } else if (data.type === "monthly") {
    return getOrCreateSubFolder(outletFolder, "Laporan Bulanan");
  } else if (data.type === "kebersihan") {
    return getOrCreateSubFolder(outletFolder, "Checklist Kebersihan");
  } else if (data.type === "pengeluaran") {
    return getOrCreateSubFolder(outletFolder, "Pengeluaran");
  } else if (data.type === "fasilitas") {
    return getOrCreateSubFolder(outletFolder, "Fasilitas");
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
    
    // ANTI DOUBLE-SUBMIT LOCK
    var cache = PropertiesService.getScriptProperties();
    var lockKey = "LOCK_" + data.type + "_" + (data.fase || 0) + "_" + (data.outlet || "Unknown") + "_" + data.tanggal;
    var isLocked = cache.getProperty(lockKey);
    var now = new Date().getTime();
    
    if (isLocked) {
      var lockTime = parseInt(isLocked);
      if (now - lockTime < 10000) { // 10 seconds lock
        return { success: false, isDuplicate: true, message: "Pengiriman terlalu cepat (Spam klik). Laporan sedang diproses." };
      }
    }
    // Set lock
    cache.setProperty(lockKey, now.toString());

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
      var sheet = ss.getSheetByName("DB_Laporan_Harian");
      var draftFileId = "";
      if (sheet && data.rowIdx) {
        // Ambil File ID yang kita simpan di Kolom 12 (URL_PDF) saat submit Fase 1
        draftFileId = sheet.getRange(data.rowIdx, 12).getValue();
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
                var rowStatus = allData[i][5] ? allData[i][5].toString() : "";
                var rowOutlet = allData[i][3] ? allData[i][3].toString() : "";
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
      // Find or create "Checklist Kebersihan" folder inside the current OUTLET folder
      var kbFolder;
      var parentOutletFolder = (data.type === "daily" && folder.getParents().hasNext()) ? folder.getParents().next() : folder;
      var kbFolders = parentOutletFolder.getFoldersByName("Checklist Kebersihan");
      if (kbFolders.hasNext()) {
        kbFolder = kbFolders.next();
      } else {
        kbFolder = parentOutletFolder.createFolder("Checklist Kebersihan");
      }
      kbFolder.createFile(kbPdfBlob);
    }
    
    // 4. Append row to corresponding Sheet tab
    if (data.type === "daily") {
      var idLaporan = data.tanggal + "-" + (data.outlet || "Perintis").replace(/\s+/g, "_");
      var bulanLaporan = String(data.tanggal).substring(3, 10); // from DD-MM-YYYY
      var sheetUtama = ss.getSheetByName("DB_Laporan_Harian");
      
      if (isFase2) {
        // FASE 2: Update baris yang sudah ada
        if (sheetUtama) {
          var allData = sheetUtama.getDataRange().getValues();
          for (var r = 1; r < allData.length; r++) {
            if (allData[r][0] === idLaporan) {
              var totalOmset = Number(data.penjualan.shift1 || 0) + Number(data.penjualan.shift2 || 0);
              sheetUtama.getRange(r + 1, 7).setValue(totalOmset); // Col G
              sheetUtama.getRange(r + 1, 9).setValue(Number(data.penjualan.transaksi || 0)); // Col I
              sheetUtama.getRange(r + 1, 12).setValue(fileUrl);    // Col L
              break;
            }
          }
        }
        return { success: true, url: fileUrl };
      }
      
      // [A1] Anti-Duplikat: cek kombinasi ID Laporan
      var existingData = sheetUtama.getDataRange().getValues();
      for (var di = 1; di < existingData.length; di++) {
        if (existingData[di][0].toString() === idLaporan) {
          return {
            success: false,
            isDuplicate: true,
            message: "Laporan harian " + idLaporan + " sudah pernah dikirim. Pengiriman ganda dicegah!"
          };
        }
      }
      
      // Insert DB_Laporan_Harian
      sheetUtama.appendRow([
        idLaporan, data.tanggal, bulanLaporan, data.outlet, data.supervisor, data.cuaca || "",
        Number(data.penjualan.shift1 || 0) + Number(data.penjualan.shift2 || 0),
        Number(data.penjualan.target || 0),
        Number(data.penjualan.transaksi || 0),
        data.penutup.kendala || "",
        data.penutup.saran || "",
        fileUrl
      ]);
      
      // Insert DB_Briefing_Shift
      if (data.evaluasiShift) {
        var bsSheet = ss.getSheetByName("DB_Briefing_Shift");
        if (bsSheet) bsSheet.appendRow([
          idLaporan, data.evaluasiShift.target || "", data.evaluasiShift.fokus || "", 
          data.evaluasiShift.masalah || "", data.evaluasiShift.solusi || ""
        ]);
      }
      
      // Insert DB_Kehadiran_Staf
      if (data.staff && data.staff.length > 0) {
        var ksSheet = ss.getSheetByName("DB_Kehadiran_Staf");
        data.staff.forEach(function(s) {
          var outletAsal = s.outletAsal || data.outlet;
          if (ksSheet) ksSheet.appendRow([
            idLaporan, s.nama, s.posisi, data.outlet, outletAsal, 
            s.status, s.keramahan ? "YA" : "TIDAK", s.keterangan || ""
          ]);
        });
      }
      
      // Insert DB_Audit_Kas
      if (data.kas && data.kas.audit && data.kas.audit.length > 0) {
        var akSheet = ss.getSheetByName("DB_Audit_Kas");
        data.kas.audit.forEach(function(a) {
          if (akSheet) akSheet.appendRow([
            idLaporan, a.jam, a.kasir || "", Number(a.modal||0), Number(a.qris||0), 
            Number(a.tunai||0), Number(a.aktual||0), Number(a.selisih||0), a.keterangan||""
          ]);
        });
      }
      
      // Insert DB_Kinerja_Produk
      var kpSheet = ss.getSheetByName("DB_Kinerja_Produk");
      if (kpSheet && data.produk) {
        var categories = [
          { keyTop: "topMinuman", keyBottom: "bottomMinuman", label: "Minuman" },
          { keyTop: "topMakanan", keyBottom: "bottomMakanan", label: "Makanan" },
          { keyTop: "topSnack", keyBottom: "bottomSnack", label: "Snack" }
        ];
        categories.forEach(function(cat) {
          if (data.produk[cat.keyTop] && Array.isArray(data.produk[cat.keyTop])) {
            data.produk[cat.keyTop].forEach(function(item) {
              if (item && item.nama && item.nama.trim() !== "") {
                kpSheet.appendRow([idLaporan, cat.label, "Top", item.nama, item.terjual || 0, ""]);
              }
            });
          }
          if (data.produk[cat.keyBottom] && Array.isArray(data.produk[cat.keyBottom])) {
            data.produk[cat.keyBottom].forEach(function(item) {
              if (item && item.nama && item.nama.trim() !== "") {
                kpSheet.appendRow([idLaporan, cat.label, "Bottom", item.nama, item.terjual || 0, item.rencana || item.tindakan || ""]);
              }
            });
          }
        });
      }
      
      // Insert DB_Inspeksi_Operasional
      var ioSheet = ss.getSheetByName("DB_Inspeksi_Operasional");
      if (ioSheet) {
        if (data.kebersihan && data.kebersihan.length > 0) {
          data.kebersihan.forEach(function(k) {
            ioSheet.appendRow([idLaporan, "Kebersihan", k.area, Number(k.skor || 0), 0, k.ket || k.status || ""]);
          });
        }
        if (data.fasilitas && data.fasilitas.length > 0) {
          data.fasilitas.forEach(function(f) {
            ioSheet.appendRow([idLaporan, "Fasilitas", f.item, f.status, 0, f.eskalasi ? "Eskalasi GM" : "TIDAK"]);
          });
        }
        if (data.bahan && data.bahan.length > 0) {
          data.bahan.forEach(function(b) {
            ioSheet.appendRow([idLaporan, "Bahan", b.nama, b.ketersediaan, Number(b.harga||0), ""]);
          });
        }
        if (data.qc && data.qc.espresso) {
          ioSheet.appendRow([idLaporan, "QC Espresso", "Kalibrasi", data.qc.espresso.status || "", 0, data.qc.espresso.keterangan || ""]);
        }
        if (data.qc && data.qc.items && data.qc.items.length > 0) {
          data.qc.items.forEach(function(q) {
            ioSheet.appendRow([idLaporan, "QC Menu", q.nama, q.status, 0, q.keterangan || ""]);
          });
        }
      }
      
    } else if (data.type === "weekly") {
      var idLaporanWeekly = data.periodeStart + "_to_" + data.periodeEnd + "-" + (data.outlet || "Perintis").replace(/\s+/g, "_");
      var wSheet = ss.getSheetByName("DB_Laporan_Mingguan");
      var totalRealSales = 0, totalTargetSales = 0;
      if (data.weekly && data.weekly.salesHarian) {
        data.weekly.salesHarian.forEach(function(s) {
          totalRealSales += Number(s.real || 0);
          totalTargetSales += Number(s.target || 0);
        });
      }
      var computedPeriode = data.periode || (data.periodeStart + " s/d " + data.periodeEnd);
      
      if (wSheet) wSheet.appendRow([
        idLaporanWeekly, computedPeriode, data.outlet, data.supervisor,
        totalRealSales, totalTargetSales, data.weekly.kendalaUtama || "", fileUrl
      ]);
      
      if (data.weekly.staff && data.weekly.staff.length > 0) {
        var swSheet = ss.getSheetByName("DB_Evaluasi_Staf");
        data.weekly.staff.forEach(function(s) {
          if (swSheet) swSheet.appendRow([
            idLaporanWeekly, s.nama || "", s.posisi || "", data.outlet, s.status || "", s.alasan || ""
          ]);
        });
      }
    } else if (data.type === "monthly") {
      var idLaporanMonthly = (data.bulan || "XX-XXXX") + "-" + (data.outlet || "Perintis").replace(/\s+/g, "_");
      var mSheet = ss.getSheetByName("DB_Laporan_Bulanan");
      var bulanFormatted = data.bulan;
      if (bulanFormatted && bulanFormatted.indexOf("-") !== -1) {
        var p = bulanFormatted.split("-");
        bulanFormatted = p[1] + "-" + p[0]; // MM-YYYY from YYYY-MM
      }
      
      if (mSheet) mSheet.appendRow([
        idLaporanMonthly, bulanFormatted, data.outlet, data.supervisor,
        Number(data.monthly.sales.total || 0), Number(data.monthly.sales.target || 0), Number(data.monthly.sales.persen || 0),
        data.monthly.evaluasi.ratingKerja || "", Number(data.monthly.operasional.kepatuhanSop || 0), Number(data.monthly.operasional.telat || 0),
        data.monthly.evaluasi.berhasil || "", data.monthly.evaluasi.sulit || "", Number(data.monthly.fasilitas.pengeluaran || 0),
        Number(data.monthly.operasional.turnover || 0),       // Index 13: Total_Turnover
        data.monthly.operasional.strategi || "",              // Index 14: Strategi_Bulan_Depan
        data.monthly.operasional.kebutuhanGM || "",           // Index 15: Kebutuhan_Approval_GM
        fileUrl                                                // Index 16: URL_PDF
      ]);
      
      // Auto-Sync Turnover Barista to MasterStaff
      if (data.monthly.operasional.resignList && data.monthly.operasional.resignList.length > 0) {
        var masterSheet = ss.getSheetByName("Master_Staff");
        if (masterSheet) {
          var mData = masterSheet.getDataRange().getValues();
          data.monthly.operasional.resignList.forEach(function(resignItem) {
            if (!resignItem.id) return;
            for (var i = 1; i < mData.length; i++) {
              if (mData[i][0].toString() === resignItem.id.toString()) {
                masterSheet.getRange(i + 1, 4).setValue("Resign");
                break;
              }
            }
          });
        }
      }
      
      if (data.monthly.staff && Array.isArray(data.monthly.staff)) {
        var smSheet = ss.getSheetByName("DB_Evaluasi_Staf");
        data.monthly.staff.forEach(function(s) {
          if (smSheet) smSheet.appendRow([
            idLaporanMonthly, s.nama || "", s.posisi || "", data.outlet, s.status || "", s.alasan || ""
          ]);
        });
      }
      
      // Save Monthly Product Suggestions to DB_Kinerja_Produk
      if (data.monthly.produk) {
        var kpSheet = ss.getSheetByName("DB_Kinerja_Produk");
        if (kpSheet) {
          var categories = [
            { keyBottom: "bottomMinuman", label: "Minuman" },
            { keyBottom: "bottomMakanan", label: "Makanan" },
            { keyBottom: "bottomSnack", label: "Snack" }
          ];
          categories.forEach(function(cat) {
            if (data.monthly.produk[cat.keyBottom] && Array.isArray(data.monthly.produk[cat.keyBottom])) {
              data.monthly.produk[cat.keyBottom].forEach(function(item) {
                if (item && item.nama && item.nama.trim() !== "") {
                  // Monthly ID format: MM-YYYY-Outlet
                  kpSheet.appendRow([idLaporanMonthly, cat.label, "Bottom", item.nama, item.terjual || 0, item.rencana || ""]);
                }
              });
            }
          });
        }
      }
    }

    var folderPath = "";
    try { folderPath = folder.getName(); } catch(e) { folderPath = year + " / " + monthName; }
    
    return { success: true, url: fileUrl, folderPath: folderPath };
  } catch (err) {
    Logger.log("Error in submitFullReport: " + err.toString());
    return { success: false, error: err.toString() };
  }
}

function calculateAggregatedProducts(startDate, endDate, outlet) {
  var ss = getSpreadsheet();
  var dbSheet = ss.getSheetByName("DB_Kinerja_Produk");
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
    var idLaporan = String(row[0]); // e.g. "DD-MM-YYYY-Outlet"
    if (!idLaporan) continue;
    
    var idParts = idLaporan.split("-");
    
    // Monthly ID format: MM-YYYY-Outlet (3 parts)
    if (idParts.length === 3) {
      var mMonth = parseInt(idParts[0], 10) - 1;
      var mYear = parseInt(idParts[1], 10);
      var mOutlet = idParts[2].trim();
      var isOutletMatch = matchesOutlet(mOutlet, outlet);
      
      // Check if monthly record falls in range (using first day of month)
      var mDate = new Date(mYear, mMonth, 1).getTime();
      // Since it's a monthly suggestion, we loosely match if the month falls within the start-end range
      if (isOutletMatch && mDate >= new Date(new Date(start).getFullYear(), new Date(start).getMonth(), 1).getTime() && mDate <= end) {
        var kategori = String(row[1]).toLowerCase().trim();
        var peringkat = String(row[2]).toLowerCase().trim();
        var nama = String(row[3]);
        var rencana = String(row[5]);
        
        var key = "";
        if (peringkat.indexOf("bottom") !== -1) {
          if (kategori === "minuman") key = "bottomMinuman";
          else if (kategori === "makanan") key = "bottomMakanan";
          else if (kategori === "snack") key = "bottomSnack";
        }
        
        if (key && nama && rencana) {
          if (!agg[key][nama]) {
            agg[key][nama] = { nama: nama, terjual: 0, rencana: "" };
          }
          // Overwrite with monthly suggestion from SPV
          agg[key][nama].rencana = rencana;
        }
      }
    }
    // Daily ID format: DD-MM-YYYY-Outlet (4+ parts)
    else if (idParts.length >= 4) {
      var rowOutlet = idParts.slice(3).join("-").trim();
      var isOutletMatch = matchesOutlet(rowOutlet, outlet);
      
      if (isOutletMatch) {
        var d = parseInt(idParts[0], 10);
        var m = parseInt(idParts[1], 10) - 1;
        var y = parseInt(idParts[2], 10);
        var rowDate = new Date(y, m, d).getTime();
        
        if (rowDate && rowDate >= start && rowDate <= end) {
          var kategori = String(row[1]).toLowerCase().trim(); // Minuman/Makanan/Snack
          var peringkat = String(row[2]).toLowerCase().trim(); // Top/Bottom
          var nama = String(row[3]);
          var terjual = Number(row[4]) || 0;
          var rencana = String(row[5]);
          
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
            // Only use daily suggestion if we don't have one yet
            if (rencana && !agg[key][nama].rencana) {
              agg[key][nama].rencana = rencana;
            }
          }
        }
      }
    }
  }
  
  // Convert dictionary to sorted array
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
    var sheet = ss.getSheetByName("DB_Laporan_Harian");
    if (!sheet) return { success: false, error: "Tab DB_Laporan_Harian tidak ditemukan" };
    
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
      var dateCol = row[1]; // Col B (Tanggal)
      if (dateCol instanceof Date) {
        rowDate = dateCol;
      } else {
        var dateParts = String(dateCol).split("-");
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
        var rowOutlet = String(row[3]); // Col D (Outlet)
        
        if (t >= start && t <= end && rowOutlet.toLowerCase() === String(outlet).toLowerCase()) {
          var dayName = daysMap[rowDate.getDay()];
          var omset = Number(row[6] || 0); // Col G (Total_Omset)
          // Hardcode daily target since it's no longer stored in the daily sheet
          var target = rowOutlet.toLowerCase() === "perintis" ? 6000000 : 5300000;
          
          dailyTotals[dayName].real += omset;
          dailyTotals[dayName].target += target;
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
    
    var monthParts = monthStr.split("-"); // [YYYY, MM]
    var targetYear = parseInt(monthParts[0], 10);
    var targetMonth = parseInt(monthParts[1], 10) - 1; // JS months are 0-11
    
    var totalReal = 0;
    var totalTarget = 0;
    var totalKomplain = 0;
    
    var hSheet = ss.getSheetByName("DB_Laporan_Harian");
    if (hSheet) {
      var hData = hSheet.getDataRange().getValues();
      for (var i = 1; i < hData.length; i++) {
        var rowDate = null;
        var dateCol = hData[i][1]; // Col C (Tanggal)
        if (dateCol instanceof Date) {
          rowDate = dateCol;
        } else {
          var dateParts = String(dateCol).split("-");
          if (dateParts.length === 3) {
            var d = parseInt(dateParts[0], 10);
            var m = parseInt(dateParts[1], 10) - 1;
            var y = parseInt(dateParts[2], 10);
            if (y < 2000) { y = parseInt(dateParts[0], 10); d = parseInt(dateParts[2], 10); }
            rowDate = new Date(y, m, d);
          }
        }
        
        if (rowDate) {
          if (rowDate.getFullYear() === targetYear && rowDate.getMonth() === targetMonth && String(hData[i][3]).toLowerCase() === String(outlet).toLowerCase()) {
            totalReal += Number(hData[i][6] || 0); // Col G: Total Omset
            totalTarget += String(outlet).toLowerCase() === "perintis" ? 6000000 : 5300000;
          }
        }
      }
    }
    
    var totalTelat = 0;
    var sopTotalStaff = 0;
    var sopCompliantStaff = 0;
    
    var stSheet = ss.getSheetByName("DB_Kehadiran_Staf");
    if (stSheet) {
      var stData = stSheet.getDataRange().getValues();
      for (var s = 1; s < stData.length; s++) {
        var sRow = stData[s];
        var idLaporan = String(sRow[0] || "");
        if (!idLaporan) continue;
        
        var idParts = idLaporan.split("-");
        if (idParts.length >= 4) {
          var d = parseInt(idParts[0], 10);
          var m = parseInt(idParts[1], 10) - 1;
          var y = parseInt(idParts[2], 10);
          var rowOutlet = idParts.slice(3).join("-").trim();
          
          if (y === targetYear && m === targetMonth && rowOutlet.toLowerCase() === String(outlet).toLowerCase()) {
            var posisi = String(sRow[2]); // Col C
            var statusHadir = String(sRow[5]); // Col F
            var lengkapSOP = String(sRow[6]); // Col G
            
            if (statusHadir.toLowerCase() === 'terlambat') {
              totalTelat++;
            }
            
            if (posisi.toLowerCase() !== 'kitchen' && (statusHadir.toLowerCase() === 'hadir' || statusHadir.toLowerCase() === 'terlambat')) {
              sopTotalStaff++;
              if (lengkapSOP.toLowerCase() === 'tidak') {
                sopCompliantStaff++;
              }
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
    var staffPerformances = [];
    
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
    var sheets = getAllOutletSheets(ss, "Daily");
    var pendings = [];
    
    for (var s = 0; s < sheets.length; s++) {
      var sheet = sheets[s];
      var data = sheet.getDataRange().getValues();
      
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
            rowIdx: i + 1, // Row index is relative to this specific sheet
            sheetName: sheet.getName() // Critical for Fase 2 target identification
          });
        }
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
    var data = getAggregatedData(ss, "DB_Laporan_Harian");
    if (data.length <= 1) throw new Error("Belum ada data laporan harian.");
    
    var omsetTotal = 0;
    var omsetYTD = 0;
    var targetOmset = 0;
    var targetOmsetFallback = 0; // Fallback variable for resilience
    var omsetBulanLalu = 0;
    var komplainTotal = 0;
    var transaksiTotal = 0;
    var listLaporan = [];
    var chartData = [];
    var cuacaHujan = 0;
    var cuacaCerah = 0;
    var outletStats = {};
    
    // Normalize inputs into Date objects
    var startD = parseDateToObj(startDate);
    var endD = parseDateToObj(endDate);
    if (!startD || isNaN(startD.getTime())) startD = new Date();
    if (!endD || isNaN(endD.getTime())) endD = new Date();

    var year = startD.getFullYear().toString();
    var targetYTDStr = PropertiesService.getScriptProperties().getProperty("GM_TARGET_TAHUNAN_" + year);
    var targetYTD = targetYTDStr ? Number(targetYTDStr) : 0;

    // Define monthName and monthPrefix for compatibility with Weekly/Monthly fetching
    var startMonthIdx = startD.getMonth();
    var mForPrefix = startMonthIdx + 1;
    var monthPrefix = startD.getFullYear() + "-" + (mForPrefix < 10 ? "0" + mForPrefix : mForPrefix);
    
    var monthsIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    var monthName = monthsIndo[startMonthIdx] || "";
    
    // Calculate previous period for comparison (same duration immediately preceding)
    var diffTime = Math.abs(endD - startD);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    var prevEndD = new Date(startD);
    prevEndD.setDate(prevEndD.getDate() - 1);
    var prevStartD = new Date(prevEndD);
    prevStartD.setDate(prevStartD.getDate() - diffDays);
    
    // Skip headers
    for (var i = 1; i < data.length; i++) {
      var rowDateObj = parseDateToObj(data[i][1]);
      if (!rowDateObj) continue; // Skip if invalid date
      
      var dYear = rowDateObj.getFullYear();
      var dMonth = rowDateObj.getMonth() + 1;
      var dDate = rowDateObj.getDate();
      var rowDate = dYear + "-" + (dMonth < 10 ? "0" + dMonth : dMonth) + "-" + (dDate < 10 ? "0" + dDate : dDate);
      
      var rowOutlet = (data[i][3] || "").toString();
      var matchesFilter = matchesOutlet(rowOutlet, outletFilter);
      
      if (matchesFilter) {
        var rowOmset = Number(data[i][6] || 0);
        var rowTarget = Number(data[i][7] || 0); // Col H
        
        // Year-to-Date Calculation
        if (dYear.toString() === year) {
          omsetYTD += rowOmset;
        }
        
        if (rowDateObj >= startD && rowDateObj <= endD) {
          omsetTotal += rowOmset;
          targetOmsetFallback += rowTarget; // Graceful Fallback accumulation
          komplainTotal += 0; // Komplain data now saved elsewhere or calculated from feedback table
          transaksiTotal += Number(data[i][8] || 0); // Read real transaction data from col 9 (Index 8)
          
          var rowCuaca = (data[i][5] || "Cerah / Panas").toString().toLowerCase();
          if (rowCuaca.indexOf("hujan") !== -1 || rowCuaca.indexOf("mendung") !== -1) {
            cuacaHujan++;
          } else {
            cuacaCerah++;
          }
          
          listLaporan.push({
            name: "Daily Report - " + rowDate + " (" + data[i][4] + ")",
            url: data[i][11],
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
          
        } else if (rowDateObj >= prevStartD && rowDateObj <= prevEndD) {
          omsetBulanLalu += rowOmset;
        }
      }
    }
    
    // Also grab weekly and monthly reports for listing
    var wData = getAggregatedData(ss, "DB_Laporan_Mingguan");
    for (var i = 1; i < wData.length; i++) {
      var period = wData[i][1].toString(); // Col B
      // If the period matches our target month
      if (period.indexOf(monthName) !== -1) {
        var rowOutlet = (wData[i][2] || "").toString(); // Col C
        if (matchesOutlet(rowOutlet, outletFilter)) {
          listLaporan.push({
            name: "Weekly Report - " + period + " (" + (wData[i][3] || "") + ")", // Col D is SPV
            url: wData[i][7], // Col H
            dateCreated: period
          });
        }
      }
    }
    
    // --- Real-Time SDM Aggregation ---
    var totalTelatRealtime = 0;
    var sdData = getAggregatedData(ss, "DB_Kehadiran_Staf");
    for (var s = 1; s < sdData.length; s++) {
      var idLaporan = (sdData[s][0] || "").toString();
      if (!idLaporan) continue;
      
      var idParts = idLaporan.split("-");
      if (idParts.length >= 4) {
        var d = parseInt(idParts[0], 10);
        var m = parseInt(idParts[1], 10) - 1;
        var y = parseInt(idParts[2], 10);
        var dObj = new Date(y, m, d);
        var rowOutlet = idParts.slice(3).join("-").trim().replace(/_/g, " ");
        
        if (dObj >= startD && dObj <= endD) {
          if (matchesOutlet(rowOutlet, outletFilter)) {
            var statusHadir = (sdData[s][5] || "").toString().toLowerCase(); // Col F
            if (statusHadir === "terlambat") {
              totalTelatRealtime++;
            }
          }
        }
      }
    }

    var operasionalData = null;

    // --- Hitung Teguran (SP) dinamis dari DB_Evaluasi_Staf ---
    var totalTeguranDinamis = 0;
    var evSheet = ss.getSheetByName("DB_Evaluasi_Staf");
    
    // We need targetBul (MM-YYYY) for parsing monthly IDs
    var targetBul = monthPrefix;
    if (monthPrefix.indexOf("-") !== -1) {
      var p = monthPrefix.split("-");
      targetBul = p[1] + "-" + p[0]; // e.g., 07-2026
    }
    
    if (evSheet) {
      var evData = evSheet.getDataRange().getValues();
      for (var e = 1; e < evData.length; e++) {
        var evId = (evData[e][0] || "").toString();
        var evIdParts = evId.split("-");
        var evOutlet = "";
        var inRange = false;
        
        if (evIdParts.length >= 4) {
          // Format Harian: DD-MM-YYYY-Outlet
          var evD = parseInt(evIdParts[0], 10);
          var evM = parseInt(evIdParts[1], 10) - 1;
          var evY = parseInt(evIdParts[2], 10);
          var evDate = new Date(evY, evM, evD);
          evOutlet = evIdParts.slice(3).join("-").trim().replace(/_/g, " ");
          if (evDate >= startD && evDate <= endD) inRange = true;
        } else if (evIdParts.length === 3) {
          // Format Bulanan/Mingguan: MM-YYYY-Outlet (atau MM-YYYY-Outlet)
          var mmyyyy = evIdParts[0] + "-" + evIdParts[1];
          evOutlet = evIdParts[2].trim().replace(/_/g, " ");
          if (mmyyyy === targetBul) inRange = true;
        }
        
        if (inRange) {
          if (matchesOutlet(evOutlet, outletFilter)) {
            var catatan = (evData[e][5] || "").toString().toLowerCase(); // Col F: Catatan_Kinerja

            if (catatan.indexOf("sp") !== -1 || catatan.indexOf("teguran") !== -1 || catatan.indexOf("peringatan") !== -1) {
              totalTeguranDinamis++;
            }
          }
        }
      }
    }

    var mData = getAggregatedData(ss, "DB_Laporan_Bulanan");
    // We need to compare monthPrefix (YYYY-MM) with the sheet format (MM-YYYY)
    var targetBul = monthPrefix;
      if (monthPrefix.indexOf("-") !== -1) {
        var p = monthPrefix.split("-");
        targetBul = p[1] + "-" + p[0];
      }
      
      for (var i = 1; i < mData.length; i++) {
        var bulObj = mData[i][1]; // Col B is Date object or string
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
          if (matchesOutlet(rowOutlet, outletFilter)) {
            listLaporan.push({
              name: "Monthly Report - " + bul + " (" + (mData[i][3] || "") + ")", // Col D is SPV
              url: mData[i][16], // Col Q (URL_PDF — now index 16 after adding 3 new columns)
              dateCreated: bul
            });
            
              var tVal = parseInt(mData[i][13], 10);
              var sDepan = (mData[i][14] || "").toString().trim();
              var kGM = (mData[i][15] || "").toString().trim();
              var pencapaianData = (mData[i][10] || "").toString().trim();
              var tantanganData = (mData[i][11] || "").toString().trim();

              operasionalData = {
                isFallback: false,
                kepatuhanSop: null, // UI will use hygieneScore instead
                totalTelat: totalTelatRealtime, // Real-time from DB_Kehadiran_Staf
                totalTeguran: totalTeguranDinamis, // Dynamically calculated from DB_Evaluasi_Staf
                kendalaUtama: tantanganData || "-", // Tantangan (Col L / Index 11)
                eskalasiFasilitas: "-", 
                strategiDepan: (sDepan && sDepan !== "-") ? sDepan : "-", // Strategi_Bulan_Depan (Index 14)
                kebutuhanGM: (kGM && kGM !== "-") ? kGM : "-",   // Kebutuhan_Approval_GM (Index 15)
                pencapaian: pencapaianData || "-",    // Pencapaian (Col K / Index 10)
                tantangan: tantanganData || "-",     // Tantangan (Col L / Index 11)
                skill: "-",
                turnoverBarista: isNaN(tVal) ? 0 : tVal      // Total_Turnover (Index 13)
              };
          }
        }
      }
    
    // Fallback if Monthly not found
    if (!operasionalData) {
      operasionalData = {
        isFallback: true,
        kepatuhanSop: null,
        totalTelat: totalTelatRealtime,
        totalTeguran: totalTeguranDinamis, // Still show SP count even without monthly report
        kendalaUtama: "-",
        eskalasiFasilitas: "-",
        strategiDepan: "-",
        kebutuhanGM: "-",
        pencapaian: "-",
        tantangan: "-",
        skill: "-",
        turnoverBarista: 0
      };
    }

    // Transaction total is now calculated inside the main loop
    // var transaksiTotal = listLaporan.length * 45;
    var currentFolderId = PropertiesService.getScriptProperties().getProperty("ROOT_FOLDER_ID") || "";
    
    // targetOmset is now calculated directly from the Daily sheet
    
    // --- Dynamic Target Calculation from Config_Target ---
    var dStartObj = startD;
    var dEndObj = endD;
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
        var btObj = cData[c][0];
        var rowBulanTahun = "";
        if (btObj instanceof Date) {
           var m = btObj.getMonth() + 1;
           var y = btObj.getFullYear();
           rowBulanTahun = (m < 10 ? "0" + m : m) + "-" + y;
        } else {
           rowBulanTahun = (btObj || "").toString().trim().replace(/^'/, '');
        }
        if (rowBulanTahun === targetBulanStr) {
          var cOutlet = (cData[c][2] || "").toString();
          if (matchesOutlet(cOutlet, outletFilter) && outletFilter !== "Semua") {
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
    
    // Graceful Fallback: If no target in Config_Target, use sum of daily targets
    if (targetOmset === 0) {
      targetOmset = targetOmsetFallback;
    }
    
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
    var kbData = getAggregatedData(ss, "DB_Inspeksi_Operasional");
    if (kbData && kbData.length > 1) {
      for (var i = 1; i < kbData.length; i++) {
        var idLaporan = (kbData[i][0] || "").toString();
        if (!idLaporan) continue;
        
        var idParts = idLaporan.split("-");
        if (idParts.length >= 4) {
          var d = parseInt(idParts[0], 10);
          var m = parseInt(idParts[1], 10) - 1;
          var y = parseInt(idParts[2], 10);
          var dObj = new Date(y, m, d);
          var rowOutlet = idParts.slice(3).join("-").trim().replace(/_/g, " ");
          
          var matches = matchesOutlet(rowOutlet, outletFilter);
          if (matches && dObj >= startD && dObj <= endD) {
            var kategori = (kbData[i][1] || "").toString(); // Col B: Tipe_Inspeksi
            // Only process "Kebersihan" rows — "Fasilitas" rows have text scores, not numbers
            if (kategori !== "Kebersihan") continue;

            var area = kbData[i][2]; // Col C: Objek_Dicek
            var skor = Number(kbData[i][3]); // Col D: Skor_Kondisi
            var ket = kbData[i][5]; // Col F: Tindakan_Catatan
            
            if (isNaN(skor)) continue; // Skip if score is not a valid number
            
            hygieneScoreTotal += skor;
            hygieneCount++;
            
            if (!hygieneAreas[area]) {
              hygieneAreas[area] = { totalSkor: 0, count: 0, logs: [] };
            }
            hygieneAreas[area].totalSkor += skor;
            hygieneAreas[area].count++;
            if (ket && ket.toString().trim() !== "") {
              if (hygieneAreas[area].logs.indexOf(ket) === -1) {
                hygieneAreas[area].logs.push(ket);
              }
            }
          }
        }
      }
    }
    
    var hygieneScore = hygieneCount > 0 ? Math.round(hygieneScoreTotal / hygieneCount) : 0;
    
    var hygieneKritis = [];
    for (var area in hygieneAreas) {
      var avgScore = Math.round(hygieneAreas[area].totalSkor / hygieneAreas[area].count);
      if (avgScore < 95) {
        hygieneKritis.push({
          area: area,
          avg: avgScore,
          ket: hygieneAreas[area].logs.length > 0 ? hygieneAreas[area].logs[0] : "-"
        });
      }
    }
    hygieneKritis.sort(function(a,b) { return a.avg - b.avg; });
    hygieneKritis = hygieneKritis.slice(0, 3);

    // --- PREDICTIVE SYSTEM ENGINE (v3.0 - Context-Aware Shapeshifter) ---
    var predictiveAlert = "";
    var systemVerdict = "Normal";
    var dStart = startD;
    var dEnd = endD;
    
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
        if (pStatus === "Aktif" && (pOutlet === "Semua" || matchesOutlet(pOutlet, outletFilter))) {
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
    
    // ==========================================
    // AI PREDICTIVE ENGINE V3.1 (4 ALGORITHMS)
    // ==========================================
    var avgTrx = durationDays > 0 ? (transaksiTotal / durationDays) : 0;
    
    // AI 1: Titik Patah Kualitas (Fatigue Limit)
    if (avgTrx > 100 && hygieneScore < 80 && hygieneScore > 0) {
       systemVerdict = "Merah";
       predictiveAlert = "Batas Kelelahan Tim (Fatigue Limit) tercapai. Saat rata-rata harian menembus " + Math.round(avgTrx) + " struk, kebersihan hancur (" + hygieneScore + "%). Tim butuh bantuan staf Part-Time!";
    } else if (avgTrx > 100 && komplainTotal > (durationDays * 2)) {
       systemVerdict = "Kuning";
       predictiveAlert = "Batas Kelelahan Tim (Fatigue Limit) tercapai. Transaksi tinggi mengorbankan kualitas (Komplain: " + komplainTotal + "). Perhatikan kapasitas penyajian dapur!";
    }
    // AI 2: Cuaca Hujan vs Skor Kebersihan
    else if (cuacaHujan >= Math.ceil(durationDays * 0.3) && hygieneScore < 80 && hygieneScore > 0) {
       systemVerdict = "Kuning";
       predictiveAlert = "Fasilitas rentan cuaca ekstrem. Intensitas hujan tinggi berkorelasi dengan skor kebersihan anjlok (" + hygieneScore + "%). Terapkan SOP Double-Mopping & pasang Karpet Anti-Slip!";
    }
    // AI 3: Burnout / Churn Prediksi (Telat + SP)
    else if (durationDays >= 7 && (totalTelatRealtime / durationDays) > 0.3) { 
       systemVerdict = "Merah";
       predictiveAlert = "Prediksi Churn: Rasio keterlambatan sangat tinggi (" + totalTelatRealtime + " kasus). Indikasi demotivasi/burnout akut, waspada staf resign mendadak.";
    }
    else {
      // TIER 1, 2, 3 Logic for fallback
      if (durationDays <= 2) {
        if (activeEvent !== "" && isTanggalTua) {
          systemVerdict = "Kuning"; predictiveAlert = "Trafik Padat, Daya Beli Rendah (Event: " + activeEvent + " + Tanggal Tua). Jangan tambah staf ekstra, alihkan energi ke kebersihan area.";
        } else if (activeEvent !== "" && isTanggalMuda) {
          systemVerdict = "Hijau"; predictiveAlert = "Momen Emas (Event: " + activeEvent + " + Tanggal Muda): Peluang mencetak rekor omset harian. Pastikan staf full-team & prima.";
        } else {
          systemVerdict = "Biru"; predictiveAlert = "Kinerja Taktis Harian: Operasional stabil dan tidak ada anomali cuaca/tanggal yang ekstrem.";
        }
      } else if (durationDays <= 14) {
        if (pacingOmset >= 1 && hygieneScore >= 90) {
          systemVerdict = "Hijau"; predictiveAlert = "Momentum Positif: Tren pertumbuhan mingguan sangat stabil dengan pelayanan terjaga.";
        } else {
          systemVerdict = "Biru"; predictiveAlert = "Evaluasi Mingguan: Tren mingguan berjalan fluktuatif namun masih dalam batas toleransi wajar.";
        }
      } else {
        if (pacingOmset >= 1 && hygieneScore >= 95 && komplainTotal < (durationDays * 0.1)) {
          systemVerdict = "Hijau"; predictiveAlert = "Golden Era (Sukses Eksekutif): Keseimbangan sempurna operasional dan finansial skala makro tercapai.";
        } else if (pacingOmset < 0.90) {
          systemVerdict = "Merah"; predictiveAlert = "Kegagalan Target Periode: Evaluasi seluruh matriks Marketing Intelligence. Perlu perombakan strategi menyeluruh.";
        } else {
          systemVerdict = "Biru"; predictiveAlert = "Kinerja Makro Stabil: Seluruh matriks utama dalam satu bulan penuh menunjukkan titik aman.";
        }
      }
    }

    // AI 4: Deteksi Anomali Kasir (Petty Fraud - Frequency Analysis)
    var auditKasData = getAggregatedData(ss, "DB_Audit_Kas");
    var minusDates = [];
    var totalMinus = 0;
    
    // Find dates with minus
    for (var k = 1; k < auditKasData.length; k++) {
       var akIdLaporan = String(auditKasData[k][0] || "");
       if (!akIdLaporan) continue;
       var akParts = akIdLaporan.split("-");
       if (akParts.length < 4) continue;
       
       var akDateStr = akParts[0] + "-" + akParts[1] + "-" + akParts[2];
       var dkObj = parseDateToObj(akDateStr);
       if (!dkObj) continue;
       
       if (dkObj >= startD && dkObj <= endD) {
          var rOut = akParts.slice(3).join("-").trim().replace(/_/g, " ");
          if (matchesOutlet(rOut, outletFilter)) {
              var selisih = Number(auditKasData[k][7] || 0); // Col H (Index 7): Selisih
              if (selisih < -2000) { // Toleransi wajar 2rb
                 totalMinus += Math.abs(selisih);
                 var fDate = dkObj.getFullYear() + "-" + ("0" + (dkObj.getMonth()+1)).slice(-2) + "-" + ("0" + dkObj.getDate()).slice(-2);
                 minusDates.push({ date: fDate, outlet: rOut });
              }
           }
       }
    }
    
    if (minusDates.length > 0 && totalMinus >= 50000) {
       var staffFreq = {};
       for (var s = 1; s < sdData.length; s++) { 
          var sdIdLaporan = String(sdData[s][0] || "");
          if (!sdIdLaporan) continue;
          var sdParts = sdIdLaporan.split("-");
          if (sdParts.length < 4) continue;
          
          var sdDateStr = sdParts[0] + "-" + sdParts[1] + "-" + sdParts[2];
          var sdObj = parseDateToObj(sdDateStr);
          if (!sdObj) continue;
          
          var fDate = sdObj.getFullYear() + "-" + ("0" + (sdObj.getMonth()+1)).slice(-2) + "-" + ("0" + sdObj.getDate()).slice(-2);
          var sOutlet = sdParts.slice(3).join("-").trim().replace(/_/g, " ");
          var staffName = (sdData[s][1] || "").toString(); // Col B (Index 1): Nama Staf
          
          for (var m = 0; m < minusDates.length; m++) {
             if (minusDates[m].date === fDate && matchesOutlet(sOutlet, minusDates[m].outlet)) {
                staffFreq[staffName] = (staffFreq[staffName] || 0) + 1;
                break;
             }
          }
       }
       var sortedStaff = [];
       for (var name in staffFreq) {
          sortedStaff.push({ name: name, freq: staffFreq[name] });
       }
       sortedStaff.sort(function(a,b) { return b.freq - a.freq; });
       if (sortedStaff.length > 0) {
          var fraudMsg = "[ANOMALI KASIR] Total Minus Rp " + totalMinus.toLocaleString("id-ID") + ". Frekuensi shift tertinggi saat minus: " + sortedStaff[0].name + " (" + sortedStaff[0].freq + "x)";
          if (sortedStaff.length > 1) fraudMsg += ", " + sortedStaff[1].name + " (" + sortedStaff[1].freq + "x)";
          
          predictiveAlert = fraudMsg + " — " + predictiveAlert;
          if (systemVerdict === "Biru" || systemVerdict === "Hijau") systemVerdict = "Kuning";
       }
    }
    
    // Fallback if Target is missing
    if (targetOmset === 0 && durationDays > 1) {
       systemVerdict = "Kuning";
       predictiveAlert = "⚠ PERINGATAN SISTEM: Target Omset untuk periode ini belum diatur di 'Config_Target'. Beberapa analisis prediktif dinonaktifkan karena kekurangan data benchmark. Silakan atur target bulanan terlebih dahulu.";
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
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11pt; color: #171717; margin: 25px; line-height: 1.5; }
      h1 { text-align: center; color: #171717; border-bottom: 3px solid #171717; padding-bottom: 12px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; font-size: 18pt; }
      h2 { color: #171717; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; margin-bottom: 15px; font-size: 14pt; page-break-after: avoid; }
      h3 { color: #374151; margin-top: 20px; margin-bottom: 10px; font-size: 12pt; page-break-after: avoid; }
      p { margin-bottom: 8px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; page-break-inside: avoid; }
      th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; vertical-align: top; }
      th { background-color: #f9fafb; color: #171717; font-weight: bold; text-transform: uppercase; font-size: 9pt; letter-spacing: 0.5px; }
      td { font-size: 10pt; }
      .meta-table { border: 2px solid #171717; background-color: #fafafa; border-radius: 8px; margin-bottom: 25px; page-break-inside: avoid; }
      .meta-table td { border: none; padding: 8px 12px; font-size: 11pt; }
      .text-right { text-align: right; }
      .highlight { font-weight: bold; color: #10b981; }
      .section-box { page-break-inside: avoid; margin-bottom: 20px; }
      .badge-pinjaman { font-size: 8pt; background-color: #fef08a; color: #854d0e; padding: 2px 6px; border-radius: 4px; margin-left: 5px; font-weight: bold; }
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
        var badge = (row.outletAsal && row.outletAsal.toLowerCase() !== data.outlet.toLowerCase()) ? ' <span class="badge-pinjaman">(Pinjaman)</span>' : '';
        html += `<tr>
          <td>${row.nama || '-'}${badge}</td>
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
    html += `<div class="section-box">`;
    html += `<p>Kepatuhan SOP: <strong>${data.monthly.operasional.kepatuhanSop || 0}%</strong></p>`;
    html += `<p>Staff Terlambat: <strong>${data.monthly.operasional.telat || 0} kali</strong></p>`;
    html += `<p>Surat Teguran: <strong>${data.monthly.operasional.teguran || 0} kali</strong></p>`;
    html += `<p><strong>Penyebab Utama Masalah Staff:</strong> ${data.monthly.operasional.penyebab || '-'}</p>`;
    
    if (data.monthly.operasional.resignList && data.monthly.operasional.resignList.length > 0) {
      html += `<h3>Karyawan Resign / Turnover</h3>`;
      html += `<table>
        <tr><th>Nama</th><th>Alasan</th></tr>`;
      data.monthly.operasional.resignList.forEach(function(s) {
        html += `<tr><td>${s.nama || '-'}</td><td>${s.alasan || '-'}</td></tr>`;
      });
      html += `</table>`;
    }
    
    html += `</div>`;
    
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
    // Helper inside the function to parse everything to YYYY-MM-DD for reliable math
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
        if (p[2].length === 4) return p[2] + "-" + p[1] + "-" + p[0]; // DD-MM-YYYY -> YYYY-MM-DD
        if (p[0].length === 4) return str; // YYYY-MM-DD
      }
      return "";
    }

    var startDate = normDate(payload.startDate); // Ensures YYYY-MM-DD format for math
    var endDate = normDate(payload.endDate);
    var outlet = payload.outlet || "Semua";
    var benchmarkATS = Number(payload.benchmarkATS || 30000);

    var ss = getSpreadsheet();
    var insights = [];

    // ─────────────────────────────────────────────────────────────────

    function outletMatch(rowOutlet) {
      return matchesOutlet(rowOutlet, outlet);
    }

    // ─────────────────────────────────────────────────────────────────
    // MODUL C1: Tren Omset Mingguan (Dinamis dari Data Harian)
    // ─────────────────────────────────────────────────────────────────
    var dData = getAggregatedData(ss, "DB_Laporan_Harian");
    var weeklyInsight = { modul: "Tren Omset Mingguan", status: "insufficient", level: "info", title: "", desc: "", action: "" };
    
    var startD = parseDateToObj(startDate);
    var endD = parseDateToObj(endDate);
    
    if (startD && endD && dData.length > 1) {
      var totalRangeDays = Math.floor(Math.abs(endD - startD) / (1000 * 60 * 60 * 24)) + 1;
      var isDailyMode = totalRangeDays < 7;
      var salesMap = {};
      
      for (var i = 1; i < dData.length; i++) {
        var rowDateStr = (dData[i][1] || "").toString();
        var rowDateObj = parseDateToObj(rowDateStr);
        if (!rowDateObj || isNaN(rowDateObj.getTime())) continue;
        
        var rowOut = (dData[i][3] || "").toString();
        if (!outletMatch(rowOut)) continue;
        
        if (rowDateObj >= startD && rowDateObj <= endD) {
           var rowOmset = Number(dData[i][6] || 0);
           
           var groupKey;
           if (isDailyMode) {
             groupKey = rowDateObj.getTime();
           } else {
             var dayOfWeek = rowDateObj.getDay();
             var adjustedDay = (dayOfWeek === 0) ? 6 : dayOfWeek - 1; // Mon=0, Sun=6
             var mondayDate = new Date(rowDateObj.getFullYear(), rowDateObj.getMonth(), rowDateObj.getDate() - adjustedDay);
             groupKey = mondayDate.getTime();
           }
           
           if (!salesMap[groupKey]) {
             salesMap[groupKey] = { sales: 0, daysCount: 0, minDate: rowDateObj, maxDate: rowDateObj };
           }
           salesMap[groupKey].sales += rowOmset;
           salesMap[groupKey].daysCount += 1;
           
           if (rowDateObj < salesMap[groupKey].minDate) salesMap[groupKey].minDate = rowDateObj;
           if (rowDateObj > salesMap[groupKey].maxDate) salesMap[groupKey].maxDate = rowDateObj;
        }
      }
      
      var salesData = [];
      var months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
      var sortedKeys = Object.keys(salesMap).map(Number).sort(function(a, b) { return a - b; });
      
      for (var k = 0; k < sortedKeys.length; k++) {
        var key = sortedKeys[k];
        var grp = salesMap[key];
        var minD = grp.minDate;
        var maxD = grp.maxDate;
        var label = "";
        
        if (isDailyMode || minD.getTime() === maxD.getTime()) {
           label = minD.getDate() + " " + months[minD.getMonth()];
        } else {
           if (minD.getMonth() === maxD.getMonth()) {
               label = minD.getDate() + "-" + maxD.getDate() + " " + months[minD.getMonth()];
           } else {
               label = minD.getDate() + " " + months[minD.getMonth()] + " - " + maxD.getDate() + " " + months[maxD.getMonth()];
           }
        }
        
        salesData.push({
          periode: label,
          sales: grp.sales,
          avgSales: grp.daysCount > 0 ? (grp.sales / grp.daysCount) : 0,
          daysCount: grp.daysCount
        });
      }

      weeklyInsight.chartData = salesData; // Attach to insight for UI rendering

      if (salesData.length < (isDailyMode ? 3 : 2)) {
        weeklyInsight.status = "insufficient";
        weeklyInsight.desc = "Dibutuhkan minimal " + (isDailyMode ? "3 hari" : "2 minggu") + " data untuk mendeteksi tren secara akurat.";
      } else {
        var n = salesData.length;
        var lastAvg = salesData[n - 1].avgSales;
        var prevAvg = salesData[n - 2].avgSales;
        var prev2Avg = n > 2 ? salesData[n - 3].avgSales : null;

        var isNaik3 = prev2Avg !== null && (lastAvg > prevAvg && prevAvg > prev2Avg);
        var isTurun2 = prev2Avg !== null && (lastAvg < prevAvg && prevAvg < prev2Avg);
        var growthPct = prevAvg > 0 ? Math.round(((lastAvg - prevAvg) / prevAvg) * 100) : 0;

        weeklyInsight.status = "ok";
        if (isNaik3) {
          weeklyInsight.level = "positive";
          weeklyInsight.title = "Tren Naik Beruntun";
          weeklyInsight.desc = "Omset rata-rata konsisten naik (" + (growthPct > 0 ? "+" : "") + growthPct + "% terakhir). Momentum ini sangat ideal untuk memperkenalkan menu baru.";
          weeklyInsight.action = "Manfaatkan momentum: luncurkan 1 promo baru saat traffic sedang tinggi.";
        } else if (isTurun2 || (growthPct <= -15)) {
          weeklyInsight.level = "critical";
          weeklyInsight.title = "Peringatan: Penurunan Omset (" + growthPct + "%)";
          weeklyInsight.desc = "Rata-rata omset turun " + Math.abs(growthPct) + "%. " + (isTurun2 ? "Penurunan sudah berlangsung konsisten." : "Penurunan sangat tajam di periode terakhir.");
          weeklyInsight.action = "Tindakan segera: evaluasi apakah ada kompetitor baru, faktor cuaca buruk, atau penurunan kualitas layanan.";
        } else if (Math.abs(growthPct) < 5) {
          weeklyInsight.level = "warning";
          weeklyInsight.title = "Omset Stagnan (Flat)";
          weeklyInsight.desc = "Perubahan omset sangat kecil (" + growthPct + "%). Bisnis tidak tumbuh — stagnansi adalah sinyal bahaya jangka panjang.";
          weeklyInsight.action = "Coba strategi baru: promo limited-time, konten sosmed, atau bundling produk.";
        } else {
          weeklyInsight.level = "info";
          weeklyInsight.title = "Omset Fluktuatif Normal";
          weeklyInsight.desc = "Omset bergerak " + (growthPct > 0 ? "naik" : "turun") + " " + Math.abs(growthPct) + "%. Fluktuasi rata-rata harian masih dalam batas wajar.";
          weeklyInsight.action = "Pantau tren periode ke depan untuk deteksi pola lebih kuat.";
        }
      }
    }
    insights.push(weeklyInsight);

    // ─────────────────────────────────────────────────────────────────
    // MODUL C2: Dead Menu / Hero Product
    // Baca DB_Kinerja_Produk, hitung konsistensi top/bottom per produk
    // ─────────────────────────────────────────────────────────────────
    var produkSheet = ss.getSheetByName("DB_Kinerja_Produk");
    var produkInsight = { modul: "Analisis Menu", status: "insufficient", level: "info", title: "", desc: "", action: "" };

    if (produkSheet) {
      var pData = produkSheet.getDataRange().getValues();
      var bottomCount = {}; // { nama: count }
      var topCount = {};
      var totalDays = 0;
      var seenDays = {};

      for (var i = 1; i < pData.length; i++) {
        var idLaporan = pData[i][0].toString();
        var idParts = idLaporan.split("-");
        if(idParts.length < 4) continue; // Skip monthly suggestions
        
        var d = parseInt(idParts[0], 10);
        var m = parseInt(idParts[1], 10) - 1;
        var y = parseInt(idParts[2], 10);
        var rowDate = new Date(y, m, d).getTime();
        var rowDateStr = idParts[0] + "-" + idParts[1] + "-" + idParts[2];
        
        var rowOut = idParts.slice(3).join("-").trim();
        var peringkat = pData[i][2].toString(); // Index 2 is Peringkat
        var nama = pData[i][3].toString(); // Index 3 is Nama_Produk

        if (!rowDate || rowDate < startDate || rowDate > endDate) continue;
        if (!outletMatch(rowOut)) continue;
        if (!nama) continue;

        if (!seenDays[rowDateStr]) { seenDays[rowDateStr] = true; totalDays++; }

        if (peringkat.indexOf("Bottom") !== -1) {
          bottomCount[nama] = (bottomCount[nama] || 0) + 1;
        } else if (peringkat.indexOf("Top") !== -1) {
          topCount[nama] = (topCount[nama] || 0) + 1;
        }
      }

      var dayThreshold = Math.max(2, Math.floor(totalDays * 0.4)); // 40% dari hari

      var deadMenus = [];
      for (var nm in bottomCount) {
        if (bottomCount[nm] >= dayThreshold) deadMenus.push({ nama: nm, count: bottomCount[nm] });
      }
      var heroMenus = [];
      for (var nm in topCount) {
        if (topCount[nm] >= dayThreshold) heroMenus.push({ nama: nm, count: topCount[nm] });
      }

      produkInsight.status = totalDays < 4 ? "insufficient" : "ok";
      if (produkInsight.status === "insufficient") {
        produkInsight.desc = "Dibutuhkan minimal 4 hari data produk untuk mendeteksi pola konsisten.";
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
    // ─────────────────────────────────────────────────────────────────
    var dData = getAggregatedData(ss, "DB_Laporan_Harian");
    var kbData2 = getAggregatedData(ss, "DB_Inspeksi_Operasional");
    var hygieneInsight = { modul: "Korelasi Kebersihan & Omset", status: "insufficient", level: "info", title: "", desc: "", action: "" };

    if (dData.length > 1 && kbData2 && kbData2.length > 1) {
      // Hitung omset rata-rata harian dalam periode
      var totalOmset = 0, omsetCount = 0;
      var targetTotal = 0;
      for (var i = 1; i < dData.length; i++) {
        var rowDateStr = (dData[i][1] || "").toString(); // Col B (Index 1): Tanggal
        var rd = normDate(rowDateStr);
        if (!rd || rd < startDate || rd > endDate) continue;
        var rowOut = (dData[i][3] || "").toString(); // Col D (Index 3): Outlet
        if (!outletMatch(rowOut)) continue;
        
        totalOmset += Number(dData[i][6] || 0); // Col G (Index 6): Omset
        targetTotal += rowOut.toLowerCase() === "perintis" ? 6000000 : 5300000;
        omsetCount++;
      }

      // Hitung skor kebersihan rata-rata
      var kbTotal = 0, kbCount = 0;
      for (var i = 1; i < kbData2.length; i++) {
        var idLaporan = String(kbData2[i][0] || "");
        if (!idLaporan) continue;
        var parts = idLaporan.split("-");
        if (parts.length < 4) continue;
        
        var kbDateStr = parts[0] + "-" + parts[1] + "-" + parts[2];
        var krd = normDate(kbDateStr);
        if (!krd || krd < startDate || krd > endDate) continue;
        
        var kbOutlet = parts.slice(3).join("-").trim().replace(/_/g, " ");
        if (!outletMatch(kbOutlet)) continue;
        
        var kategori = String(kbData2[i][1] || "");
        if (kategori.toLowerCase() === "kebersihan") {
          kbTotal += Number(kbData2[i][3] || 0); // Col D (Index 3): Skor
          kbCount++;
        }
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
    // Baca DB_Kehadiran_Staf untuk tren keterlambatan
    // ─────────────────────────────────────────────────────────────────
    var hadirSheet = ss.getSheetByName("DB_Kehadiran_Staf");
    var sdmInsight = { modul: "SDM & Risiko Operasional", status: "insufficient", level: "info", title: "", desc: "", action: "" };

    if (hadirSheet) {
      var hData = hadirSheet.getDataRange().getValues();
      var telatCount = 0;
      var totalHadir = 0;

      for (var i = 1; i < hData.length; i++) {
        var idLaporan = hData[i][0].toString();
        var idParts = idLaporan.split("-");
        if(idParts.length < 4) continue;
        
        var d = parseInt(idParts[0], 10);
        var m = parseInt(idParts[1], 10) - 1;
        var y = parseInt(idParts[2], 10);
        var rowDate = new Date(y, m, d).getTime();
        var rowOut = idParts.slice(3).join("-").trim();
        var statusHadir = hData[i][5].toString().toLowerCase();

        if (!rowDate || rowDate < startDate || rowDate > endDate) continue;
        if (!outletMatch(rowOut)) continue;

        totalHadir++;
        if (statusHadir.indexOf("terlambat") !== -1) {
          telatCount++;
        }
      }
      
      var telatRate = totalHadir > 0 ? (telatCount / totalHadir) * 100 : 0;
      
      sdmInsight.status = totalHadir < 5 ? "insufficient" : "ok";
      if (sdmInsight.status === "insufficient") {
        sdmInsight.desc = "Dibutuhkan lebih banyak data kehadiran staf untuk menganalisis pola kedisiplinan.";
      } else if (telatRate > 15) {
        sdmInsight.level = "critical";
        sdmInsight.title = "Krisis Kedisiplinan: " + Math.round(telatRate) + "% Shift Terlambat";
        sdmInsight.desc = "Tingkat keterlambatan sangat tinggi. Ini berisiko merusak The Zero Vibe karena pelayanan lambat atau tidak siap saat buka.";
        sdmInsight.action = "Panggil SPV untuk evaluasi tegas. Jika staf terus melanggar, pertimbangkan Surat Peringatan (SP).";
      } else if (telatRate > 5) {
        sdmInsight.level = "warning";
        sdmInsight.title = "Warning: Mulai Ada Pola Keterlambatan";
        sdmInsight.desc = Math.round(telatRate) + "% shift mengalami keterlambatan staf.";
        sdmInsight.action = "Minta SPV mengingatkan staf soal SOP kehadiran di briefing berikutnya.";
      } else {
        sdmInsight.level = "positive";
        sdmInsight.title = "Kedisiplinan Sangat Baik";
        sdmInsight.desc = "Tingkat keterlambatan hanya " + Math.round(telatRate) + "%. Tim bekerja dengan komitmen tinggi terhadap jadwal operasional.";
        sdmInsight.action = "Beri apresiasi (reward lisan/bonus) ke tim untuk mempertahankan moral kerja positif.";
      }
    }
    insights.push(sdmInsight);

    // ─────────────────────────────────────────────────────────────────
    // MODUL C5: Benchmarking ATS (Average Ticket Size)
    // Bandingkan ATS aktual dengan benchmark yang di-set GM
    // ─────────────────────────────────────────────────────────────────
    var atsInsight = { modul: "Benchmarking ATS Industri", status: "insufficient", level: "info", title: "", desc: "", action: "" };
    
    // Gunakan benchmarkATS langsung dari payload UI (menghindari lag 1 langkah)
    var effectiveBenchmark = benchmarkATS;

    if (dData && dData.length > 1) {
      var totalOmsetATS = 0, totalTransATS = 0;
      for (var i = 1; i < dData.length; i++) {
        var rd = normDate(dData[i][1]);
        if (!rd || rd < startDate || rd > endDate) continue;
        if (!outletMatch(dData[i][3].toString())) continue;
        totalOmsetATS += Number(dData[i][6] || 0);
        totalTransATS += Number(dData[i][8] || 0);
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

// ==========================================
// CRON JOB / CACHE AGGREGATOR
// ==========================================
function trigger_NightlyCache(targetDateStr) {
  var ss = getSpreadsheet();
  var cacheSheet = ss.getSheetByName("Database_GM_Cache");
  if (!cacheSheet) {
    cacheSheet = ss.insertSheet("Database_GM_Cache");
    cacheSheet.appendRow(["Tanggal", "Outlet", "OmsetTotal", "TransaksiTotal", "KomplainTotal", "RemakeTotal", "SkorKebersihan", "SelisihKas", "Cuaca", "KepatuhanSOP", "Telat", "Teguran"]);
    cacheSheet.setFrozenRows(1);
  }
  
  // Jika tidak ada targetDateStr, gunakan H-1 (kemarin) karena jalan jam 2 pagi
  var targetDate = new Date();
  if (!targetDateStr) {
    targetDate.setDate(targetDate.getDate() - 1);
    targetDateStr = targetDate.getFullYear() + "-" + 
                    ("0" + (targetDate.getMonth()+1)).slice(-2) + "-" + 
                    ("0" + targetDate.getDate()).slice(-2);
  }
  
  var dailyData = getAggregatedData(ss, "DB_Laporan_Harian");
  var kebersihanData = getAggregatedData(ss, "DB_Inspeksi_Operasional");
  
  var outlets = ["Perintis", "Dg Tata"]; // Asumsi outlet statis atau ambil dari config
  
  for (var o = 0; o < outlets.length; o++) {
    var out = outlets[o];
    
    // Filter data hari itu untuk outlet tersebut
    var dRow = null;
    for (var i = 1; i < dailyData.length; i++) {
      var dDate = dailyData[i][2] ? parseDateToObj(dailyData[i][2]) : null;
      var strDate = dDate ? (dDate.getFullYear() + "-" + ("0" + (dDate.getMonth()+1)).slice(-2) + "-" + ("0" + dDate.getDate()).slice(-2)) : "";
      if (String(dailyData[i][3]).toLowerCase() === out.toLowerCase() && strDate === targetDateStr) {
        dRow = dailyData[i];
        break;
      }
    }
    
    var kRow = null;
    for (var j = 1; j < kebersihanData.length; j++) {
      var kId = String(kebersihanData[j][0] || "");
      if (!kId) continue;
      var kParts = kId.split("-");
      if (kParts.length < 4) continue;
      var kbDateStr = kParts[0] + "-" + kParts[1] + "-" + kParts[2];
      var kDate = parseDateToObj(kbDateStr);
      var strKDate = kDate ? (kDate.getFullYear() + "-" + ("0" + (kDate.getMonth()+1)).slice(-2) + "-" + ("0" + kDate.getDate()).slice(-2)) : "";
      var kOutlet = kParts.slice(3).join("-").trim().replace(/_/g, " ");
      if (kOutlet.toLowerCase() === out.toLowerCase() && strKDate === targetDateStr) {
        kRow = kebersihanData[j];
        break;
      }
    }
    
    if (dRow) {
      var omset = Number(dRow[6] || 0); // Col G: Omset
      var trx = Number(dRow[8] || 0); // Col I: Transaksi
      var komplain = 0; // Not available in new daily schema directly
      var remake = 0; 
      var selisih = Number(dRow[9] || 0); // Col J: Selisih
      var cuaca = "Cerah"; // Default, not tracked in daily schema anymore
      var telat = 0;
      var teguran = 0;
      
      var skorKebersihan = 0;
      if (kRow) {
         try { skorKebersihan = Number(kRow[3]); } catch(e){} // Col D: Skor
      }
      
      var newRow = [
        targetDateStr,
        out,
        omset,
        trx,
        komplain,
        remake,
        skorKebersihan,
        selisih,
        cuaca,
        (skorKebersihan >= 90 ? 100 : skorKebersihan),
        telat,
        teguran
      ];
      
      // Cek apakah sudah ada di cache, jika ada update, jika tidak append
      var cacheData = cacheSheet.getDataRange().getValues();
      var found = false;
      for (var c = 1; c < cacheData.length; c++) {
        var cDate = cacheData[c][0];
        if (cDate && cDate.toString().indexOf(targetDateStr) !== -1 && String(cacheData[c][1]).toLowerCase() === out.toLowerCase()) {
          cacheSheet.getRange(c + 1, 1, 1, newRow.length).setValues([newRow]);
          found = true;
          break;
        }
      }
      
      if (!found) {
        cacheSheet.appendRow(newRow);
      }
    }
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Zero Cafe Admin')
    .addItem('Hard Reset Database', 'hardResetDatabase')
    .addItem('Build New Architecture', 'buildNewArchitecture')
    .addItem('Run All Mocks', 'runAllMocks')
    .addToUi();
}
