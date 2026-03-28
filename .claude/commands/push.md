Run pre-flight checks and push to origin main.

## Steps

Run these in order. Stop and report the error if any step fails — do not proceed.

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Production build (catches import errors and missing env var issues)
npm run build

# 4. Confirm nothing sensitive is staged
git diff --cached --name-only

# 5. Push
git push origin main
```

## After pushing

- If Vercel GitHub integration is active, a deployment starts automatically — check vercel.com/dashboard
- If deploying manually, run `npx vercel --prod` after the push

## What to report back

- Whether all checks passed
- The commit SHA that was pushed (`git rev-parse --short HEAD`)
- The Vercel deployment URL if available
