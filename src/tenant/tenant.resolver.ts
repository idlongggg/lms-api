import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Tenant } from './models/tenant.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/rbac.config';

@Resolver(() => Tenant)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => [Tenant], { name: 'tenants' })
  @RequirePermissions(Permission.TENANT_READ)
  // SSoT: ../../../docs/spec/modules/admin.md #Lifecycle-Sequence
  async getTenants() {
    return this.tenantService.findAll({});
  }

  @Query(() => Tenant, { name: 'tenant', nullable: true })
  @RequirePermissions(Permission.TENANT_READ)
  async getTenant(@Args('id', { type: () => String }) id: string) {
    return this.tenantService.findOne({ id });
  }
}
