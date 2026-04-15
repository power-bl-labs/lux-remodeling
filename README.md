# Lux Remodeling

Marketing website and internal lead management app for a home remodeling business.

## Stack
- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Prisma 6
- MySQL
- next-auth v4

## Local development
1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Environment
Copy values from `.env.example` into your real environment setup as needed.

Important variables:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `SECURITY_ENCRYPTION_KEY`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_ADMIN_NAME`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `GOOGLE_LEADS_WEBHOOK_URL`
- `GOOGLE_LEADS_WEBHOOK_SECRET`

## Database workflow
Generate Prisma client:

```bash
npm run prisma:generate
```

Push schema to MySQL:

```bash
npm run db:push
```

Seed first admin user:

```bash
npm run db:seed
```

## Main routes
- `/` public marketing landing page
- `/sign-in` manager login
- `/admin` protected lead management area

## Important files
- `src/app/page.tsx`
- `src/app/sign-in/page.tsx`
- `src/app/admin/page.tsx`
- `src/lib/auth.ts`
- `src/lib/dashboard.ts`
- `prisma/schema.prisma`
- `proxy.ts`

## Deployment target
Primary deployment target is Hostinger Business with Node.js app hosting and MySQL.

Recommended production setup:
- one Next.js app
- one MySQL database
- env vars managed in Hostinger panel
- simple email and password admin login

## Current status
- Public shell is in place
- Protected admin shell is in place
- Prisma schema for users and leads is in place
- Build and lint pass locally
