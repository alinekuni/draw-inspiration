import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an evocative creative drawing prompt generator with a poetic,
cinematic voice.

Generate a drawing prompt based on the user's selections.
Be specific, not vague. Avoid clichés.

Bad: "a sad person in a dark place"
Good: "a night-shift lighthouse keeper who catalogues ships that never arrive"

Return ONLY valid JSON in this exact structure (no markdown, no code fences):
{
  "title": "short evocative title, 4-6 words",
  "prompt": "rich 2-3 sentence description, cinematic and specific",
  "chips": ["TAG1", "TAG2", "TAG3", "TAG4"],
  "breakdown": {
    "subject": "...",
    "environment": "...",
    "mood": "...",
    "lighting": "...",
    "twist": "...",
    "constraint": "..."
  }
}

Chips should be uppercase, 1-2 words, describing mood/style/atmosphere.
If certain elements are locked (provided in the request), preserve them exactly.`;

// ── Input limits ────────────────────────────────────────────────────────────
const MAX_ARRAY_ITEMS  = 10;
const MAX_ITEM_LENGTH  = 60;
const MAX_LOCKED_KEYS  = 6;
const MAX_VALUE_LENGTH = 200;
const ALLOWED_CHARS    = /^[\w\s,\-']+$/;  // only safe characters in chip values

function sanitizeStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .slice(0, MAX_ARRAY_ITEMS)
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.slice(0, MAX_ITEM_LENGTH).replace(/[<>"'&]/g, ""));
}

function sanitizeLockedRecord(obj: unknown): Record<string, string> {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
  const entries = Object.entries(obj as Record<string, unknown>)
    .slice(0, MAX_LOCKED_KEYS)
    .filter(([k, v]) => typeof k === "string" && typeof v === "string")
    .map(([k, v]) => [
      k.slice(0, 40).replace(/[<>"'&]/g, ""),
      (v as string).slice(0, MAX_VALUE_LENGTH).replace(/[<>"'&]/g, ""),
    ]);
  return Object.fromEntries(entries);
}

// ── Route ───────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Generation unavailable" }, { status: 500 });
    }

    // Parse and validate request body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const body = rawBody as Record<string, unknown>;
    const mood   = sanitizeStringArray(body.mood);
    const style  = sanitizeStringArray(body.style);
    const locked = sanitizeLockedRecord(body.locked);
    const lang   = typeof body.lang === "string" ? body.lang : "en";

    // Build user message from sanitized inputs
    const userContext: string[] = [];
    if (mood.length)  userContext.push(`Mood: ${mood.join(", ")}`);
    if (style.length) userContext.push(`Style: ${style.join(", ")}`);
    if (Object.keys(locked).length > 0) {
      const entries = Object.entries(locked).map(([k, v]) => `${k}: ${v}`).join("\n");
      userContext.push(`Locked elements (preserve exactly):\n${entries}`);
    }

    const userMessage = userContext.length
      ? userContext.join("\n")
      : "Generate a surprising, original drawing prompt.";

    const LANG_INSTRUCTIONS: Record<string, string> = {
      "pt-BR": "Write the title, prompt, and all breakdown values in Brazilian Portuguese. Keep chips in uppercase English.",
    };
    const langInstruction = LANG_INSTRUCTIONS[lang] ?? "";
    const systemPrompt = langInstruction
      ? `${SYSTEM_PROMPT}\n\n${langInstruction}`
      : SYSTEM_PROMPT;

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model:       "llama-3.3-70b-versatile",
      messages:    [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userMessage  },
      ],
      temperature: 0.9,
      max_tokens:  512,
    });

    const text    = completion.choices[0]?.message?.content ?? "";
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Generation failed" }, { status: 500 });
    }

    // Validate expected shape before returning
    if (
      typeof data.title    !== "string" ||
      typeof data.prompt   !== "string" ||
      !Array.isArray(data.chips)        ||
      typeof data.breakdown !== "object"
    ) {
      return NextResponse.json({ error: "Generation failed" }, { status: 500 });
    }

    return NextResponse.json({
      id:        crypto.randomUUID(),
      title:     String(data.title).slice(0, 200),
      prompt:    String(data.prompt).slice(0, 1000),
      chips:     (data.chips as unknown[]).slice(0, 8).map((c) => String(c).slice(0, 40)),
      breakdown: data.breakdown,
      createdAt: Date.now(),
    });

  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
