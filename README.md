# 🎯 HireMatch AI

> **Know your match before you apply.**  
> Paste a job description, upload your resume — get an AI-powered match score, skill gap analysis, and tailored interview questions in seconds.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-166534?style=for-the-badge)](https://hire-match-ai.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/ikshvaku-vns/HireMatch_AI/ci.yml?style=for-the-badge&label=CI)](https://github.com/ikshvaku-vns/HireMatch_AI/actions)

---

## ✨ Features

- **Match Score (0–100)** — Animated circular score meter with color-coded verdict (green / yellow / red) and sub-scores for Skills Match, Experience Relevance, Education Fit, and Keywords Coverage
- **Skill Gap Analysis** — Side-by-side view of skills you have vs skills you are missing, with prioritized suggestions on what to add
- **AI Interview Questions** — 10 role-specific questions split into Technical, Behavioural, and Gap Probing categories, each with a "what a good answer looks like" hint
- **Resume Rewriter** — AI rewrites your weak bullet points to be JD-aligned, shown as original vs improved side by side
- **Shareable Report** — Every analysis gets a unique link valid for 24 hours — share with a mentor or recruiter
- **PDF Export** — Download a clean summary of your full analysis

---

## 🚀 Live Demo

👉 **[hire-match-ai.vercel.app](https://hire-match-ai.vercel.app/)**

No login required. Paste any JD, upload any resume PDF, and get results in under 10 seconds.

---

## 🛠️ Tech Stack

| Layer       | Technology                                       |
| ----------- | ------------------------------------------------ |
| Frontend    | React + TypeScript + Tailwind CSS                |
| Backend     | Node.js + Express + TypeScript                   |
| AI Engine   | Gemini 2.0 Flash (`@google/genai`)               |
| PDF Parsing | `pdf-parse` + `Multer`                           |
| Database    | MongoDB with 24hr TTL index (shareable links)    |
| Deployment  | Vercel (frontend) + Render (backend)             |
| CI/CD       | GitHub Actions — lint + type check on every push |

---

## 🧠 How It Works

```
User pastes JD + uploads PDF resume
          ↓
Backend extracts text from PDF (pdf-parse + Multer)
          ↓
Constructs structured prompt with JD + resume text
          ↓
Gemini 2.0 Flash returns strict JSON response
          ↓
Result saved to MongoDB with 24hr TTL + unique shareId
          ↓
Frontend renders score, gaps, questions, suggestions
```

The entire intelligence of this app lives in one carefully engineered prompt that instructs Gemini to return a strict JSON schema — score, breakdown, skill gaps, interview questions, and resume suggestions in a single API call.

---

## ⚙️ Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/ikshvaku-vns/HireMatch_AI.git
cd HireMatch_AI

# 2. Install backend dependencies
cd backend && npm install

# 3. Install frontend dependencies
cd ../frontend && npm install

# 4. Set up environment variables
cp backend/.env.example backend/.env
# Fill in your GEMINI_API_KEY and MONGO_URI

# 5. Start backend (terminal 1)
cd backend && npm run dev

# 6. Start frontend (terminal 2)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_atlas_uri_here
PORT=5001
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_BACKEND_URL=http://localhost:5001
```

Get your Gemini API key free at [aistudio.google.com](https://aistudio.google.com)

---

## 📐 Prompt Engineering

The quality of this entire product depends on one carefully designed prompt. Key decisions:

- **Strict JSON schema** enforced via `responseMimeType: 'application/json'` — zero parsing errors
- **Scoring calibration guide** included to prevent Gemini from inflating scores (most naive implementations score everyone 70–85 regardless)
- **Structured suggestions** returned as `{ original, improved, reason }` objects to power the side-by-side resume rewriter UI
- **Exactly 10 questions** requested (5 Technical, 3 Behavioural, 2 Gap Probing) for consistent output
- **Confidence field** flags low-quality or irrelevant resumes rather than confidently mis-scoring them

---

## 📁 Project Structure

```
HireMatch_AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ScoreMeter.tsx         # Animated circular score ring
│   │   │   ├── GapAnalysis.tsx        # Skills found vs missing
│   │   │   ├── InterviewQuestions.tsx # Expandable question cards
│   │   │   └── ResumeTips.tsx         # Original vs improved bullets
│   │   ├── pages/
│   │   │   ├── Home.tsx               # JD + resume upload form
│   │   │   └── Results.tsx            # Full analysis results
│   │   └── App.tsx
│   ├── vercel.json
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── analyze.ts             # POST /api/analyze
│   │   ├── services/
│   │   │   ├── gemini.ts              # Prompt engineering + Gemini API call
│   │   │   └── pdfParser.ts           # PDF text extraction
│   │   ├── models/
│   │   │   └── Analysis.ts            # MongoDB model with TTL
│   │   └── index.ts
│   └── package.json
│
└── README.md
```

---

## 🗺️ Roadmap

- [ ] User accounts and saved analysis history
- [ ] Bulk resume comparison — score multiple candidates against one JD
- [ ] Chrome extension — analyze any LinkedIn job posting in one click
- [ ] ATS keyword density heatmap

---

## 👤 Author

**Ankit Anand**  
[GitHub](https://github.com/ikshvaku-vns) · [LinkedIn](https://linkedin.com/in/ankitanand) · ankitanand101996@gmail.com

---

<p align="center">Built as a portfolio project · Powered by Gemini AI</p>
