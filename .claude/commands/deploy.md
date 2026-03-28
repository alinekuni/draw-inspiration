Deploy Draw Inspiration to production.

## Pre-flight

Run these in order. Do not proceed past a failure.

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Production build
npm run build
```

If `npm run build` fails, fix the error before deploying. Build failures often surface issues
that `tsc --noEmit` misses (missing env vars, import errors, etc.).

## Environment variable check

Before deploying, confirm `GROQ_API_KEY` is set in the Vercel project:

```bash
npx vercel env ls
```

If it's missing:
```bash
npx vercel env add GROQ_API_KEY production
```

The app will build without the key but API calls will fail at runtime with a 500.

## Deploy

**Via Vercel CLI:**
```bash
npx vercel --prod
```

**Via Git (if Vercel GitHub integration is connected):**
```bash
git push origin main
```
Vercel auto-deploys on push to `main`. Check the deployment status at vercel.com/dashboard.

## Post-deploy smoke test

After deployment, manually verify:

- [ ] `/spark` loads — bottom nav visible, Spark button present
- [ ] Tap "Spark" → prompt card appears with title and body text
- [ ] Copy button copies prompt to clipboard
- [ ] Keep button → switch to Keeps tab (`/prompts`) → prompt appears
- [ ] `/references` → select a board → invitation text appears, chips shown
- [ ] Language toggle (EN/PT) → new spark → prompt returns in Portuguese
- [ ] Dark mode toggle → theme switches without white flash on reload
- [ ] Share link → copy URL → open in new tab → `/s` route renders the prompt
- [ ] No console errors on any tab

## Rollback

If something is wrong after deploy:
```bash
npx vercel rollback
```
Or promote the previous deployment from the Vercel dashboard.

## What is NOT deployed

- `.env.local` — never committed, never deployed (covered by `.gitignore`)
- `.claude/` — dev tooling only
- `CLAUDE.md`, `CLAUDE.local.md` — documentation only
