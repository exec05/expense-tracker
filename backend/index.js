const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * POST /expenses
 */
app.post("/expenses", (req, res) => {
  const { amount, category, description, date } = req.body;
  const idempotencyKey = req.headers["idempotency-key"];

  // Basic validation
  if (!amount || amount <= 0 || !date) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (!idempotencyKey) {
    return res.status(400).json({ error: "Missing Idempotency-Key" });
  }

  // 🔍 Check if request already processed
  db.get(
    "SELECT * FROM expenses WHERE idempotency_key = ?",
    [idempotencyKey],
    (err, existing) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // ✅ If duplicate → return same response
      if (existing) {
        return res.json(existing);
      }

      // 🆕 Create new expense
      const id = uuidv4();
      const created_at = new Date().toISOString();

      db.run(
        `INSERT INTO expenses 
        (id, amount, category, description, date, created_at, idempotency_key)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, amount, category, description, date, created_at, idempotencyKey],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          return res.json({
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
 * Health check
 */
app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});