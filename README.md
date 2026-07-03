# Ares Car Rental

A full-stack car rental platform built with .NET 10, Next.js 16, and SQL Server. Developed as a graduation project at Al-Azhar University, it unifies fleet management, booking workflows, driver assignments, vehicle inspections, and payment processing into a single modern application with multi-role support (Customers, Suppliers, Drivers, Inspectors, and Administrators).

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Bun** | ≥1.0 | [Install](https://bun.sh) |
| **.NET SDK** | ≥10.0 | [Download](https://dotnet.microsoft.com/download) |
| **Node.js** | ≥18.0 (optional) | [Download](https://nodejs.org/) |
| **SQL Server** | 2022 | [Docker](https://hub.docker.com/_/microsoft-mssql-server) or [Native](https://www.microsoft.com/sql-server) |
| **ngrok** | Latest | [Install](https://ngrok.com/download) (optional, for Paymob webhooks) |

> **Note:** The setup script automatically installs `dotnet-ef` and `dotnet-script` tools if not found (for Windows, ngrok is auto-installed via winget).

### Automated Setup (Recommended)

```bash
# Install all subproject dependencies
bun run deps

# Interactive setup (asks for all values, including Paymob)
bun run setup

# or quick setup with defaults
bun run setup:quick
```

The setup script orchestrates these phases in order:

1. **System Checks** — Verifies OS, .NET SDK, Bun, Node.js, SQL Server connectivity, ngrok, and port availability (5000, 3000, 1433). Installs `dotnet-ef` and `dotnet-script` if missing.
2. **Backend Preparation** — Builds the backend solution for environment validation.
3. **Configuration** — Generates `backend/.env` and `frontend/.env.local` interactively using cryptographically secure Web Crypto APIs for JWT and NextAuth secrets. Detects devcontainer environments and adjusts SQL Server host accordingly.
4. **Database Setup** — Verifies connection, runs EF Core migrations, seeds demo data, and verifies seeded tables.
5. **Backend Server** — Starts the backend on port 5000 and verifies accessibility via health endpoint.
6. **Frontend Server** — Installs frontend dependencies, starts on port 3000, and verifies accessibility.

The script handles graceful shutdown on `Ctrl+C` (stops both servers). If Paymob is configured, it prints next-step instructions for ngrok tunneling and mock/dashboard configuration.

**Setup Script Options:**

```bash
bun run setup              # Interactive setup (recommended)
bun run setup:quick        # Quick mode with default values
bun run setup --skip-checks # Skip tool installation checks
bun run setup --skip-db     # Skip database setup
bun run setup --skip-backend # Skip backend setup
bun run setup --skip-frontend # Skip frontend setup
bun run setup --no-seed     # Skip demo data seeding
bun run setup --debug        # Enable debug logging
bun run setup --help        # Show help
```

---

## 📖 Manual Setup

### 1. SQL Server

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name mssql -d mcr.microsoft.com/mssql/server:2022-latest
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # Edit with your DB connection, JWT secrets, CORS, Paymob keys
dotnet restore
cd Api
dotnet ef database update
dotnet run             # or dotnet watch run for hot reload
```

Backend: http://localhost:5000 · Swagger: http://localhost:5000/swagger

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local   # Edit with NEXTAUTH_SECRET, API base URL
bun install
bun run dev
```

Frontend: http://localhost:3000

### 4. Paymob Payment Gateway (Optional)

The project supports **Paymob** for payment processing. To enable payments:

#### A. Sign Up for Paymob Sandbox

1. Register at: https://accept.paymob.com/portal2/en/register
2. Login to dashboard: https://accept.paymob.com/portal2/en/login

#### B. Get Your Credentials

Navigate to the Paymob Dashboard **(Settings → Developers)**:

1. **API Key & HMAC Secret** — Found under **Developers → API Keys**
2. **Integration ID** — Found under **Developers → Payment Integrations**
3. **iFrame ID** — Found under **Developers → Iframes**

#### C. Set Up Redirect and Webhook URLs

1. **Transaction Response Callback (Redirect for the User)**
   - **URL:** `http://localhost:5000/api/payments/callback`
   - `localhost` works because this redirect happens in the user's browser.

2. **Transaction Processed Callback (Webhook — Server-to-Server)**
   - **URL:** `https://YOUR_NGROK_URL/api/payments/webhook`
   - Use [ngrok](https://ngrok.com/) (`npx ngrok http 5000`) for local testing. In production, use your real backend domain.

#### D. Test Payment Flow

- **Success Card**: `4987654321098769` (any CVV, future expiry)
- **Decline Card**: `5123456789012346`
- **Cancellation**: Test refund previews and admin overrides.

---

## 🏗️ Project Structure

```
ares-car-rental/
├── backend/
│   ├── Api/                      # ASP.NET Core API — Controllers, Middleware, Filters, Swagger
│   ├── Application/              # Business logic — Services, DTOs, Validators, Mappings, MediatR handlers
│   ├── Domain/                   # Domain entities & events (no external deps)
│   ├── Infrastructure/          # EF Core data access, Repositories, BackgroundServices, Infrastructure Services
│   ├── Tests/                    # xUnit + FsCheck + Moq test project
│   └── phonetest/                # Phone validation utility
├── frontend/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/             # i18n locale segment (next-intl)
│   │   │   ├── (auth)/           # Sign-in, sign-up, password reset, email verification
│   │   │   ├── (customer)/       # Bookings, checkout, profile settings
│   │   │   ├── (dashboard)/      # Role-specific admin interfaces
│   │   │   │   ├── admin/        # Users, bookings, vehicles, categories, financial reports
│   │   │   │   ├── supplier/     # Vehicles, earnings, bookings, reviews
│   │   │   │   ├── driver/       # Trips, profile, earnings, payouts
│   │   │   │   └── inspector/    # Inspections, history
│   │   │   └── (public)/         # Landing page, vehicle search, vehicle details, terms/privacy
│   │   └── api/auth/             # NextAuth.js route handler
│   ├── components/               # Shared MUI components
│   ├── context/                  # React context providers (VehicleBooking, etc.)
│   ├── hooks/                    # Custom hooks (useVerification, useLanguageSwitch, etc.)
│   ├── lib/                      # Utilities, validation schemas, API clients
│   ├── providers/                # Theme, Auth, Emotion cache providers
│   ├── shared/i18n/              # Internationalization config & messages
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   └── tests/e2e/                # Playwright E2E tests
├── scripts/
│   ├── setup/                    # Bun-powered CLI setup script
│   │   ├── checks/               # OS, .NET, Bun, SQL Server, ngrok, ports
│   │   ├── config/               # Backend/frontend .env generation
│   │   ├── database/             # Connection, migrations, seeding
│   │   ├── backend/              # Backend build & server management
│   │   ├── frontend/             # Frontend deps & server management
│   │   └── lib/                  # Logger, utils
│   └── docs/                     # AI documentation generation pipeline
└── .devcontainer/                # Docker dev environment (SQL Server + VS Code)
```

---

## ✨ Features

### User & Role Management
- **Multi-role authentication** — Local JWT + Google OAuth login for Customers, Admins, Suppliers, Drivers, and Inspectors
- **Email verification & account lockout** — ASP.NET Identity lockout, email confirmation tokens, refresh token rotation with TTL-based expiry
- **User profile management** — Profile completeness scoring, KYC levels (Basic, Standard, Enhanced), phone number validation via `libphonenumber-js`
- **Admin user management** — Verification approval/rejection, role-specific dashboards, soft deletion

### Vehicle Fleet Management
- **Full vehicle CRUD** — Admin and Supplier vehicle management with features, images, categories, and dynamic availability
- **Approval workflow** — Supplier vehicles start as `Pending`; admin approval required before listing
- **Vehicle inspections** — Pre-delivery and return inspections with photo documentation, odometer readings, and fuel-level reporting
- **Auto-assignment** — Background service auto-assigns inspectors 24 hours before pickup based on workload and regional proximity

### Booking System
- **End-to-end booking lifecycle** — Date selection → pricing → driver assignment → payment → confirmation
- **Approval workflow** — Bookings enter `PendingApproval` after payment; admin approves/rejects; background service auto-expires stale approvals
- **Concurrency control** — Pessimistic locking (`SERIALIZABLE + UPDLOCK + HOLDLOCK`) prevents double-booking; `rowversion` optimistic concurrency on driver profiles prevents double-assignment
- **Cancellation & refunds** — `RefundCalculator` computes refund percentage (free/partial/none) based on booking status and pickup date proximity
- **Checkout flow** — Identity verification gate, driver selection, discount application, order summary

### Payment Processing
- **Paymob integration** — Full payment lifecycle (authenticate → create order → payment key → iframe → callback)
- **Webhook security** — HMAC SHA-512 signature validation on all Paymob callbacks
- **Refund mechanism** — Transaction refunds via Paymob with commission/supplier amount split tracking

### Driver Module
- **Driver profiles** — Staged profile completion (license, national ID, work areas); admin verification (`Incomplete → PendingVerification → Verified`)
- **Driver earnings** — Append-only earning ledger; payout requests with balance/threshold validation; admin approval via Paymob disbursement
- **Driver dashboard** — Availability toggle, active assignment tracking, earnings charts (Recharts), trip history

### Supplier Module
- **Supplier management** — Ownership-enforced vehicle CRUD, active booking validation, soft-delete
- **Supplier restrictions** — Admin can restrict/block suppliers (disables vehicles, cancels future bookings with 100% refund, notifies customers)
- **Supplier dashboard** — Lifetime totals, monthly revenue charts, top vehicles, bookings, reviews

### Additional Features
- **Dynamic pricing engine** — Daily rates, category offers, insurance tiers, additional services
- **Discount/promotion system** — Validation (active status, usage limits, segment/category applicability), atomic application
- **Reviews & ratings** — Dual-review system (vehicle reviews + driver reviews), enforced for completed bookings only
- **Notifications** — Platform-wide fan-out alerts and user-specific notifications with best-effort delivery
- **Internationalization** — `next-intl` with RTL support (`stylis-plugin-rtl`) for Arabic; frontend `[locale]` route segment; backend language/currency preferences
- **Financial reporting** — Monthly revenue charts, payment method breakdowns, top vehicles/supplier earnings tables, report export
- **Audit trails** — `AuditableEntityInterceptor` centralizes `CreatedAt`/`UpdatedAt` UTC timestamps

### Clean Architecture (Backend)
- **4-layer separation** — Domain (innermost, no deps) → Application → Infrastructure → Api
- **CQRS** — MediatR 14 for specialized read queries (e.g., inspector dashboard stats)
- **Global exception handling** — Centralized middleware maps domain exceptions to HTTP status codes (NotFound→404, Conflict→409, Validation→400)
- **Rate limiting** — Custom in-memory middleware (5 logins/15min, 5 registrations/hour, 10 discount validations/minute)
- **FluentValidation** — Declarative DTO validation with structured error responses
- **AutoMapper** — Convention-based entity↔DTO mapping to prevent domain leakage
- **Serilog** — Structured logging with `UseSerilogRequestLogging()` for HTTP request enrichment

---

## 🛠️ Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| .NET | 10.0 | Runtime & web framework |
| ASP.NET Core | 10 | REST API |
| EF Core | 10.0.5 | ORM (SQL Server + InMemory for tests) |
| SQL Server | 2022 | Primary database |
| MediatR | 14.1.0 | CQRS / mediator pattern |
| AutoMapper | 16.1.1 | Entity↔DTO mapping |
| FluentValidation | 11.3.1 | Request validation |
| Serilog | 8.0.3 | Structured logging |
| Swashbuckle | 7.2.0 | Swagger/OpenAPI docs |
| ASP.NET Core Identity | — | User management & lockout |
| JWT + Google OAuth | — | Authentication (Google.Apis.Auth 1.69.0) |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.6 | React framework (App Router, SSR/SSG) |
| React | 19.2.6 | UI library (Server Components) |
| TypeScript | — | Type-safe development |
| Material UI (MUI) | 9.0.1 | Component library (light/dark themes, no hardcoded colors) |
| Tailwind CSS | 4.2.4 | Utility-first styling |
| Emotion | — | CSS-in-JS with RTL support (`stylis-plugin-rtl`) |
| NextAuth.js | 4.24.14 | Authentication sessions |
| React Hook Form | 7.75.0 | Form management |
| Zod | 4.4.3 | Schema validation |
| Axios | 1.13.5 | HTTP data fetching |
| react-leaflet | 5.0.0 | Mapping integration |
| Recharts | 3.8.1 | Data visualization (charts) |

### Testing

| Technology | Version | Purpose |
|---|---|---|
| xUnit | 2.9.3 | Backend unit & integration testing |
| Moq | 4.20.72 | Mocking library |
| FsCheck | 3.3.2 | Property-based testing (randomized input validation) |
| Playwright | 1.54.2 | Frontend E2E testing |
| Coverlet | — | Backend code coverage collection |

### Infrastructure & Tooling

| Tool | Purpose |
|---|---|
| **Bun** | Package manager & runtime (mandated) |
| **Docker** | SQL Server containerization & dev environment |
| **ESLint** | Code linting (v10.3.0) |
| **Prettier** | Code formatting (v3.8.3) |
| **tsgo** | TypeScript strict type checking |
| **Husky** | Pre-commit hooks |
| **ngrok** | Paymob webhook tunneling (local dev) |

---

## 📦 Root Package Scripts

```bash
# Dependencies
bun run deps                    # Install all subproject dependencies

# Setup
bun run setup                    # Interactive setup
bun run setup:quick              # Quick setup with defaults
bun run setup --skip-db          # Skip database, only set up code
bun run setup --no-seed          # Set up without demo data

# Development
bun run dev                      # Start frontend dev server
bun run build                    # Build frontend
bun run start                    # Start frontend production server
bun run lint                     # Lint frontend
bun run lint:all                 # Lint all projects (frontend + setup + docs)
bun run format                   # Format frontend
bun run typecheck                # Type check frontend

# Testing
cd scripts/setup && bun test     # Setup script tests
dotnet test backend/Ares.slnx    # Backend tests

# Documentation
bun run generate-docs:all        # Generate all AI documentation chapters
bun run generate-docs:ch3       # Generate Chapter 3 docs (requires setup/docs env)
bun run validate-mermaid         # Validate Mermaid diagrams in docs
```

---

## 🔧 Development

### Backend

```bash
cd backend/Api
dotnet watch run                    # Hot reload
dotnet ef migrations add Name       # New migration
dotnet ef database update           # Apply migrations
dotnet ef database drop             # Reset database
```

### Frontend

```bash
cd frontend
bun run dev                         # Dev server
bun run build                        # Production build
bun run typecheck                    # Type check (tsgo)
bun run lint                         # Lint (ESLint)
bun run format                       # Format (Prettier)
```

---

## 🧪 Testing

### Backend Tests (xUnit + FsCheck + Moq)

```bash
# Run all backend tests
dotnet test backend/Ares.slnx --no-build --configuration Release --verbosity normal

# Run specific test class
dotnet test backend/Ares.slnx --filter "FullyQualifiedName~BookingServiceTests"
```

Testing approach follows a classic pyramid:
- **Unit & Property Tests** (xUnit + FsCheck) — Business logic, services, controllers with randomized inputs
- **Integration Tests** — EF Core In-Memory database (unique DB per test class)
- **E2E Tests** — Playwright for critical user journeys (`frontend/tests/e2e/`)

### Frontend E2E Tests (Playwright)

```bash
cd frontend
bun run test:e2e                    # Headless E2E tests
bun run test:e2e:headed             # Headed E2E tests
bun run test:e2e:ui                 # UI mode
```

### CI/CD Pipeline (GitHub Actions)

The CI pipeline (`.github/workflows/ci.yml`) runs on PRs to `main`/`develop` with two parallel jobs:

**Frontend:** Bun → Format check (Prettier) → Type check (tsgo) → Build (Next.js)

**Backend:** .NET SDK 10 → Restore → Build (Release) → Test (TRX format) → Upload test results as artifacts → Smoke gate (`CategoriesControllerTests` + `VehicleCategoryTests`)

---

## 📖 API Documentation

**Swagger UI:** http://localhost:5000/swagger

The API is organized into 6 domains:

| Domain | Base Path | Description |
|---|---|---|
| Public | `/api/public/*` | Health, promotions, offers |
| Auth | `/api/auth/*` | Register, login, Google sign-in, refresh token |
| Customer | `/api/vehicles/*`, `/api/checkout`, `/api/bookings/*` | Vehicle search, booking management |
| Supplier | `/api/supplier/*` | Vehicle CRUD, bookings, earnings, reviews |
| Driver | `/api/driver/*` | Profile, license, earnings, payouts |
| Admin | `/api/admin/*` | Users, bookings, drivers, inspections, commission, categories |
| Inspector | `/api/inspector/*` | Dashboard, inspections |
| Cross-cutting | `/api/notifications/*`, `/api/payments/*` | Notifications, Paymob payments |

**Architecture highlights:**
- JWT authentication with role-based authorization (`[Authorize(Roles = "...")]`)
- Rate limiting middleware (5 logins/15min, 5 registrations/hour, 10 discount validations/minute)
- Global exception middleware with standardized `ErrorResponse` contracts
- FluentValidation `AbstractValidator<T>` with structured `ValidationErrors` responses

### Health Endpoints

| Service | URL |
|---------|-----|
| Backend | `GET http://localhost:5000/api/health` |
| Frontend | `GET http://localhost:3000/api/health` |

---

## 🐳 Dev Container

The project includes a `.devcontainer/` setup with Docker Compose for VS Code:

```bash
docker compose -f .devcontainer/docker-compose.yml up -d
```

Starts SQL Server 2022 on port 1433 and a dev container on ports 5000/5001. The setup script detects devcontainer environments and automatically adjusts the SQL Server host from `localhost` to `mssql`.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 📞 Support

- **Setup Script Docs:** [scripts/setup/README.md](scripts/setup/README.md)
- **Issues:** GitHub Issues

---

**Made with ❤️ by the Ares Team**
