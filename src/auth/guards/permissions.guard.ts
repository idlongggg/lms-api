import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission, ROLE_PERMISSIONS } from '../rbac.config';
import { Role } from '@prisma/client';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }

    // Check if any of the user's roles has ALL required permissions
    // Or logic: Check if any role satisfies the permissions.
    // Simplifying: If user has multiple roles, we merge their permissions.

    const userPermissions = new Set<Permission>();

    // user.roles is UserRole[] based on schema, but typically in JWT payload we might just store the Role enum
    // For now assuming user.roles is populated with { role: Role } objects or just Role strings in the request context
    // We need to verify how the AuthGuard populates `user`.
    // Assuming standard population for now, optimizing for safety.

    for (const userRole of user.roles) {
      const roleName = typeof userRole === 'string' ? userRole : userRole.role;
      const perms = ROLE_PERMISSIONS[roleName as Role] || [];
      perms.forEach((p) => userPermissions.add(p));
    }

    return requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );
  }
}
