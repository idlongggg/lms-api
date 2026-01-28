import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Tenant } from '../tenant/models/tenant.model';
import { CreateTenantInput, UpdateTenantInput } from './dto/admin.dto';
import { AuthPayload } from '../auth/dto/auth.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/rbac.config';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';
// import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
// Note: graphql-upload-ts might need to be added to package.json if missing,
// using 'any' for file input in service for now to be safe.

@Resolver()
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => Tenant)
  @RequirePermissions(Permission.TENANT_CREATE)
  // SSoT: ../../../docs/spec/modules/admin.md #Create-Tenant
  async createTenant(@Args('input') input: CreateTenantInput) {
    return this.adminService.createTenant(input);
  }

  @Mutation(() => Tenant)
  @RequirePermissions(Permission.TENANT_UPDATE)
  async updateTenant(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTenantInput,
  ) {
    return this.adminService.updateTenant(id, input);
  }

  @Mutation(() => Boolean)
  @RequirePermissions(Permission.TENANT_DELETE)
  // SSoT: ../../../docs/spec/modules/admin.md #Delete-Tenant
  async deleteTenant(@Args('id', { type: () => ID }) id: string) {
    return this.adminService.deleteTenant(id);
  }

  @Mutation(() => AuthPayload)
  @RequirePermissions(Permission.USER_IMPERSONATE) // Assuming this permission exists or using generic ADMIN
  // SSoT: ../../../docs/spec/modules/admin.md #Impersonate
  async impersonateUser(
    @CurrentUser() admin: User,
    @Args('userId', { type: () => ID }) userId: string,
  ) {
    return this.adminService.impersonateUser(admin.id, userId);
  }

  // Import Users Mutation - stub
  // @Mutation(() => ImportJob)
  // async importUsers(...)
}
