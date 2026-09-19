# Residence Manager

A digital guest guide for a hospitality property: a welcome homepage with sections for apartments, beaches, restaurants, wineries, trails, excursions, local services, useful numbers, maps, and guest support — all content editable from an admin panel, with no code changes required.

**Stack**: Next.js (App Router, TypeScript) · PostgreSQL · Prisma ORM · Tailwind CSS · Docker · Vitest

## About this project

I built this as a full-stack personal project to design and ship a complete web application end to end: data model, authentication, an admin CMS, file uploads, and a public-facing site — deployed and used in a real setting rather than left as a course exercise.

I used AI-assisted development (Claude Code) as part of my workflow, which let me move faster on boilerplate and scaffolding. Every architectural decision, and the security review that followed, was mine: I identified and fixed a weak authorization check in the route middleware (it only checked for the *presence* of a session cookie, not its validity) and a timing side-channel in the login flow (the password comparison was skipped entirely when the email didn't exist, making "wrong password" and "unknown email" distinguishable by response time). Both fixes are covered by an automated test suite (see [Testing](#testing) below).

## Requirements

- Node.js (LTS)
- Docker Desktop (for PostgreSQL locally)

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values (in particular `ADMIN_EMAIL`/`ADMIN_PASSWORD`, used only to create the first admin account).

3. Start PostgreSQL (Docker):

   ```bash
   npm run db:up
   ```

4. Apply database migrations (creates the tables from `prisma/schema.prisma`):

   ```bash
   npm run prisma:migrate
   ```

5. Seed the database with the 10 sections, base site settings, and the admin account:

   ```bash
   npm run db:seed
   ```

6. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel (credentials from `ADMIN_EMAIL`/`ADMIN_PASSWORD`).

## Testing

The project has an automated test suite (Vitest) covering authentication, session handling, and file upload validation — 15 tests across 4 files:

```bash
npm run test
```

| File | What it covers |
| --- | --- |
| `tests/password.test.ts` | Password hashing/verification (bcrypt) |
| `tests/session.test.ts` | JWT session creation and verification, including tampered/invalid tokens |
| `tests/auth.test.ts` | Login flow: invalid input, unknown email, wrong password, successful login — including a regression test for the timing side-channel fix |
| `tests/upload.test.ts` | File upload validation: rejected MIME types, oversized files, valid uploads |

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the test suite (Vitest) |
| `npm run db:up` | Start PostgreSQL via Docker Compose |
| `npm run db:down` | Stop the PostgreSQL container |
| `npm run prisma:generate` | Regenerate the Prisma Client from the schema |
| `npm run prisma:migrate` | Create/apply a Prisma migration in development |
| `npm run prisma:studio` | Open Prisma Studio (GUI for browsing the database) |
| `npm run db:seed` | Create the 10 sections, site settings, and admin account |

## Project structure

```
prisma/schema.prisma          # Database models
prisma/seed.ts                 # Seed data (sections, site settings, admin)
src/app/                       # Public pages (App Router)
src/app/[categoria]/           # Dynamic page for each section
src/app/assistenza/            # Contact/support form
src/app/admin/login/           # Admin login (public)
src/app/admin/(protected)/     # Admin panel (requires login)
src/app/actions/               # Server Actions (data mutations)
src/lib/                       # Prisma client, session, password, upload helpers
src/components/                # Shared UI components
src/proxy.ts                   # Route protection for /admin
tests/                         # Vitest test suite
public/uploads/                # Photos uploaded from the admin panel (not versioned)
docker-compose.yml             # Local PostgreSQL service
.env                           # Environment variables (not versioned)
```

## Environment variables

See `.env.example`. Copy it to `.env` and set:

- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — key used to sign the admin session (random string)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials used by the seed script to create the first admin account

## Content management

All content (welcome text, contact details, photos, and items in each section) is managed from `/admin` after logging in — no code changes required. Uploaded photos are stored in `public/uploads/` (or Vercel Blob storage in production).
