---
name: spec_driven
description:
  Enforces the Spec-Driven Development cycle (Spec -> Plan -> Code -> Verify).
---

# Spec-Driven Development Skill

Antigravity follows a strict flow to ensure high-quality, verifiable code. This
skill governs that lifecycle, specifically focusing on the **Executive** (Code) phase in this repository.

## When to use this skill

- Use this when starting work on a new feature or task.
- This is helpful for ensuring alignment between requirements and
  implementation.
- Use when validating that code actually solves the specified problem.

## How to use it

### 1. The Cycle

Follow these stages in order:

1.  **Spec (Legislative)**: Define _WHAT_ in `../../docs/spec/`.
    - _Output_: Markdown file with D2 diagrams (Horizontal direction preferred).
2.  **Plan (Architect)**: Define _HOW_ in `implementation_plan.md`.
    - _Output_: Plan artifact in `.gemini/brain`.
3.  **Code (Executive)**: Implement _HOW_ in `src/`.
    - _Ref_: Reference the Spec in comments ("Stitch Marks").
4.  **Verify (Judicial)**: Prove it works.
    - _Output_: `walkthrough.md` with evidence.

### 2. Rules

- **No Spec, No Code**: Never write code without a corresponding spec.
- **Refactor Spec First**: If requirements change, update the Spec _before_ the
  Code.
- **Update Task**: Keep `task.md` in sync with these cycle stages.
