# AIRI Foundation

Website and admin dashboard for AIRI Foundation — a Canadian nonprofit advancing AI literacy through education, community programs, and applied research.

Live at [airifoundation.org](https://airifoundation.org)

## Stacks I used

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Neon PostgreSQL
- next-intl (English / French)
- Tiptap rich text editor
- Cloudflare Turnstile for spam protection
- Deployed on Vercel

## To get started

```bash
npm install
cp .env.example .env.local
# Fill in your database URL, Turnstile keys, and JWT secret
npm run dev
```

The database schema is created automatically on first run via the `/api/init-db` endpoint.

## Environment variables

```
DATABASE_URL=           # Neon PostgreSQL connection string
NEXT_PUBLIC_SITE_URL=   # Your domain (https://airifoundation.org)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=  # Cloudflare Turnstile public key
TURNSTILE_SECRET_KEY=   # Cloudflare Turnstile secret key
JWT_SECRET=             # Secret for admin session tokens
```

## Project layout

```
src/
  app/
    [locale]/           Public pages (EN/FR routing)
    api/                API routes (forms, auth, admin CRUD)
    mydashboard/        Admin dashboard (protected)
  components/
    layout/             Header, footer
    sections/           Page sections (hero, stats, team, partners)
    forms/              All public-facing forms
    editor/             Tiptap editor for insights
    ui/                 Shared UI primitives
  lib/
    db.ts               Database connection and schema
    auth.ts             JWT session management
    data.ts             Data access functions
    email/              Email templates and sending
    validations/        Zod schemas
  i18n/                 Internationalization config
  config/               Site config, navigation structure
messages/
  en.json               English translations
  fr.json               French translations
```

## Admin dashboard

Located at `/mydashboard`. Handles:

- Impact stats (CRUD with sort order and featured cards)
- Insights/articles (rich text editor, publish/draft, slugs)
- Form submissions (all 7 form types, paginated, CSV export)

First-time setup: seed an admin account via `/api/auth/reset-seed` with the init-db auth header.

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # ESLint
npm run start     # Start production server
```

## License

All rights reserved. AIRI Foundation 2026.
