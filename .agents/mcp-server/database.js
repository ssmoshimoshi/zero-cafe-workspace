const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Buat tabel untuk memori pelajaran lintas sesi
      db.run(`
        CREATE TABLE IF NOT EXISTS lessons_learned (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) return reject(err);
        
        db.run(`
          CREATE TABLE IF NOT EXISTS codebase_index (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            function_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            line_number INTEGER NOT NULL,
            signature TEXT
          )
        `, (err2) => {
          if (err2) reject(err2);
          else resolve();
        });
      });
    });
  });
}

function storeMemory(category, content) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO lessons_learned (category, content) VALUES (?, ?)');
    stmt.run([category, content], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
    stmt.finalize();
  });
}

function recallMemory(query) {
  return new Promise((resolve, reject) => {
    const q = `%${query}%`;
    db.all(`
      SELECT * FROM lessons_learned 
      WHERE category LIKE ? OR content LIKE ?
      ORDER BY created_at DESC
    `, [q, q], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function clearIndex() {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM codebase_index`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function storeIndex(items) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      const stmt = db.prepare('INSERT INTO codebase_index (function_name, file_path, line_number, signature) VALUES (?, ?, ?, ?)');
      for (const item of items) {
        stmt.run([item.function_name, item.file_path, item.line_number, item.signature]);
      }
      stmt.finalize();
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

function queryIndex(funcName) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM codebase_index 
      WHERE function_name LIKE ?
    `, [`%${funcName}%`], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  initDb,
  storeMemory,
  recallMemory,
  clearIndex,
  storeIndex,
  queryIndex
};
