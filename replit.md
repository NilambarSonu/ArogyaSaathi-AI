# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### ArogyaSaathi AI (`artifacts/swasthyasaar/`)
- **Type**: React + Vite frontend-only app
- **Preview Path**: `/`
- **Description**: AI-powered intelligent care orchestration system for India's ASHA frontline health workers
- **Stack**: React, Wouter, Tailwind CSS, Recharts, Lucide React, Web Speech API
- **Data**: 100% mock/simulated — no real backend
- **Features**:
  - Landing page with animated stat counters
  - Role selection login (ASHA Worker, Block Supervisor, District Admin)
  - ASHA Worker Dashboard with patient list, quick actions
  - Voice AI Assessment with Web Speech API + demo chip scenarios
  - Maternal & Newborn risk form with risk scoring logic
  - NCD (Non-Communicable Disease) tracker with care pathway
  - Patient Profile with risk timeline charts
  - Block Supervisor Dashboard with priority alerts, heatmap
  - Analytics dashboard with Recharts charts
  - Referral Management with pipeline tracking
  - Floating DEMO MODE banner + Quick Demo button
- **Mock Data**: 15 patients, 5 ASHA workers, 6 referrals, 3 Odisha villages (Kalahandi district)
- **Color Palette**: Primary #0A6E4F (forest green), Secondary #F5A623 (amber), Danger #E63946, Success #2DC653
- **Fonts**: Poppins (headings), Noto Sans (body), Space Mono (numbers)
