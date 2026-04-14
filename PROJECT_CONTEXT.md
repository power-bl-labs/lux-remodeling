# Project Context

## What we are building
Lux Remodeling is a fullstack website for a remodeling company:
- public-facing pages to attract and convert homeowners
- internal admin area to manage incoming leads
- future lightweight CRM workflow for sales follow-up

## Architecture direction
- Single Next.js app
- App Router
- Server-rendered admin pages where useful
- Prisma + MySQL for application data
- next-auth credentials auth for internal users

## Why this direction
- Faster to ship than splitting frontend/admin/backend
- Good fit for Hostinger Business deployment model
- Keeps maintenance overhead low while the product is still early

## Current route map
- `/` landing page
- `/sign-in` auth entry
- `/admin` protected dashboard shell
- `/api/auth/[...nextauth]` auth handler

## Current data model
- `User`
- `Lead`
- `LeadNote`
- `LeadActivity`
- NextAuth support tables: `Account`, `Session`, `VerificationToken`

## Known constraints
- Hostinger target means MySQL-first choices
- Local placeholder DB credentials should not break pages
- Avoid build-time reliance on remote assets when possible
- Next.js 16 conventions can differ from older patterns

## Efficiency notes
- Read `AGENTS.md` first before making structural changes
- Prefer editing existing foundation instead of re-scaffolding
- Avoid unnecessary installs unless they unlock a clear next step
- Use `lint` for small checks and `build` for route/auth/framework validation

## Suggested next milestones
1. Create service page architecture for kitchen, bathroom, additions, and whole-home remodels.
2. Add lead capture forms and persistence.
3. Build admin lead table with filters and per-lead notes.
4. Add manager assignment and status transitions.
5. Prepare production env checklist for Hostinger.
