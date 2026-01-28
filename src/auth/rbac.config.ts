import { Role } from '@prisma/client';

export enum Permission {
  // Tenant
  TENANT_CREATE = 'TENANT_CREATE',
  TENANT_READ = 'TENANT_READ',
  TENANT_UPDATE = 'TENANT_UPDATE',
  TENANT_DELETE = 'TENANT_DELETE',

  // User
  USER_CREATE = 'USER_CREATE',
  USER_READ = 'USER_READ',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_ASSIGN_ROLE = 'USER_ASSIGN_ROLE',
  USER_IMPERSONATE = 'USER_IMPERSONATE',

  // Content (Subject/Topic/Lesson)
  CONTENT_CREATE = 'CONTENT_CREATE',
  CONTENT_READ = 'CONTENT_READ', // Includes viewing published content
  CONTENT_UPDATE = 'CONTENT_UPDATE',
  CONTENT_DELETE = 'CONTENT_DELETE',
  CONTENT_PUBLISH = 'CONTENT_PUBLISH',

  // Learning
  LEARNING_ACCESS = 'LEARNING_ACCESS', // Access to learning path
  EXERCISE_SUBMIT = 'EXERCISE_SUBMIT',

  // Tournament
  TOURNAMENT_CREATE = 'TOURNAMENT_CREATE',
  TOURNAMENT_READ = 'TOURNAMENT_READ',
  TOURNAMENT_UPDATE = 'TOURNAMENT_UPDATE',
  TOURNAMENT_DELETE = 'TOURNAMENT_DELETE',
  TOURNAMENT_JOIN = 'TOURNAMENT_JOIN',
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission), // All permissions

  [Role.ADMIN]: [
    Permission.TENANT_READ,
    Permission.TENANT_UPDATE,
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_ASSIGN_ROLE,
    Permission.USER_IMPERSONATE,
    Permission.CONTENT_CREATE,
    Permission.CONTENT_READ,
    Permission.CONTENT_UPDATE,
    Permission.CONTENT_DELETE,
    Permission.CONTENT_PUBLISH,
    Permission.TOURNAMENT_CREATE,
    Permission.TOURNAMENT_READ,
    Permission.TOURNAMENT_UPDATE,
    Permission.TOURNAMENT_DELETE,
  ],

  [Role.TEACHER]: [
    Permission.USER_READ, // Read student info
    Permission.CONTENT_CREATE,
    Permission.CONTENT_READ,
    Permission.CONTENT_UPDATE,
    Permission.CONTENT_DELETE, // Only own content (verified in service logic)
    Permission.CONTENT_PUBLISH,
    Permission.TOURNAMENT_READ,
    Permission.TOURNAMENT_CREATE, // Can create class tournaments
  ],

  [Role.STUDENT]: [
    Permission.CONTENT_READ,
    Permission.LEARNING_ACCESS,
    Permission.EXERCISE_SUBMIT,
    Permission.TOURNAMENT_READ,
    Permission.TOURNAMENT_JOIN,
  ],

  [Role.PARENT]: [
    Permission.CONTENT_READ, // Browse curriculum
    Permission.TOURNAMENT_READ,
  ],
};
