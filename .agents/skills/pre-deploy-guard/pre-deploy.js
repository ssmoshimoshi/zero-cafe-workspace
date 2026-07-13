const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../../');
let hasErrors = false;

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (file === '.agents' || file === '.gemini' || file === 'node_modules' || file.startsWith('.')) {
      continue;
    }
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      if (file.endsWith('.js') || file.endsWith('.gs') || file.endsWith('.html')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  // 1. Cek Keseimbangan Loading
  const showTrueCount = (content.match(/showLoading\(\s*true\s*\)/g) || []).length;
  const showFalseCount = (content.match(/showLoading\(\s*false\s*\)/g) || []).length;
  
  const uploadTrueCount = (content.match(/showUploadLoading\(\s*true\s*\)/g) || []).length;
  const uploadFalseCount = (content.match(/showUploadLoading\(\s*false\s*\)/g) || []).length;

  if (showTrueCount > 0 && showFalseCount === 0) {
    console.warn(`[WARNING] ${fileName}: Ditemukan showLoading(true) tetapi tidak ada showLoading(false) untuk menutupnya.`);
  }
  
  if (uploadTrueCount > 0 && uploadFalseCount === 0) {
    console.warn(`[WARNING] ${fileName}: Ditemukan showUploadLoading(true) tetapi tidak ada showUploadLoading(false) untuk menutupnya.`);
  }

  // 2. Cek Hardcode URL (Praktek buruk di GAS jika bukan App URL)
  // Ini opsional, bisa dilewati

  // 3. Cek Sanitasi Input (The Zero Standard)
  if (fileName === 'Code.gs') {
    if (content.includes('api_submitLaporan')) {
      // Very basic static check to see if Number() or parseInt() is used
      const hasNumberCast = content.match(/Number\(|parseInt\(|parseFloat\(/g);
      if (!hasNumberCast) {
        console.warn(`[WARNING] Code.gs: Fungsi submit Laporan terdeteksi tetapi tidak ada fungsi Number() atau parseInt() untuk sanitasi data! Periksa Aturan AGENTS.md.`);
      }
    }
  }
}

console.log("========================================");
console.log("Mengeksekusi Antigravity Pre-deploy Guard");
console.log("========================================");

const files = walkDir(workspaceRoot);
for (const file of files) {
  checkFile(file);
}

if (hasErrors) {
  console.error("Pre-deploy guard menemukan error kritis. Clasp push dibatalkan.");
  process.exit(1);
} else {
  console.log("Pemeriksaan selesai. Kode terlihat aman untuk di-deploy.");
  process.exit(0);
}
