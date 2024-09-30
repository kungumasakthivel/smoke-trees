const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../db/sqlite.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL)`
    );

    db.run(`CREATE TABLE IF NOT EXISTS address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        )`
    );

});

module.exports = db;