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

  db.get(
    "SELECT * FROM expenses WHERE idempotency_key = ?",
    [idempotencyKey],
    (err, existing) => {
      if (err) return res.status(500).json({ error: err.message });

      if (existing) {
        return res.json(existing); // prevent duplicate
      }

      const id = uuidv4();
      const created_at = new Date().toISOString();

      db.run(
        `INSERT INTO expenses 
        (id, amount, category, description, date, created_at, idempotency_key)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, amount, category, description, date, created_at, idempotencyKey],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            id,
            amount,
            category,
            description,
            date,
            created_at,
          });
        }
      );
    }
  );
});

/**
 * GET /expenses (filter + sort)
 */
app.get("/expenses", (req, res) => {
  const { category, sort } = req.query;

  let query = "SELECT * FROM expenses";
  let params = [];

  if (category) {
    query += " WHERE category = ?";
    params.push(category);
  }

  if (sort === "date_desc") {
    query += " ORDER BY date DESC";
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("API working");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// keep process alive (fix for nodemon exit)
setInterval(() => {}, 1000);