const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * POST /expenses (idempotent)
 */
app.post("/expenses", (req, res) => {
  const { amount, category, description, date } = req.body;
  const idempotencyKey = req.headers["idempotency-key"];

  if (!amount || amount <= 0 || !date) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (!idempotencyKey) {
    return res.status(400).json({ error: "Missing Idempotency-Key" });
  }

  try {
    // check duplicate
    const existing = db
      .prepare("SELECT * FROM expenses WHERE idempotency_key = ?")
      .get(idempotencyKey);

    if (existing) {
      return res.json(existing);
    }

    // create new
    const id = uuidv4();
    const created_at = new Date().toISOString();

    db.prepare(`
      INSERT INTO expenses 
      (id, amount, category, description, date, created_at, idempotency_key)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, amount, category, description, date, created_at, idempotencyKey);

    return res.json({
      id,
      amount,
      category,
      description,
      date,
      created_at,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /expenses (filter + sort)
 */
app.get("/expenses", (req, res) => {
  const { category, sort } = req.query;

  try {
    let query = "SELECT * FROM expenses";
    let params = [];

    if (category) {
      query += " WHERE category = ?";
      params.push(category);
    }

    if (sort === "date_desc") {
      query += " ORDER BY date DESC";
    }

    const rows = db.prepare(query).all(...params);

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("API working");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});