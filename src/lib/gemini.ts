import type { GeneratedPrompt } from "@/types";

interface GenerateParams {
  mood?: string[];
  style?: string[];
  locked?: Record<string, string>;
}

export async function generatePrompt(
  params: GenerateParams
): Promise<GeneratedPrompt | null> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? `HTTP ${res.status}`);
    }

    return (await res.json()) as GeneratedPrompt;
  } catch (err) {
    console.error("[generatePrompt]", err);
    return null;
  }
}
