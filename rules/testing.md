# Testing — Draw Inspiration

## Current state

**No tests exist in this project.** There is no test framework installed and no test files under `src/`.

The `.gitignore` includes a `/coverage` entry, suggesting testing was anticipated but not yet set up.

---

## Recommended setup

### Unit / integration — Vitest

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event
```

Add to `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

### E2E — Playwright

```bash
npm init playwright@latest
```

---

## What to test (priority order)

### 1. `src/lib/storage.ts` — highest value, pure functions

```ts
// storage.test.ts
describe("savePrompt", () => {
  it("writes to localStorage", () => { ... });
  it("deduplicates by id", () => { ... });
  it("prepends new prompts", () => { ... });
});

describe("getSavedPrompts", () => {
  it("returns [] when localStorage is empty", () => { ... });
  it("returns [] when localStorage contains invalid JSON", () => { ... });
  it("returns [] in SSR context (window === undefined)", () => { ... });
});

describe("deletePrompt", () => {
  it("removes by id without affecting others", () => { ... });
});
```

### 2. `src/app/api/generate/route.ts` — API contract

```ts
// generate.test.ts — use MSW or mock @google/generative-ai
it("returns GeneratedPrompt shape on success", async () => { ... });
it("strips markdown fences from model output", async () => { ... });
it("returns 500 with { error } when model throws", async () => { ... });
it("handles missing GEMINI_API_KEY gracefully", async () => { ... });
```

### 3. `src/lib/gemini.ts` — error handling

```ts
it("returns null when fetch response is not ok", async () => { ... });
it("returns null on network error", async () => { ... });
it("returns GeneratedPrompt on success", async () => { ... });
```

### 4. E2E — core user flow

```ts
// generate.spec.ts
test("user can generate a prompt and save it", async ({ page }) => {
  await page.goto("/generate");
  await page.click("text=Generate idea");
  await page.waitForSelector("[data-testid='prompt-card']");
  await page.click("text=♡ Save");
  await page.click("text=Saved");
  await expect(page.locator("[data-testid='prompt-card']")).toBeVisible();
});
```

---

## Test conventions (when tests are added)

- Test files co-located: `src/lib/storage.test.ts` next to `src/lib/storage.ts`.
- E2E tests in `e2e/` at root.
- Mock `localStorage` with `vitest-localstorage-mock` or manual `vi.stubGlobal`.
- Never mock internal modules (storage, gemini) in E2E — only in unit tests.
- Test ids: `data-testid` attributes, not class names or text content.
