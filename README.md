# ReportWise

A multi-tenant SaaS PWA for Nigerian secondary schools — score management, automated report sheet generation, and role-based access for Admins, Teachers and Students.

Built with **Next.js · NestJS · Prisma 7 · PostgreSQL (schema-per-tenant) · Paystack**

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Apps](#running-the-apps)
- [Database](#database)
- [Branch Strategy](#branch-strategy)

---

## Project Overview

ReportWise allows multiple schools to independently manage:

- Student biodata and class enrolment
- Score entry and calculation (CA + exam weighting)
- Automated report sheet generation per term
- PDF export of personalised student report sheets
- Teacher-triggered student promotion at end of term
- Graduated student archiving

Each school is an isolated tenant with its own PostgreSQL schema. No school can access another school's data.

**User roles:**
- **Super Admin** — platform owner; manages all schools, billing overrides
- **Admin** — school-level; manages students, teachers, classes and subjects
- **Teacher** — class-scoped; enters scores, manages biodata, triggers promotion
- **Student** — views and exports their own report sheets

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend / PWA | Next.js 16+ (App Router) |
| Backend | NestJS 11+ |
| ORM / Migrations | Prisma 7 |
| Database | PostgreSQL (via Supabase) |
| Multi-tenancy | PostgreSQL schema-per-tenant |
| Payments | Paystack |
| Monorepo | Turborepo + pnpm workspaces |
| CI/CD | GitHub Actions |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## Monorepo Structure

```
ReportWise/
├── apps/
│   ├── web/                  # Next.js PWA (frontend)
│   └── api/                  # NestJS REST API (backend)
├── packages/
│   ├── database/             # Prisma schema, migrations, client
│   └── shared/               # Shared TypeScript types and DTOs
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI pipeline
├── .env.example              # Environment variable template
├── turbo.json                # Turborepo task config
└── pnpm-workspace.yaml       # pnpm workspace config
```

---

## Prerequisites

Make sure you have the following installed before setting up the project:

| Tool | Version | Check |
|---|---|---|
| Node.js | 20+ (LTS) | `node -v` |
| pnpm | 10.32.1 | `pnpm -v` |
| NestJS CLI | Latest | `nest --version` |
| Git | Any recent | `git --version` |

**Install pnpm** if you don't have it:
```bash
npm install -g pnpm@10.32.1
```

**Install NestJS CLI** if you don't have it:
```bash
pnpm add -g @nestjs/cli
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KingSlayer-double07/ReportWise.git
cd ReportWise
```

### 2. Install all dependencies

Run this from the **root** of the repo — pnpm workspaces will install dependencies for all apps and packages in one command:

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

See the [Environment Variables](#environment-variables) section below for what each variable means and where to get the values.

### 4. Set up the database package env

The Prisma package has its own `.env` file:

```bash
cp packages/database/.env.example packages/database/.env
```

Add your Supabase `DATABASE_URL` to `packages/database/.env`.

### 5. Generate the Prisma client

```bash
pnpm db:generate
```

### 6. Run the first migration

```bash
pnpm db:migrate
```

When prompted, give the migration a name like `init`.

### 7. Start both apps

```bash
pnpm dev
```

This starts both `apps/web` (Next.js on port 3000) and `apps/api` (NestJS on port 3001) simultaneously via Turborepo.

### 8. Verify everything is running

- Frontend: [http://localhost:3000](http://localhost:3000)
- API health check: [http://localhost:3001/api/health](http://localhost:3001/api/health)

The health check should return:
```json
{ "status": "ok", "app": "ReportWise API", "timestamp": "..." }
```

---

## Environment Variables

### Root `.env`

```bash
# App URLs
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

### `packages/database/.env`

```bash
# Supabase PostgreSQL connection string
# Get this from: Supabase → your project → Settings → Database → URI
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"

# Welcome email delivery for manual school provisioning
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL="ReportWise <welcome@reportwise.ng>"
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

### `apps/api/.env`

```bash
PORT=3001
NEXT_PUBLIC_WEB_URL=http://localhost:3000

# JWT — add a long random string for JWT_SECRET
# Generate one with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=24h

# Database (same URL as packages/database/.env)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"
```

### `apps/web/.env`

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

> **Never commit `.env` files.** They are listed in `.gitignore`. Only `.env.example` files are committed to the repo.

---

## Database

The project uses **Prisma 7** with a PostgreSQL schema-per-tenant architecture. Each school that registers on the platform gets its own isolated PostgreSQL schema provisioned automatically.

Common database commands — run these from the **root**:

```bash
# Generate the Prisma client after schema changes
pnpm db:generate

# Create and apply a new migration
pnpm db:migrate

# Open Prisma Studio (visual DB browser)
cd packages/database && pnpm db:studio
```

The Prisma schema lives at `packages/database/prisma/schema.prisma`.
The Prisma config (including the database URL) lives at `packages/database/prisma.config.ts`.

---

## Running the Apps Individually

If you need to run only one app at a time:

```bash
# Frontend only
cd apps/web
pnpm start

# Backend only
cd apps/api
pnpm start:dev
```

---

## Branch Strategy

We follow a simple branch model:

| Branch | Purpose |
|---|---|
| `main` | Production-ready code only. Never commit directly. |
| `develop` | Integration branch. All feature branches merge here first. |
| `feat/feature-name` | New feature development |
| `fix/bug-description` | Bug fixes |
| `chore/task-name` | Setup, config, dependency updates |

**Workflow:**
1. Branch off `develop` for your feature
2. Open a pull request back into `develop` when done
3. `develop` is merged into `main` only when a release milestone is reached

---

## CI/CD

GitHub Actions runs on every push and pull request to `main` and `develop`. The pipeline:

1. Installs dependencies
2. Builds all apps
3. Runs the linter

A failing pipeline blocks merging. Fix the errors locally before pushing again.
