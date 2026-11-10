const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file portfolio.db project root folder keessatti ofumaan uumama
const dbPath = path.resolve(__dirname, '../portfolio.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database wal-qunnamsiisuu irratti dogoggorri uumame:', err.message);
  } else {
    console.log('SQLite database wajjin milkaa\'inaan wal-qunnameera.');
  }
});

// Table 'videos' yoo hin jirre ofumaan uumuu
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    video_url TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Table uumuu irratti dogoggorri uumame:', err.message);
    } else {
      console.log('Table videos qophaa\'eera.');
    }
  });
});

module.exports = db;