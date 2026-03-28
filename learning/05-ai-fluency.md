# 05 — AI Fluency

A personal map of what AI fluency looks like as a skill, where this project sits on that map, and what to develop next.

---

## What you actually built in this project

Before talking about what to learn, it's worth being clear about what was already demonstrated:

- **Designed a human-AI interaction** — the user decides mood, subject, style. The AI generates. The user keeps or discards. This is a real product decision about where AI acts and where the human is in control.
- **Wrote and tuned a system prompt** — with persona, format constraints, quality bar, and negative examples. Not just "generate a prompt" but a specific voice and specific output shape.
- **Isolated the AI boundary** — one route, one client function, sanitised inputs, validated outputs. This is builder-level fluency, not just user-level.
- **Made the AI language-aware** — rather than post-translating, you passed intent to the model. Shows understanding of what models can do natively.
- **Understood the API contract** — keeping chip values in English while translating display labels is a real mental model of AI-as-service vs. AI-as-interface.

This is a solid foundation. Most people who "use AI" haven't done any of this.

---

## The fluency map

Think of AI fluency as five overlapping layers. You're not moving through them linearly — you develop all of them simultaneously, but at different speeds.

### Layer 1 — User
Using AI tools to do things faster. ChatGPT for research, Claude for writing, Copilot for autocomplete.

*What you've shown:* This is table stakes at this point. You're well past here.

### Layer 2 — Prompter
Deliberately shaping AI output. Knowing how to give context, set constraints, ask for a specific format, iterate when the output is wrong.

*What you've shown:* Strong. The spec-before-implement pattern, the "state what stays in English" pattern, the persona + format + examples structure in the system prompt.

*What's next:* **Prompt versioning and comparison.** Right now the system prompt is a single version with no history. Start keeping a scratch file of prompt variants. When you change the system prompt, note what changed and why. Compare outputs across versions. This is how you build intuition about *why* something works.

### Layer 3 — Builder
Integrating AI into products. API calls, system prompts, output validation, error handling, cost awareness.

*What you've shown:* Strong for a solo project. Clean API boundary, input sanitisation, output shape validation, graceful fallbacks (null return on failure).

*What's next:* **Streaming responses.** Right now the app waits for the full response before showing anything. Streaming (`groq.chat.completions.create({ stream: true })`) lets you show text as it arrives — feels dramatically faster and more alive. It's also where you learn to handle partial JSON.

### Layer 4 — Designer
Designing the *experience* of AI in a product. When does the AI act? When does the human decide? What does trust look like? What happens when it fails? How do you make AI output feel appropriate rather than intrusive?

*What you've shown:* Good instincts. The one-tap generate interaction respects user intent. The Compose sheet gives control back to the user without overwhelming them. The "keep / discard" model is honest — the AI suggests, the human decides.

*What's next:* **Designing for failure.** What does a bad generation look like? Right now a bad prompt just shows up as a bad prompt. Consider: what signals would tell the user this one isn't worth keeping? Could the user flag a bad generation? Could bad generations improve the system prompt over time? These are designer-level questions.

### Layer 5 — Strategist
Deciding where AI creates value in a product (and where it doesn't). What should never be AI-generated? What's the competitive moat — the prompt, the curation, the UX, the data? How does the AI shape the product's identity?

*What you've shown:* The decision to pair AI generation with human-curated reference boards is a strategic one. The AI generates, but the boards give it taste. That's a real product differentiation decision.

*What's next:* **Articulating the moat.** If someone copied your Groq API call and the same system prompt, would they have what you have? Probably not — the 56 reference boards, the visual language, the "keeping" metaphor, and the composition UI are where the value is. Being able to name this clearly is strategist-level thinking.

---

## What to practice

### Short practices (15–30 min each)

**Prompt comparison**
Change one variable in a system prompt. Run 5 generations with each version. Write down what changed. This builds intuition faster than reading about prompting.

**Output critique**
Take 10 outputs from Draw Inspiration. Rate each one: 1 (bad), 2 (fine), 3 (great). Write one sentence about why. After 50 ratings you'll have a clear model of what the AI is good at and where it fails.

**Persona experiment**
Rewrite the system prompt with a different persona. Instead of "evocative creative drawing prompt generator," try "austere film director" or "19th century naturalist." Same task, different voice. Notice how the outputs differ.

**Failure mapping**
List every way the AI feature in Draw Inspiration can fail. Not just "returns bad JSON" but: gives a cliché prompt, ignores the mood, generates something offensive, hallucinates a breakdown field, returns perfect JSON but terrible creative content. For each failure: what's the current behaviour? What should it be?

### Longer practices (hours to days)

**Add streaming to the generate route**
This is a real builder skill. The Groq SDK supports streaming. Implement it and handle the partial JSON. This is where you'll learn about state management for streaming UIs.

**A/B test the system prompt**
Add a `variant` param to the generate route. Write two system prompts. Run 20 generations of each and compare. Which produces more specific imagery? More unusual scenarios? This is how product teams actually improve AI features.

**Build something with a different model**
Use Claude's API (not via Claude Code, but directly). Or GPT-4o. Notice what's different — the tone, the instruction-following, the failure modes. Cross-model experience makes you much better at model selection.

**Design the feedback loop**
Add a "flag this" button to Draw Inspiration. Store flagged prompts in localStorage. Write a script that formats them as examples for the system prompt. This is the full loop: generate → collect signal → improve. Even at small scale, this is how AI products get better.

---

## What makes an AI product professional

Not a list of tools or platforms. These are the actual capabilities:

**Mental models of what models do**
Understanding that LLMs predict tokens, not "think." Knowing that they're sensitive to framing, that they have training cutoffs, that they hallucinate confidently. This shapes every product decision.

**The ability to write a system prompt from scratch**
Not copy-paste. Starting with: what persona? what task? what format? what to avoid? what's a good example? what's a bad one? This is a craft skill that takes deliberate practice.

**Knowing when not to use AI**
The hardest skill. AI is wrong for: things that need to be exactly right (legal text, medical advice), things that need to be personalised to a specific person (not a demographic), things where the process matters more than the output (therapy, learning), things where trust is the product.

**Designing the human-AI handoff**
At every point in a product where AI acts, there's a decision about what the human does next. Keep? Edit? Discard? Approve? These micro-interactions define whether an AI feature feels like a tool or a burden.

**Reading AI output critically**
Noticing when something is plausible-sounding but wrong. Noticing when the AI is confident but hedging. Noticing when it's generated filler vs. something actually useful. This is the skill that separates people who use AI well from those who publish its errors.

---

## Resources worth spending time on

These are chosen for relevance to where this project sits — product-focused, practical, not research-level:

- **Anthropic's prompt engineering guide** — the most direct resource for getting better at system prompts
- **"Building with LLMs" by Simon Willison** — practical, opinionated, product-focused
- **Lenny's Podcast episodes on AI product** — how PMs and designers think about AI features at scale
- **Eugene Wei's writing on product intuition** — not AI-specific, but the thinking transfers directly to AI product decisions
- **Your own output logs** — seriously, rating your own AI outputs is more valuable than most reading

---

## Where this project puts you

You built a real product with AI at the core. You made deliberate decisions about where the AI acts and where the human decides. You wrote a system prompt with craft. You isolated the AI boundary correctly. You thought about language, tone, and failure.

That's not beginner work. The next step is not "learn AI" — it's going deeper on specific skills: streaming, feedback loops, prompt versioning, multi-model awareness, and designing for failure.

The best way to build those skills is to keep building things and reflecting on them. This folder is already that practice.
