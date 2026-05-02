# Thumblytics AI 🎯

> **AI-powered YouTube Thumbnail Analyzer & CTR Optimizer — Full-Stack MERN SaaS**

![Tech Stack](https://img.shields.io/badge/Stack-MERN-6366f1?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-10b981?style=flat-square)

---

## 🚀 Features

- **CTR Score Algorithm** — Analyze brightness, contrast, color balance, text readability, face detection, curiosity gap & emotion score
- **AI Title Generator** — Generate click-worthy titles with emotion triggers
- **Dashboard** — Track all analyzed thumbnails and CTR trend
- **Auth System** — JWT-based authentication with HTTP-only cookies
- **Plan System** — Free (5 analyses/mo) vs Pro (unlimited)
- **Dark Mode** — Glassmorphism UI with 3D Three.js hero

---

## 📦 Project Structure

```
thumb/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # LandingPage, Login, Register, Dashboard, Analyzer, Generator, Pricing
│       ├── components/  # Navbar, DashboardLayout, ScoreGauge, HeroCanvas
│       ├── context/ # AuthContext
│       └── lib/     # axios api instance
└── server/          # Node.js + Express backend
    └── src/
        ├── models/       # User, Thumbnail
        ├── controllers/  # authController, thumbnailController
        ├── routes/       # authRoutes, thumbnailRoutes
        ├── middleware/   # auth, error, upload
        ├── utils/        # AppError, ctrAnalyzer, logger
        └── config/       # db.js
```

---

## ⚙️ Setup

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

Copy `server/.env.example` → `server/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/thumblytics
JWT_SECRET=your_secret_here
OPENAI_API_KEY=sk-...   # optional
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000  
Health Check: http://localhost:5000/health

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Register new user |
| POST | `/api/v1/auth/login` | ❌ | Login |
| POST | `/api/v1/auth/logout` | ✅ | Logout |
| GET | `/api/v1/auth/me` | ✅ | Get current user |
| POST | `/api/v1/thumbnails/analyze` | ✅ | Analyze thumbnail |
| GET | `/api/v1/thumbnails` | ✅ | Get all thumbnails |
| GET | `/api/v1/thumbnails/stats` | ✅ | Dashboard stats |
| POST | `/api/v1/thumbnails/generate-titles` | ✅ | AI title generation |
| DELETE | `/api/v1/thumbnails/:id` | ✅ | Delete thumbnail |
| GET | `/health` | ❌ | Health check |

---

## 🧠 CTR Score Algorithm

Weighted scoring across 7 factors:

| Factor | Weight |
|--------|--------|
| Contrast | 20% |
| Text Readability | 20% |
| Face Detection | 20% |
| Curiosity Gap | 12% |
| Brightness | 10% |
| Color Balance | 10% |
| Emotion Score | 8% |

---

## 🚀 Deployment

| Service | Platform |
|---------|---------|
| Frontend | Vercel |
| Backend | Render / Railway |
| Database | MongoDB Atlas |

---

## 🔒 Security

- Helmet.js HTTP headers
- Rate limiting (100 req/15min, 10 auth/15min)
- JWT in HTTP-only cookies
- Input validation via Zod
- bcryptjs password hashing (salt rounds: 12)
- CORS whitelisting

