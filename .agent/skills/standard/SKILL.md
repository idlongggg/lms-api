---
name: standard
description:
  Defines the coding standards for API development (NestJS, Prisma).
---

# API Coding Standards

This skill defines the technical standards for the `api/` repository.

## When to use this skill

- Use this when writing or refactoring NestJS code.
- This is helpful for ensuring consistency across modules.
- Use when designing DTOs, Entities, or Database Schemas.

## How to use it

### 1. NestJS Structure

Follow the modular architecture:

- **Modules**: `src/[feature]/[feature].module.ts`
- **Services**: `src/[feature]/[feature].service.ts` (Business Logic)
- **Resolvers**: `src/[feature]/[feature].resolver.ts` (GraphQL Interface)
- **DTOs**: `src/[feature]/dto/*.dto.ts` (Input validation)
- **Entities**: `src/[feature]/entities/*.entity.ts` (Object types)

### 2. Naming Conventions

- **Filenames**: `kebab-case.suffix.ts` (e.g., `auth.service.ts`)
- **Classes**: `PascalCase` (e.g., `AuthService`)
- **Variables/Functions**: `camelCase` (e.g., `validateUser`)
- **Interface/Type**: `PascelCase` (e.g., `JwtPayload`)

### 3. Prisma & Database

- **Table Names**: `PascalCase` (Prisma model name), mapped to `snake_case` in DB if needed (but prefer Pascal/Camel in Prisma).
- **Fields**: `camelCase` in Prisma Schema.
- **Relationships**: Explicitly define relation fields.

### 4. GraphQL

- **Code First**: Use decorators (`@ObjectType`, `@Field`) to generate schema.
- **Descriptions**: Always add `{ description: "..." }` to `@Field` for documentation.

### 5. Error Handling

- Use `nestjs` built-in exceptions (`NotFoundException`, `BadRequestException`).
- Don't return raw strings; throw Exceptions.
