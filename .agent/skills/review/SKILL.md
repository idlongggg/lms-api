---
name: review
description: Reviews code against documentation to ensure SSoT and consistency.
---

# Code Review Skill

This skill defines the process for reviewing code within the `api/` directory to
ensure it strictly adheres to the Single Source of Truth (SSoT) defined in `docs/`.

## When to use this skill

- Use this when reviewing `implementation_plan.md` or existing code.
- This is helpful for validating that code matches the spec.
- Use when checking for stylistic consistency using `standard` skill.

## How to use it

### 1. SSoT Verification

Always verify code against its spec:

| Code Artifact              | SSoT Master (Parent)                                         |
| :------------------------- | :----------------------------------------------------------- |
| **Prisma Schema**          | `../../docs/blueprint/architecture/database.md`              |
| **Service Logic**          | `../../docs/spec/modules/*.md`                               |
| **DTOs / Interfaces**      | `../../docs/spec/modules/*.md` (or API Spec if exists)       |

### 2. Review Checklist

When reviewing code, check the following:

- **Stitch Marks**: Does the code reference the spec?
- **Logic Match**: Does the `if/else` logic match the D2 flowcharts?
- **Naming**: Do variable names match the Terms defined in the Spec?
- **Standards**: Does it follow the `standard` skill (NestJS patterns, etc.)?

### 3. Refactoring Workflow

If discrepancies are found:

1.  **Check the Spec**: Is the code wrong, or is the spec outdated?
2.  **If Code is Wrong**: Fix it to match Spec.
3.  **If Spec is Outdated**: Switch to `docs/` workspace and update Spec first (Legislative Phase), then return to Code.
