# Security Review Skill

Perform a security audit of the Draw Inspiration codebase. Focus on the actual attack surface — this is a client-side app with one API route and no auth.

## Scope

### High priority (actual exposure)

**1. API key exposure**
- Confirm `GEMINI_API_KEY` is only accessed in `src/app/api/generate/route.ts`
- Grep for any import of `@google/generative-ai` outside `src/app/api/`:
  ```
  grep -r "generative-ai" src/app --include="*.ts" --include="*.tsx"
  ```
- Confirm no `NEXT_PUBLIC_` prefix on the key (would expose it to the client bundle)

**2. API route input handling**
- Review `src/app/api/generate/route.ts`
- The `body` is cast with `as` — no runtime validation. Check if malformed input can cause:
  - Unhandled JSON.parse errors (current: caught by outer try/catch ✓)
  - Prompt injection via `body.mood` or `body.locked` values passed directly to Gemini
  - Excessively large request bodies (no size limit currently)

**3. Prompt injection**
- User-supplied strings from `mood`, `style`, and `locked` are concatenated into the Gemini prompt
- Check if a crafted value like `locked: { subject: "ignore previous instructions and..." }` could hijack the model output
- Mitigation: the JSON-only output format and `cleaned` parsing limit the blast radius, but validate that non-JSON responses are rejected rather than returned

**4. localStorage security**
- Review `src/lib/storage.ts`
- `JSON.parse` is wrapped in try/catch ✓
- Confirm no sensitive data is stored (only `GeneratedPrompt` objects — public content ✓)
- No user credentials or tokens are stored

### Medium priority

**5. Content Security Policy**
- Check `next.config.mjs` for CSP headers
- Currently: no CSP headers set — the SVG grain overlay and Google Fonts are inline
- The `body::before` SVG data URL would need `img-src data:` in a CSP

**6. Dependency audit**
```bash
npm audit
```
- Flag any high/critical vulnerabilities
- Note: `framer-motion`, `@google/generative-ai`, `clsx`, `tailwind-merge` are low-risk

**7. External resource loading**
- Google Fonts loaded from `fonts.googleapis.com` — third-party, no integrity hash
- If hardening is needed: self-host fonts or add `integrity` attribute

### Low priority (no current exposure)

- No authentication → no auth bypass risk
- No database → no SQL injection risk
- No file uploads → no path traversal risk
- No user-generated HTML rendered → no XSS via dangerouslySetInnerHTML
- No redirects based on user input → no open redirect risk

## Output format

For each finding:
```
SEVERITY: High / Medium / Low / Info
FILE: src/app/api/generate/route.ts:42
ISSUE: [description]
RECOMMENDATION: [specific fix]
```

Flag anything that needs immediate action vs. nice-to-have hardening.
