# Simple Student CRUD Application

A full-stack Student Management application with React, Node.js (Express), SQL Server, and Docker.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed and running
- [Node.js](https://nodejs.org/) v24+

## Quick Start

```bash
# 1. Clone and install dependencies
cd api && npm install && cd ../app && npm install && cd ../e2e && npm install && cd ..

# 2. Start in development mode (hot-reload)
npm run up:dev

# 3. Open the app
#    Frontend → http://localhost:5173
#    API      → http://localhost:3000/api
```

## Environment Files

Each environment has its own `.env` file:

| File | Purpose |
|------|---------|
| `.env.dev` | Development — hot-reload, debug |
| `.env.prod` | Production — compiled, nginx |
| `.env.test` | Test — separate ports & DB |

## Docker Commands

| Command | Description |
|---------|-------------|
| `npm run up:dev` | Start dev environment (foreground, hot-reload) |
| `npm run up:prod` | Start production environment |
| `npm run up:test` | Start test environment |
| `npm run down` | Stop all environments |
| `npm run clean` | Remove all containers, volumes, and images |

## Testing

| Command | Description |
|---------|-------------|
| `npm test` | Run all unit tests (API + App) |
| `npm run test:api` | Run API tests only (Jest) |
| `npm run test:app` | Run App tests only (Vitest) |
| `npm run test:coverage` | Run all tests with coverage reports |
| `npm run test:e2e` | Run E2E tests (Playwright, headless) |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |

### E2E Test Setup (first time)

```bash
cd e2e && npm install && npx playwright install chromium
```

## Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint on API + App |
| `npm run format` | Format all code with Prettier |
| `npm run format:check` | Check formatting without changes |
| `npm run audit` | Security audit (npm audit) |
| `npm run license:check` | Check for disallowed licenses |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Backend** | Node.js + Express 5 + TypeScript |
| **Database** | SQL Server 2022 (Developer Edition) |
| **Containerization** | Docker Compose |
| **Unit Tests** | Jest (API) / Vitest + Testing Library (App) |
| **E2E Tests** | Playwright |
| **Linting** | ESLint (flat config) |
| **Formatting** | Prettier |
| **CI/CD** | GitHub Actions |

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/api/students` | List all students |
| `GET` | `/api/students/:id` | Get a student by ID |
| `POST` | `/api/students` | Create a new student |
| `PUT` | `/api/students/:id` | Update a student |
| `DELETE` | `/api/students/:id` | Delete a student |
| `GET` | `/health` | Health check |

## Student Entity

| Field | Type | Notes |
|-------|------|-------|
| StudentId | INT | Primary Key, Auto Increment |
| Name | NVARCHAR(100) | Required |
| Email | NVARCHAR(100) | Required |
| Phone | NVARCHAR(20) | Optional |
| Department | NVARCHAR(50) | Optional |
| CreatedDate | DATETIME | Auto-generated |

## Project Structure

```
CaseStudy/
├── .env.dev / .env.prod / .env.test   # Environment configs
├── docker-compose.dev.yml             # Development
├── docker-compose.prod.yml            # Production
├── docker-compose.test.yml            # Test
├── .github/workflows/ci.yml          # GitHub Actions CI
├── .prettierrc                        # Shared Prettier config
│
├── api/                               # Backend
│   ├── Dockerfile
│   ├── jest.config.js
│   ├── eslint.config.mjs
│   └── src/
│       ├── index.ts                   # Express server entry
│       ├── config/database.ts         # SQL Server connection + init
│       ├── routes/student.routes.ts   # CRUD endpoints
│       ├── utils/validation.ts        # Input validation
│       ├── types/mssql.d.ts           # Type declarations
│       └── __tests__/                 # Unit tests
│
├── app/                               # Frontend
│   ├── Dockerfile
│   ├── nginx.conf                     # Production SPA config
│   ├── vite.config.ts                 # Vite + Vitest config
│   ├── eslint.config.js
│   └── src/
│       ├── App.tsx                    # Main application
│       ├── types/Student.ts           # Student type
│       ├── services/studentService.ts # API client
│       ├── components/
│       │   ├── StudentForm.tsx        # Create/Edit form
│       │   └── StudentList.tsx        # Student table
│       └── __tests__/                 # Unit tests
│
└── e2e/                               # End-to-End Tests
    ├── package.json
    ├── tsconfig.json
    ├── playwright.config.ts
    ├── students.spec.ts               # E2E test scenarios
    └── helpers/api-client.ts           # Real API client for test setup/teardown
```

## CI/CD Pipeline

GitHub Actions runs on push/PR to `main` and `develop`:

- **Lint & Format** — ESLint + Prettier check (API & App)
- **Unit Tests & Coverage** — Jest + Vitest with artifact upload
- **E2E Tests** — Playwright with report artifact
- **Build** — TypeScript compilation + Vite production build
- **Security Audit** — `npm audit` for vulnerabilities
- **License Check** — Whitelist-only open-source licenses
- **Docker Build** — Verify production images build successfully
