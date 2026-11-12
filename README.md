# HabitArc — Personal Habit & Goal Tracker

A full-stack habit and goal tracking application built with Next.js, Tailwind CSS, and Prisma.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` if needed:

```bash
cp .env.example .env
```

3. Push the Prisma schema to SQLite and start the development server:

```bash
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deploying on Vercel (Zero External Database Setup)

This project is configured to run on Vercel without an external database integration:

- `prisma/schema.prisma` includes `rhel-openssl-3.0.x` in `binaryTargets` for Vercel's Linux runtime.
- `next.config.ts` bundles `prisma/dev.db` and the Prisma query engine via `outputFileTracingIncludes`.
- `src/lib/prisma.ts` automatically copies the bundled SQLite database to `/tmp/dev.db` on Vercel so reads and writes work with no external DB or environment variables required.

> **Note:** On Vercel without an external database, writes persist in `/tmp/dev.db` for the lifetime of the serverless container and reset on cold starts or new deployments.

### Deploy Steps

1. Import this GitHub repository in [Vercel](https://vercel.com/new).
2. Keep the default Next.js build settings (`npm run build` runs `prisma generate && next build`).
3. Click **Deploy** (no environment variables required).
