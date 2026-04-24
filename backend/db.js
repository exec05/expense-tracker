const Database = require("better-sqlite3");

const db = new Database("expenses.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount INTEGER,
    category TEXT,
    description TEXT,
    date TEXT,
    created_at TEXT,
    idempotency_key TEXT UNIQUE
  )
`);

module.exports = db;