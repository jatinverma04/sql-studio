# CipherSQLStudio

> A browser-based SQL learning platform where students practice queries against real PostgreSQL datasets with intelligent AI hints.

---

## Project Structure

```
cipherSqlStudio/
├── backend/         # Node.js + Express API
│   ├── src/
│   │   ├── config/       # PostgreSQL + MongoDB connections
│   │   ├── controllers/  # Route logic
│   │   ├── middleware/   # Error handling
│   │   ├── models/       # Mongoose models (Assignment, QueryAttempt)
│   │   ├── routes/       # Express routes
│   │   ├── seed/         # DB seed scripts
│   │   └── services/     # queryService, llmService
│   ├── .env.example
│   └── package.json
└── frontend/        # React + Vite + SCSS
    ├── src/
    │   ├── components/   # SqlEditor, ResultsTable, SchemaViewer, HintPanel, Navbar
    │   ├── pages/        # AssignmentsPage, AttemptPage
    │   ├── services/     # Axios API client
    │   └── styles/       # SCSS partials: _variables, _mixins, main.scss
    ├── .env.example
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL (local or hosted, e.g. Supabase/Render)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key (https://aistudio.google.com/app/apikey)

---

### 1. Clone & Setup Backend

```bash
cd backend
npm install

# Copy and fill in environment variables
cp .env.example .env
# Edit .env with your POSTGRES_URL, MONGODB_URI, GEMINI_API_KEY
```

**`.env` values:**

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `POSTGRES_URL` | PostgreSQL connection string |
| `MONGODB_URI` | MongoDB connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CORS_ORIGIN` | Frontend URL (default: http://localhost:5173) |

### 2. Seed the Databases

```bash
# Seed PostgreSQL with sample data (E-Commerce, Library, HR datasets)
npm run seed:postgres

# Seed MongoDB with assignment documents
npm run seed:mongo
```

### 3. Start Backend

```bash
npm run dev    # Development (with nodemon)
npm start      # Production
```

Backend runs at: `http://localhost:5000`

---

### 4. Setup Frontend

```bash
cd frontend
npm install

cp .env.example .env
# Edit VITE_API_URL if backend runs on a different port
```

### 5. Start Frontend

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id` | Assignment detail + table data |
| POST | `/api/assignments/:id/execute` | Execute SQL query |
| POST | `/api/assignments/:id/hint` | Get AI hint |
| GET | `/api/assignments/:id/attempts` | Query attempt history |

---

## Technology Choices

| Component | Technology | Reason |
|---|---|---|
| **Frontend** | React + Vite | Fast dev server, modern tooling |
| **Styling** | Vanilla SCSS | Full CSS control, BEM naming, variables/mixins |
| **SQL Editor** | Monaco Editor | Industry-standard, SQL highlighting + autocomplete |
| **Backend** | Node.js + Express | Lightweight, async-friendly |
| **Sandbox DB** | PostgreSQL | Industry-standard SQL database for exercises |
| **Persistence DB** | MongoDB (Atlas) | Flexible schema for assignments and metadata |
| **LLM** | Google Gemini | High-quality reasoning, generous free tier |

---

## Sample Datasets

The PostgreSQL sandbox is seeded with **3 datasets**:

| Dataset | Tables |
|---|---|
| **E-Commerce** | `customers`, `products`, `orders`, `order_items` |
| **Library** | `authors`, `books`, `members`, `loans` |
| **HR** | `departments`, `employees`, `salaries` |

---

## Security

- Only `SELECT` statements are permitted in the sandbox
- DDL commands (`DROP`, `CREATE`, `ALTER`, `TRUNCATE`) are blocked
- Multiple statements (`;` followed by more content) are blocked
- PostgreSQL statement timeout set to 10 seconds
- Table allowlist per assignment (users can only query relevant tables)

---

## LLM Hint System

The Gemini integration is carefully prompted to:
- Provide **conceptual guidance only** — not complete queries
- Ask leading questions to guide the student's thinking
- Explain relevant SQL concepts or clauses they may be missing
- Never write or complete the student's query

---

## Data Flow

```
User writes SQL → Frontend validates → POST /execute
     ↓
Backend validates (SELECT only, no DDL, table allowlist)
     ↓
PostgreSQL sandbox executes query (10s timeout)
     ↓
Results returned to frontend as { columns, rows, rowCount }
     ↓
ResultsTable component renders formatted table
     ↓
(Optionally) QueryAttempt saved to MongoDB
```
