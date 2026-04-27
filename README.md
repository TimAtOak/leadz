# Leadz — Cold Acquisition Platform

MVP SaaS for finding prospects with outdated websites, creating personalized pitch pages, and tracking engagement.

## Architecture

```
leadz/
├── backend/      Symfony 7 + PHP 8.3 + PostgreSQL REST API
├── frontend/     React + Vite + TanStack Query + Tailwind
└── extension/    Chrome Extension (Manifest V3 + React)
```

## Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+
- Docker (for PostgreSQL) OR a local PostgreSQL instance
- OpenSSL (for JWT key generation)

---

## 1. Start PostgreSQL

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432 with database `leadz`, user `leadz`, password `leadz`.

---

## 2. Backend Setup

```bash
cd backend
composer install
```

### Generate JWT keys

```bash
mkdir -p config/jwt
openssl genpkey -algorithm RSA -out config/jwt/private.pem -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -pubout -out config/jwt/public.pem
```

The passphrase in `.env` is `leadz_jwt_passphrase` — match it if you use one, or remove `-pass` if generating without:

```bash
# Passphrase-less (update JWT_PASSPHRASE= to empty in .env):
openssl genpkey -algorithm RSA -out config/jwt/private.pem -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -out config/jwt/private.pem  # strips passphrase
openssl pkey -in config/jwt/private.pem -pubout -out config/jwt/public.pem
```

### Run migrations

```bash
php bin/console doctrine:migrations:migrate --no-interaction
```

### Seed default templates

```bash
php bin/console app:seed-templates
```

### Start the dev server

```bash
symfony server:start
# or
php -S localhost:8000 -t public/
```

API is available at `http://localhost:8000/api`.

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.  
The Vite proxy forwards `/api/*` to `http://localhost:8000`.

---

## 4. Chrome Extension Setup

```bash
cd extension
npm install
npm run build
```

This outputs to `extension/dist/`.

**Load in Chrome:**
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/dist/` folder

> The extension connects to `http://localhost:8000` by default.  
> For production, update `API_BASE` in `src/api/client.ts`.

---

## 5. Usage Workflow

1. Register at `http://localhost:5173/register`
2. Visit any website you want to prospect
3. Click the Leadz Chrome extension icon
4. Sign in with your credentials
5. Click **Save as Lead**
6. Open the lead in the dashboard
7. Fill in company details, pick a template, customize the pitch
8. Click **Publish page** to get a shareable link (`/p/{slug}`)
9. Send the link to the prospect — views are tracked automatically

---

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |

### Leads
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/leads` | List leads (`?page=1&status=new`) |
| POST | `/api/leads` | Create lead from scan |
| GET | `/api/leads/{id}` | Lead details + scan + pitch page |
| PATCH | `/api/leads/{id}` | Update status, notes, contact info |
| DELETE | `/api/leads/{id}` | Delete lead |

### Templates
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/templates` | List templates (global + own) |
| POST | `/api/templates` | Create template |
| PUT | `/api/templates/{id}` | Update template |
| DELETE | `/api/templates/{id}` | Delete template |

### Pitch Pages
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/leads/{id}/pitch-page` | Create or update pitch page |
| GET | `/api/leads/{id}/pitch-page` | Get pitch page |
| GET | `/api/public/pitch/{slug}` | Public pitch page data |
| POST | `/api/public/pitch/{slug}/view` | Track page view |

---

## Lead Statuses

`new` → `reviewed` → `page_created` → `contacted` → `opened` → `responded` → `won` / `lost`

Status transitions to `opened` are triggered automatically when a prospect views the pitch page.

---

## Template Variables

Use these placeholders in template body/subject:

- `{{company_name}}` — company or domain name
- `{{domain}}` — website domain
- `{{url}}` — full URL
- `{{sender_name}}` — replace with your name before sending

---

## Environment Variables

Copy `.env` and adjust for production:

```env
APP_ENV=prod
APP_SECRET=<random 32-char string>
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=<your passphrase>
CORS_ALLOW_ORIGIN=^https://yourdomain\.com$
```
