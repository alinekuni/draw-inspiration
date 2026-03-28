# API Conventions — Draw Inspiration

Inferred from `src/app/api/generate/route.ts`, the only API route in the project.

---

## Route file location

```
src/app/api/{resource}/route.ts
```

One file per resource. HTTP methods are named exports in the same file. No nested routers or controller classes.

## Handler signature

```ts
export async function POST(request: Request) { ... }
export async function GET(request: Request) { ... }
```

Always `async`. Parameter is the native `Request` — use `NextResponse` for responses.

## Request body parsing

Parse and type the body with an inline `as` cast:

```ts
const body = await request.json() as {
  mood?: string[];
  style?: string[];
  locked?: Record<string, string>;
};
```

No Zod or runtime validation currently — type cast is trusted for internal calls. If adding a public endpoint, validate explicitly.

## Response shape

**Success:**
```ts
return NextResponse.json(data);               // 200 implicit
return NextResponse.json(data, { status: 201 });
```

**Error:**
```ts
return NextResponse.json({ error: message }, { status: 500 });
return NextResponse.json({ error: "Not found" }, { status: 404 });
```

Error shape is always `{ error: string }`. Never throw unhandled — the client (`gemini.ts`) checks `res.ok` and reads `.error`.

## Error handling

Entire handler body is wrapped in try/catch. Catch extracts a string message:

```ts
export async function POST(request: Request) {
  try {
    // ... all logic
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

## AI response handling

When using Gemini (or any LLM), always sanitise the response before `JSON.parse`:

```ts
const text = result.response.text();
const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
const data = JSON.parse(cleaned);
```

Models will occasionally wrap JSON in markdown fences. This strip is mandatory.

## ID and timestamp generation

Assigned in the route, not the client:

```ts
const prompt = {
  id: crypto.randomUUID(),   // Web Crypto API, available in Next.js edge/node
  ...data,
  createdAt: Date.now(),
};
```

## Environment variables

- Access via `process.env.GEMINI_API_KEY!` — non-null assertion is acceptable for required server-side vars.
- Never expose server env vars to the client. All Gemini calls happen in route handlers only.
- Client-side code calls `/api/generate` via fetch — it never imports `@google/generative-ai`.

## Authentication

No authentication is implemented. All routes are public. If auth is added later, use Next.js middleware (`src/middleware.ts`) rather than per-route checks.

## Adding a new route

1. Create `src/app/api/{resource}/route.ts`
2. Export named async functions for each HTTP method
3. Add the corresponding type-safe client wrapper in `src/lib/`
4. Add the return type to `src/types/index.ts` if it introduces a new domain object
5. Test with curl before wiring to the UI:

```bash
curl -X POST http://localhost:3001/api/{resource} \
  -H "Content-Type: application/json" \
  -d '{}'
```
