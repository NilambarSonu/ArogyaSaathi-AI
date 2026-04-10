# SwasthyaSaar AI — Healthcare Platform Monorepo

> *Empowering Every ASHA. Saving Every Life.*
> Harvard HSIL Hackathon 2026 | Team SwasthyaSaar

---

## 📦 Monorepo Structure

```
root/
├── artifacts/
│   ├── swasthyasaar/          # React/Vite frontend  (@workspace/swasthyasaar)
│   └── api-server/            # Express/Node backend  (@workspace/api-server)
├── lib/                       # Shared utilities (zod schemas, etc.)
├── scripts/                   # Workspace-level automation scripts
├── pnpm-workspace.yaml        # pnpm workspace config
├── package.json               # Root package (dev tooling only)
└── tsconfig.base.json         # Shared TypeScript base config
```

---

## 🗂️ Frontend Source Layout (`artifacts/swasthyasaar/src/`)

```
src/
├── types/            ← Shared TypeScript interfaces (Patient, Referral, etc.)
├── constants/        ← App-wide constants (routes, risk colors, API base URL)
├── mock/             ← Mock data barrel re-exports (use these, NOT src/data/)
├── services/         ← API integration layer
│   ├── apiClient.ts            # Fetch wrapper with mock/real toggle
│   ├── patientService.ts       # Patient CRUD + referrals
│   ├── assessmentService.ts    # Voice AI + risk scoring
│   └── analyticsService.ts     # Charts + ASHA performance
├── pages/            ← Route-level page components
├── components/       ← Reusable UI components
├── context/          ← React contexts (LanguageContext)
├── hooks/            ← Custom hooks
├── utils/            ← Pure utility functions (riskScoring.ts, voiceAI.ts)
├── data/             ← Raw mock data arrays (import via src/mock/ instead)
├── lib/              ← shadcn/ui utilities (utils.ts)
└── index.css         ← Global styles + Tailwind base
```

---

## 🔌 Backend API Routes (`artifacts/api-server/src/routes/`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/healthz` | Health check |
| GET | `/api/patients` | List all patients (supports `?risk=HIGH`) |
| GET | `/api/patients/:id` | Get patient by ID |
| POST | `/api/assess/voice` | Voice AI transcript analysis |
| POST | `/api/assess/maternal` | Maternal risk score calculation |
| POST | `/api/assess/ncd` | NCD risk score calculation |
| POST | `/api/assess/newborn` | Newborn risk score calculation |
| POST | `/api/assessments` | Save assessment to patient record |
| GET | `/api/analytics/ashas` | ASHA worker performance data |
| GET | `/api/analytics/risk-trend` | Monthly risk distribution chart |
| GET | `/api/analytics/condition-distribution` | Maternal/NCD/Newborn breakdown |
| GET | `/api/analytics/referral-completion` | Referral completion rate trend |
| GET | `/api/referrals` | List all active referrals |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm ≥ 8 (`npm install -g pnpm`)

### Install Dependencies
```bash
pnpm install
```

### Run Frontend (Demo Mode)
```powershell
# Windows PowerShell
$env:PORT=5000; $env:BASE_PATH='/'; pnpm --filter @workspace/swasthyasaar dev
```
Opens at **http://localhost:5000**

### Run Backend API Server
```bash
pnpm --filter @workspace/api-server dev
```
Runs at **http://localhost:3000**

---

## 🔧 Environment Variables

Copy the example files for each package:

```bash
cp artifacts/swasthyasaar/.env.example artifacts/swasthyasaar/.env
cp artifacts/api-server/.env.example    artifacts/api-server/.env
```

### Frontend (`.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Vite dev server port |
| `BASE_PATH` | `/` | URL prefix |
| `VITE_API_URL` | `http://localhost:3000` | Backend API base URL |
| `VITE_USE_MOCK` | `true` | `true` = local mock data, `false` = live API |

### Backend (`.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Express server port |
| `NODE_ENV` | `development` | Environment |
| `LOG_LEVEL` | `info` | pino log level |
| `ALLOWED_ORIGINS` | `http://localhost:5000` | CORS allowed origins |
| `DATABASE_URL` | *(unset)* | PostgreSQL connection string (when DB is ready) |

---

## 🛠️ Backend Integration Guide (for Backend Teammate)

The frontend is **fully decoupled** from the backend via a service layer in `src/services/`. Switching from demo mode to live API requires no component changes — only environment variables.

### Step 1: Set Mock to Off
In `artifacts/swasthyasaar/.env`:
```
VITE_USE_MOCK=false
VITE_API_URL=http://your-backend-url
```

### Step 2: Implement DB Layer
Replace the static seed arrays in:
- `api-server/src/routes/patients.ts` → query your patients table
- `api-server/src/routes/assessments.ts` → insert/query assessments
- `api-server/src/routes/analytics.ts` → aggregate queries

### Step 3: Add Auth Middleware
All protected routes live in `api-server/src/routes/`. Add JWT middleware at the `api-server/src/routes/index.ts` level:
```typescript
import authMiddleware from "../middleware/auth";
router.use("/api", authMiddleware);
```

### Request/Response Contract
All API responses must follow this wrapper:
```typescript
{
  success: boolean;
  data: T;
  timestamp: string;  // ISO 8601
  message?: string;   // on errors
  code?: string;      // error code
}
```
Types are defined in `src/types/index.ts` — import and share via the `lib/` workspace package.

---

## 🎭 Demo Mode

The app ships with full demo mode for hackathon presentations:

- **DemoModeBanner** — shows on all pages except Landing
- **QuickDemoButton** — floating button that auto-routes through key flows
- Demo scenarios available on Voice Assessment: Maternal, Newborn, NCD
- All data is seeded from `src/data/mockData.ts`

**Critical:** Do not remove `DemoModeBanner` or `QuickDemoButton` components.

---

## 📁 Key Application Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Hero with stats counter |
| `/login` | LoginPage | Role selector (ASHA / Supervisor / Admin) |
| `/asha-dashboard` | AshaDashboard | Patient list + risk overview |
| `/voice-assessment` | VoiceAssessment | Voice AI demo with typewriter animation |
| `/maternal-check` | MaternalCheck | Maternal health risk form |
| `/ncd-tracker` | NcdTracker | NCD (diabetes/hypertension) tracker |
| `/patient/:id` | PatientProfile | Individual patient details |
| `/supervisor-dashboard` | SupervisorDashboard | Block-level overview for supervisors |
| `/analytics` | Analytics | Charts — risk trend, condition dist, referral rates |
| `/referrals` | ReferralManagement | Active referral pipeline |

---

## 🧳 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Routing | Wouter |
| State | TanStack Query |
| UI | shadcn/ui + Radix UI + Tailwind CSS |
| Charts | Recharts |
| Backend | Express 5 + TypeScript |
| Logging | Pino |
| Validation | Zod (`@workspace/api-zod`) |
| Package manager | pnpm workspaces |

---

## 🤝 Contributing

1. Branch from `main`
2. Frontend work → `artifacts/swasthyasaar/`
3. Backend work → `artifacts/api-server/`
4. Shared types → `artifacts/swasthyasaar/src/types/index.ts` (expose via `lib/` for BE parity)
5. Open a PR targeting `main`
