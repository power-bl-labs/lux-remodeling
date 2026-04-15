# Hostinger Deploy Checklist

## Deployment target
- Hostinger Business
- Node.js / Next.js hosting
- MySQL database

## Before deployment
- Confirm the app stays as one Next.js project.
- Confirm Hostinger Node.js app version matches project requirements.
- Confirm production MySQL database is created.
- Confirm production domain or subdomain is decided.

## Required environment variables
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `SECURITY_ENCRYPTION_KEY`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_ADMIN_NAME`

## Recommended production values
- `NEXTAUTH_URL` should be the final HTTPS app URL.
- `NEXTAUTH_SECRET` should be a long random string.
- `SECURITY_ENCRYPTION_KEY` should be a separate long random string used for the emergency admin cookie.
- Use a dedicated production DB user, not a shared root-style account.
- Use a strong unique admin password for initial seed.

## Database preparation
1. Create MySQL database in Hostinger.
2. Create database user with correct privileges.
3. Build the production `DATABASE_URL`.
4. Run:

```bash
npm run prisma:generate
npm run db:push
npm run db:seed
```

## App deployment steps
1. Push project code to the chosen Git repository.
2. Connect repository inside Hostinger if using Git deploy, or upload project by the preferred Hostinger flow.
3. Configure all production environment variables.
4. Install dependencies:

```bash
npm install
```

5. Build the app:

```bash
npm run build
```

6. Start the app:

```bash
npm run start
```

## Post-deploy verification
- Public homepage loads.
- `/sign-in` loads over HTTPS.
- `/admin` redirects to sign-in when logged out.
- Seeded admin can sign in.
- Session persists after login.
- Forgot password flow is intentionally disabled in this build.
- Lead creation works against production MySQL.
- No placeholder env values remain.

## Production hardening
- Replace placeholder admin immediately after first login if needed.
- Rotate `NEXTAUTH_SECRET` only with care.
- Remove any development-only credentials from local docs before sharing repo.
- Keep `.env` out of version control.

## Common failure points
- Wrong MySQL host, user, password, or database name in `DATABASE_URL`.
- `NEXTAUTH_URL` set to `http` instead of `https`.
- App builds locally but production env vars were not added in Hostinger.
- Seed script was never run, so no admin user exists.
- Port/start command mismatch in Hostinger runtime settings.

## Quick launch checklist
- Build passes
- Lint passes
- Production env vars added
- MySQL reachable
- Prisma pushed
- Admin seeded
- HTTPS URL set
- Login tested
