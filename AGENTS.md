<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. Read relevant guidance in `node_modules/next/dist/docs/` if framework behavior looks surprising, and prefer current App Router conventions.
<!-- END:nextjs-agent-rules -->

# Project Playbook

## Product scope
- One Next.js codebase for a home remodeling company.
- Public marketing site for lead generation.
- Protected `/admin` area for lead and sales management.
- Target deployment: Hostinger Business with Node.js support and MySQL.

## Current stack
- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Prisma 6 with MySQL schema
- next-auth v4 with Prisma adapter and credentials login

## Current important files
- Public entry: `src/app/page.tsx`
- Auth entry: `src/app/sign-in/page.tsx`
- Admin entry: `src/app/admin/page.tsx`
- Auth config: `src/lib/auth.ts`
- Prisma schema: `prisma/schema.prisma`
- Route protection: `proxy.ts`

## Working rules for this repo
- Keep one-app architecture unless the user explicitly asks to split services.
- Prefer MySQL-compatible patterns because Hostinger Business does not give PostgreSQL.
- Avoid external runtime dependencies unless they clearly help the project.
- Avoid remote font dependencies for core UI because local/offline build stability matters.
- Keep admin pages resilient when the database is not configured yet.
- Prefer small focused edits over large refactors.

## Default verification flow
- For most UI or app-logic changes run `npm run lint`.
- Run `npm run build` when routing, auth, Prisma wiring, or shared layout logic changes.
- Only touch DB commands when the task actually needs schema sync or seeding.

## Common commands
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run prisma:generate`
- `npm run db:push`
- `npm run db:seed`

## Environment assumptions
- Local placeholder env lives in `.env`.
- Shareable template lives in `.env.example`.
- Real sign-in will not work until `DATABASE_URL`, `NEXTAUTH_SECRET`, and seeded user are valid.

## Near-term build priorities
1. Build conversion-focused public pages and lead forms.
2. Build admin lead table, detail view, notes, and status flow.
3. Connect real MySQL and seed the first admin.
4. Prepare Hostinger deployment settings and production env vars.
