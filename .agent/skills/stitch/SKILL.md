---
name: stitch
description:
  Connects code to documentation via context stitching and references.
---

# Stitch Skill

The Stitch skill connects the Legislative (Docs) with the Executive (API) to
ensure alignment.

## When to use this skill

- Use this when writing implementation code (Services, Resolvers, Components).
- This is helpful for keeping the codebase aligned with the specifications.
- Use when you need to understand the "Why" behind a piece of code.

## How to use it

### 1. Context Stitching

Before coding, "Stitch" the context:

- **Schema Stitch**: Working on `schema.prisma`? -> Read
  `../../docs/blueprint/architecture/database.md`.
- **Logic Stitch**: Working on `[module].service.ts`? -> Read
  `../../docs/spec/modules/[module].md`.
- **UI Stitch**: Working on a Component? -> Read `../../docs/spec/ui/frontend.md`.

### 2. In-Code References

Leave "Stitch Marks" to link code back to documentation:

```typescript
// SSoT: ../../docs/spec/modules/auth.md #Authentication-Flow
async function login() { ... }
```

### 3. Validation

- If Code contradicts the Stitched Spec, **Stop**.
- Report the mismatch using the `review` skill.
