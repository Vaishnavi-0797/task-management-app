// Opens (and creates, if missing) the SQLite database file.
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { dbPath } = require('../config/env');

const fullPath = path.resolve(__dirname, '..', dbPath);
fs.mkdirSync(path.dirname(fullPath), { recursive: true });

const db = new Database(fullPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON'); // makes the user_id foreign key actually enforced

module.exports = db;
