import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tenant, Prisma } from '@prisma/client';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TenantWhereUniqueInput;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput;
  }): Promise<Tenant[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.tenant.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    tenantWhereUniqueInput: Prisma.TenantWhereUniqueInput,
  ): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: tenantWhereUniqueInput,
    });
  }
}
