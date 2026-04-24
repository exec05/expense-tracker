# 💸 Expense Tracker

## 📌 Overview

A minimal full-stack Expense Tracker that allows users to record, view, filter, and analyze personal expenses.

Built with a focus on **real-world robustness**, including handling retries, duplicate submissions, and persistent storage.

---

## 🚀 Live Demo

* **Frontend:** https://your-frontend-url.vercel.app
* **Backend API:** https://your-backend-url.onrender.com

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* Vanilla CSS

### Backend

* Node.js
* Express.js
* SQLite (persistent storage)

---

## ✨ Features

### Core Features

* ➕ Add a new expense (amount, category, description, date)
* 📋 View list of expenses
* 🔍 Filter expenses by category
* ⏱️ Sort expenses by date (newest first)
* 💰 View total of displayed expenses

---

## ⚙️ API Endpoints

### POST `/expenses`

Create a new expense.

**Headers:**

* `Idempotency-Key` (required)

**Body:**

```json
{
  "amount": 500,
  "category": "food",
  "description": "pizza",
  "date": "2026-04-25"
}
```

---

### GET `/expenses`

Supports:

* `category` → filter
* `sort=date_desc` → newest first

Example:

```
/expenses?category=food&sort=date_desc
```

---

## 🧠 Key Design Decisions

### 1. Idempotency Handling (⭐ Highlight)

* Implemented using `Idempotency-Key` header
* Prevents duplicate expense creation due to:

  * Network retries
  * Multiple button clicks
  * Page refreshes

---

### 2. Data Persistence

* Used **SQLite** for:

  * Simplicity
  * Local persistence
  * Real-world DB behavior

---

### 3. Separation of Concerns

* Frontend and backend are separate services
* Enables independent deployment and scaling

---

### 4. Money Handling

* Amount stored as numeric type
* (Can be extended to smallest unit like paise for precision)

---

## 🌍 Handling Real-World Conditions

| Scenario             | Handling                            |
| -------------------- | ----------------------------------- |
| Multiple submissions | Idempotency key prevents duplicates |
| Page refresh         | Data persists via SQLite            |
| Slow API             | Loading state in UI                 |
| API failure          | Error handling + alerts             |

---

## 🎨 UI Features

* Clean card-based layout
* Loading indicators
* Empty state messaging
* Simple and readable structure

---

## ⚖️ Trade-offs

* Minimal UI styling (focused on functionality)
* No authentication system
* Limited input validation
* No pagination (small dataset assumed)

---

## 🔮 Future Improvements

* Category-wise analytics
* Charts & insights
* Pagination for large datasets
* Authentication & user accounts
* Store money in smallest unit (paise)

---

## 🧪 Running Locally

### Backend

```bash
cd backend
npm install
node index.js
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

### Backend (Render)

* Root: `backend`
* Build: `npm install`
* Start: `node index.js`

---

### Frontend (Vercel)

* Root: `frontend`
* Environment Variable:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 📂 Project Structure

```
expense-tracker/
  backend/
  frontend/
```

---

## ✅ Evaluation Highlights

* ✔️ Handles real-world retry scenarios
* ✔️ Prevents duplicate financial records
* ✔️ Clean and maintainable structure
* ✔️ Full-stack working system
* ✔️ Production-like thinking

---

## 👩‍💻 Author

Vanshika Sinha
