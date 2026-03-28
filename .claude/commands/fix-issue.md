Fix the issue described in $ARGUMENTS.

## Process

1. **Understand before touching anything**
   - Read the issue description carefully
   - Search for all affected files with Grep/Glob before making any edits
   - If the issue mentions a component, read it fully — don't guess at line numbers

2. **Make the minimal change**
   - Fix only what is described. Do not refactor surrounding code.
   - Do not add comments, types, or error handling to code you didn't change.
   - Do not introduce new dependencies without asking first.

3. **Verify**
   - Run `npx tsc --noEmit` — must complete with zero errors
   - Run `npm run lint` — must complete clean
   - If the fix touches the API route, test with curl:
     ```bash
     curl -X POST http://localhost:3001/api/generate \
       -H "Content-Type: application/json" \
       -d '{"mood": ["melancholic"]}'
     ```

4. **Summarise**
   - Which files changed and why
   - Any behaviour that changed as a side effect
   - Any follow-up issues discovered (note them, don't fix them)

## Branching

This is a solo project on `main`. Work directly on `main` unless you've been asked to use a branch.
If the fix is large or risky, suggest creating a branch first: `git checkout -b fix/{short-description}`.

## What not to do

- Don't amend existing commits — create a new one
- Don't use `--no-verify` to skip lint/type checks
- Don't delete files without confirming they're unused (grep for imports first)
