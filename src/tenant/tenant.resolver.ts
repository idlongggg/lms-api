import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { TenantService } from './tenant.service';
import { Tenant } from './models/tenant.model';

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Query(() => [Tenant], { name: 'tenants' })
  async getTenants() {
    return this.tenantService.findAll({});
  }

  @Query(() => Tenant, { name: 'tenant', nullable: true })
  async getTenant(@Args('id', { type: () => String }) id: string) {
    return this.tenantService.findOne({ id });
  }
}
