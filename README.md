# 🤖 CampusAI — Smart College Assistant

A full-stack AI chatbot web app combining **Study Buddy**, **Placement Preparation**, and **Feedback & Analytics** — built with React, FastAPI, Supabase, and Grok API.

---

## 🧩 Modules

| Module | Description |
|--------|-------------|
| **Study Buddy** | Upload PDFs, ask questions (RAG), get summaries & quizzes |
| **Placement Prep** | Aptitude questions, resume tips, mock interviews |
| **Feedback & Analytics** | Structured feedback collection with admin dashboard |

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router, Chart.js |
| Backend | Python, FastAPI, Google Gemini AI |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| File Storage | Supabase Storage |
| Deployment | Netlify (frontend), Vercel (backend) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Supabase account ([supabase.com](https://supabase.com))
- Google Gemini API key ([aistudio.google.com](https://aistudio.google.com))

### 1. Supabase Setup
1. Create a new Supabase project
2. Go to **SQL Editor** → paste contents of `supabase/migration.sql` → **Run**
3. Go to **Storage** → create a bucket named `study-materials`
4. Go to **Settings > API** → copy your:
   - Project URL
   - `anon` public key
   - `service_role` secret key
5. Go to **Settings > API > JWT Settings** → copy the JWT Secret

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Create .env file with:
# SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...
# SUPABASE_JWT_SECRET=...
# GEMINI_API_KEY=...

uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file with:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
# VITE_API_URL=  (leave empty for dev, Vite proxies to localhost:8000)

npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
chatbot/
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/  # Layout, Sidebar, ChatWindow, FileUpload, etc.
│   │   ├── pages/       # Login, Signup, StudyBuddy, PlacementPrep, Feedback, Admin
│   │   ├── services/    # API client, Supabase client
│   │   └── context/     # Auth context
│   └── ...
├── backend/             # FastAPI
│   ├── app/
│   │   ├── routers/     # chat, study_buddy, placement, feedback, analytics
│   │   ├── services/    # gemini, pdf_processor, sentiment
│   │   ├── auth.py      # JWT validation
│   │   └── main.py      # App factory
│   └── ...
└── supabase/
    └── migration.sql    # Database schema
```

---

## 🌐 Deployment

### Netlify (Frontend)
1. Push `frontend/` to GitHub
2. Connect to Netlify → Build: `npm run build`, Publish: `dist`
3. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`
4. Add `_redirects` file: `/* /index.html 200`

### Vercel (Backend)
1. Push `backend/` to GitHub
2. Import to Vercel → Root: `backend`
3. Add env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `GEMINI_API_KEY`

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/chat/sessions` | Create chat session |
| GET | `/api/chat/sessions` | List sessions |
| POST | `/api/chat/sessions/{id}/messages` | Send message |
| POST | `/api/study/upload` | Upload PDF |
| POST | `/api/study/ask` | Ask about materials |
| POST | `/api/study/summarize` | Summarize material |
| POST | `/api/study/quiz` | Generate quiz |
| POST | `/api/placement/aptitude` | Aptitude questions |
| POST | `/api/placement/resume-tips` | Resume suggestions |
| POST | `/api/placement/mock-interview` | Mock interview |
| POST | `/api/feedback/submit` | Submit feedback |
| GET | `/api/analytics/summary` | Admin analytics |

---

## 📄 License

MIT — Built for educational purposes.
