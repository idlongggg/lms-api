---
name: librarian
description:
  Manages memory, artifacts, and knowledge within the Antigravity system.
---

# Librarian Skill

The Librarian is responsible for the Order of Knowledge within the Antigravity
system. It ensures that memory is organized and retrieval is efficient.

## When to use this skill

- Use this when organizing artifacts or managing the `.gemini/` directory.
- This is helpful for locating specific information (Brain vs Knowledge) or
  classifying new artifacts.
- Use during cleanup tasks to remove temporary files.

## How to use it

### 1. Directory Structure

Understand the taxonomy of the `.gemini` folder:

```
.gemini/antigravity/
├── brain/          # Active memory (Conversations, Tasks)
│   └── [conversation-id]/
├── knowledge/      # Long-term memory (Docs, Findings)
└── context_state/  # User preferences, Current focus
```

- **Brain**: Stores `task.md` and `implementation_plan.md` for the current
  context.
- **Knowledge**: Stores long-term insights and documentation.

### 2. Workflow

- **Start of Task**: Check `brain` for past similar tasks to avoid repetition.
- **End of Task**: Archive valuable insights to `knowledge` for future
  reference.
- **Cleanup**: Periodically remove empty or temporary files to maintain hygiene.
