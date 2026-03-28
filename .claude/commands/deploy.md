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

Before deploying, confirm `GEMINI_API_KEY` is set in the Vercel project:

```bash
npx vercel env ls
```

If it's missing:
```bash
npx vercel env add GEMINI_API_KEY production
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

- [ ] `/generate` loads — tab bar visible, Generate button present
- [ ] Tap "Generate idea" — calls `/api/generate`, returns a prompt card
- [ ] Copy button copies prompt text to clipboard
- [ ] Save button → switch to Saved tab → prompt appears
- [ ] Style tab — select a board → switch to Generate — style chips pre-filled
- [ ] Build tab — select chips → Build prompt — result appears
- [ ] Focus mode — expand icon → full-screen overlay → Esc to dismiss
- [ ] No console errors on any tab

## Rollback

If something is wrong after deploy:
```bash
npx vercel rollback
```
Or promote the previous deployment from the Vercel dashboard.

## What is NOT deployed

- `.env.local` — never committed, never deployed (in .gitignore)
- `.claude/` — dev tooling only
- `rules/`, `CLAUDE.md` — documentation only
