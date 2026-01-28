---
name: ssot
description:
  Maintains the Single Source of Truth hierarchy across Blueprint, Spec, Schema,
  and Code.
---

# SSoT Maintenance Skill

This skill defines the hierarchy of truth and the workflow for maintaining
consistency across the project's layers.

## When to use this skill

- Use this when resolving discrepancies between documentation and code.
- This is helpful for understanding which document is authoritative.
- Use when planning updates to ensure the correct order of operations.

## How to use it

### 1. Hierarchy of Truth

When discrepancies arise, resolve in this order:

1.  **Blueprint** (`../../docs/blueprint/`): High-level architectural decisions and
    product direction.
2.  **Spec** (`../../docs/spec/`): Detailed technical specifications and logical data
    models.
3.  **Schema** (`prisma/schema.prisma`): The physical database
    implementation.
4.  **Code** (`src/`): The application implementation.

### 2. Maintenance Workflow

When a change is requested:

1.  **Update Documentation First**: Verify/update Blueprint and Spec first.
2.  **Update Schema (if needed)**: Update `schema.prisma` if the data model
    changes.
3.  **Sync Code**: Update the application code to match the new spec/schema.

### 3. Handling Discrepancies

- **Assume Spec is Correct**: Unless obviously outdated.
- **Ask for Clarification**: If uncertain, do not guess.
- **Do Not Reverse-Engineer**: Do not update Spec to match Code without
  verification.
