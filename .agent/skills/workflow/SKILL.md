---
name: workflow
description:
  Defines the standard engineering workflow for tasks, plans, and walkthroughs.
---

# Engineering Workflow Standard

This skill defines the standard workflow for executing engineering tasks within
the project.

## When to use this skill

- Use this when starting a new complex task (Task boundary).
- This is helpful for documenting your plan before execution.
- Use when summarizing your work after completion.

## How to use it

### 1. Task Management (`task.md`)

Use for tracking progress.

```markdown
# [Task Name]

- [ ] High-level objective <!-- id: 0 -->
  - [ ] Sub-task <!-- id: 1 -->
```

### 2. Implementation Planning (`implementation_plan.md`)

Use before coding to verify the approach.

```markdown
# [Goal Description]

## User Review Required

## Proposed Changes

### [Component]

#### [MODIFY] [file]

## Verification Plan
```

### 3. Walkthroughs (`walkthrough.md`)

Use after completion to prove success.

```markdown
# [Task Name] Walkthrough

## Summary of Changes

## Verification
```
