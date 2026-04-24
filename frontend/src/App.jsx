import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      let url = `${API}/expenses?sort=date_desc`;
      if (category) url += `&category=${category}`;

      const res = await fetch(url);
      const data = await res.json();
      setExpenses(data);
    } catch {
      alert("Error fetching expenses");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.amount <= 0) {
      alert("Amount must be positive");
      return;
    }

    await fetch(`${API}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": uuidv4(),
      },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
      }),
    });

    setForm({ amount: "", category: "", description: "", date: "" });
    fetchExpenses();
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="container">
      <h1>💸 Expense Tracker</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <input
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          <button disabled={loading}>
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>

      <div className="controls">
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="shopping">Shopping</option>
        </select>
      </div>

      <div className="summary">
        <h2>Total: ₹{total}</h2>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="empty">No expenses yet</p>
      ) : (
        <div className="list">
          {expenses.map((e) => (
            <div key={e.id} className="expense">
              <div>
                <strong>₹{e.amount}</strong>
                <p>{e.description}</p>
              </div>
              <div className="right">
                <span>{e.category}</span>
                <small>{e.date}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;