// Creates the tables the first time the server starts.
const db = require('./db');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      title       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status      TEXT NOT NULL DEFAULT 'todo'
                  CHECK (status IN ('todo', 'in_progress', 'completed')),
      priority    TEXT NOT NULL DEFAULT 'medium'
                  CHECK (priority IN ('low', 'medium', 'high')),
      due_date    TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
  `);
}

module.exports = initDatabase;
