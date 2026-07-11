const fs = require('fs');
const path = require('path');
const { clearIndex, storeIndex } = require('./database.js');

// Direktori root workspace
const workspaceRoot = path.resolve(__dirname, '../../');

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    // Hindari folder internal
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

function extractFunctions(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const functions = [];

  // Regex sederhana untuk menangkap definisi fungsi JS/GS
  // Menangkap: function namaFungsi(args) atau const namaFungsi = function(args) atau async function namaFungsi(args)
  const regex = /(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    while ((match = regex.exec(line)) !== null) {
      functions.push({
        function_name: match[1],
        file_path: filePath.replace(workspaceRoot + '/', ''), // simpan path relatif
        line_number: i + 1,
        signature: match[0].trim()
      });
    }
    
    // Tangkap format: const/let/var namaFungsi = (args) =>
    const arrowRegex = /(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g;
    while ((match = arrowRegex.exec(line)) !== null) {
      functions.push({
        function_name: match[1],
        file_path: filePath.replace(workspaceRoot + '/', ''),
        line_number: i + 1,
        signature: match[0].trim()
      });
    }
  }
  
  return functions;
}

async function runIndexer() {
  console.error("Memulai pemindaian codebase...");
  const files = walkDir(workspaceRoot);
  let allFunctions = [];
  
  for (const file of files) {
    const funcs = extractFunctions(file);
    allFunctions = allFunctions.concat(funcs);
  }
  
  await clearIndex();
  await storeIndex(allFunctions);
  console.error(`Pemindaian selesai. Berhasil meng-index ${allFunctions.length} fungsi dari ${files.length} file.`);
  return allFunctions.length;
}

module.exports = {
  runIndexer
};
