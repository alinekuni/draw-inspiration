# Deploy Skill

Deployment checklist and runbook for Draw Inspiration. This project deploys to Vercel (`.vercel` is in `.gitignore`).

## Stack context

- **Framework:** Next.js 14 — Vercel detects this automatically, no config needed
- **Build command:** `next build` (via `npm run build`)
- **Output:** `.next/` — standard Next.js output, not static export
- **AI backend:** Groq (`groq-sdk`, model `llama-3.3-70b-versatile`) — API route only
- **No database** — nothing to migrate
- **No CDN config** — assets served by Vercel edge network automatically

## Required environment variables

| Variable | Where set | Required for |
|----------|-----------|-------------|
| `GROQ_API_KEY` | Vercel dashboard → Settings → Environment Variables | All prompt generation |

No other env vars are needed. The app builds without the key but every generate call returns a 500 at runtime.

## First-time Vercel setup

```bash
npm install -g vercel      # install CLI once
vercel login               # authenticate
vercel link                # link this directory to a Vercel project
vercel env add GROQ_API_KEY production
vercel env add GROQ_API_KEY preview
```

## Deployment checklist

### Before every deploy

- [ ] `npx tsc --noEmit` passes (zero errors)
- [ ] `npm run lint` passes (zero errors)
- [ ] `npm run build` completes successfully
- [ ] `git status` is clean — no uncommitted changes that shouldn't go to prod
- [ ] No `.env.local` accidentally staged (`git diff --cached | grep GROQ`)

### Deploy

- [ ] `npx vercel --prod` or `git push origin main` (if GitHub integration is active)
- [ ] Deployment URL confirmed in Vercel dashboard

### After deploy

- [ ] Visit production URL — app loads without white screen
- [ ] `/spark` → tap "Spark" button → prompt card appears (confirms `GROQ_API_KEY` is set)
- [ ] Copy button copies prompt text to clipboard
- [ ] Keep button → switch to Keeps tab → prompt appears (confirms localStorage)
- [ ] `/references` → select a board → board shows as selected with invitation text
- [ ] Language toggle → switch to PT → new spark generates in Portuguese
- [ ] Dark mode toggle → UI switches theme without flash
- [ ] `/s?d=` (share URL) — copy a share link, open in new tab, prompt renders
- [ ] Check Vercel Function logs for any 500s

## Vercel function limits (free tier)

The `/api/generate` route runs as a Vercel Serverless Function:
- Execution timeout: 10s (default) — Groq calls typically complete in 1–3s ✓
- Memory: 1024 MB — well within range ✓
- No rate limiting is implemented — consider adding if the app goes public

## Rollback

```bash
vercel rollback            # rolls back to the previous production deployment
```

Or from the Vercel dashboard: Deployments → previous deployment → Promote to Production.
