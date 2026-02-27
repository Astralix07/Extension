# SynthVault

A Next.js application for listing and managing downloadable apps. Features a public app listing page and a password-protected admin panel.

## Tech Stack

- **Framework**: Next.js 15.2.4 (downgraded from 15.5.9 — newer versions crash with Bus error due to SWC native binary incompatibility in the Replit Nix environment)
- **Database**: Turso (libSQL) — remote SQLite database
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript

## Project Structure

```
src/
  app/           # Next.js App Router pages
  components/    # React components (header, app-card, app-list, etc.)
  hooks/         # Custom React hooks
  lib/
    actions.ts   # Server actions (CRUD, auth)
    data.ts      # Database queries via Turso
    turso.ts     # Turso client setup
    types.ts     # TypeScript types
```

## Environment Variables / Secrets

- `TURSO_DATABASE_URL` — Turso database URL (libsql://...)
- `TURSO_AUTH_TOKEN` — Turso auth token

## Database Schema

The app expects two tables in the Turso database:

```sql
CREATE TABLE apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL
);

CREATE TABLE admin (
  id INTEGER PRIMARY KEY,
  password TEXT NOT NULL
);

INSERT INTO admin (id, password) VALUES (1, 'your-admin-password');
```

## Development

- Runs on port 5000 at `0.0.0.0`
- `npm run dev` — starts development server
- No Turbopack (crashes in Replit Nix environment)

## Deployment

- Target: autoscale
- Build: `npm run build`
- Run: `npm run start`
