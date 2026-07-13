const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Create the main table
      db.run(`
        CREATE TABLE IF NOT EXISTS lessons_learned (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          content TEXT NOT NULL,
          tags TEXT DEFAULT '',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) return reject(err);

        // Safely try to add 'tags' column if upgrading from old version
        db.run(`ALTER TABLE lessons_learned ADD COLUMN tags TEXT DEFAULT ''`, () => {
          // Ignore error if column already exists
          
          // 2. Create the FTS5 virtual table
          db.run(`
            CREATE VIRTUAL TABLE IF NOT EXISTS lessons_fts USING fts5(
              category, content, tags, content='lessons_learned', content_rowid='id'
            )
          `, (err2) => {
            if (err2) return reject(err2);

            // 3. Create triggers to keep FTS5 in sync
            const triggers = `
              CREATE TRIGGER IF NOT EXISTS lessons_ai AFTER INSERT ON lessons_learned BEGIN
                INSERT INTO lessons_fts(rowid, category, content, tags) VALUES (new.id, new.category, new.content, new.tags);
              END;
              CREATE TRIGGER IF NOT EXISTS lessons_ad AFTER DELETE ON lessons_learned BEGIN
                INSERT INTO lessons_fts(lessons_fts, rowid, category, content, tags) VALUES('delete', old.id, old.category, old.content, old.tags);
              END;
              CREATE TRIGGER IF NOT EXISTS lessons_au AFTER UPDATE ON lessons_learned BEGIN
                INSERT INTO lessons_fts(lessons_fts, rowid, category, content, tags) VALUES('delete', old.id, old.category, old.content, old.tags);
                INSERT INTO lessons_fts(rowid, category, content, tags) VALUES (new.id, new.category, new.content, new.tags);
              END;
            `;
            
            db.exec(triggers, (err3) => {
              if (err3) return reject(err3);
              
              // Codebase index
              db.run(`
                CREATE TABLE IF NOT EXISTS codebase_index (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  function_name TEXT NOT NULL,
                  file_path TEXT NOT NULL,
                  line_number INTEGER NOT NULL,
                  signature TEXT
                )
              `, (err4) => {
                if (err4) reject(err4);
                else resolve();
              });
            });
          });
        });
      });
    });
  });
}

function storeMemory(category, content, tags = '') {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO lessons_learned (category, content, tags) VALUES (?, ?, ?)');
    stmt.run([category, content, tags], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
    stmt.finalize();
  });
}

function recallMemory(query) {
  return new Promise((resolve, reject) => {
    // Escape query for FTS5 syntax
    const ftsQuery = query.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/).join(' OR ');
    
    // Use FTS5 MATCH for semantic-like full text search, fallback to LIKE if FTS fails
    db.all(`
      SELECT l.*, f.rank as rank 
      FROM lessons_fts f
      JOIN lessons_learned l ON f.rowid = l.id
      WHERE lessons_fts MATCH ?
      ORDER BY rank
      LIMIT 10
    `, [ftsQuery], (err, rows) => {
      if (err) {
        // Fallback to basic LIKE if FTS syntax error
        const q = `%${query}%`;
        db.all(`
          SELECT * FROM lessons_learned 
          WHERE category LIKE ? OR content LIKE ? OR tags LIKE ?
          ORDER BY created_at DESC
          LIMIT 10
        `, [q, q, q], (err2, rows2) => {
          if (err2) reject(err2);
          else resolve(rows2);
        });
      } else {
        resolve(rows);
      }
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
