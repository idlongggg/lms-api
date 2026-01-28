/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import {
  CreateTenantInput,
  UpdateTenantInput,
  JobStatus,
  ImportJob,
} from './dto/admin.dto';
import { Tenant } from '../tenant/models/tenant.model';
import { AuthPayload } from '../auth/dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { TenantStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  // SSoT: ../../../docs/spec/modules/admin.md #Create-Tenant
  async createTenant(input: CreateTenantInput): Promise<Tenant> {
    const { code, name } = input;
    // adminEmail unused for now until invite sent

    const existing = await this.prisma.tenant.findUnique({
      where: { code },
    });
    if (existing) throw new BadRequestException('Tenant code already exists');

    const tenant = await this.prisma.tenant.create({
      data: {
        code,
        name,
        status: TenantStatus.ACTIVE, // Or PENDING if email verification flow
      },
    });

    // Create Admin User for this Tenant?
    // Spec says: "Email Service": send_admin_invite
    // For now, let's just create the tenant resource.

    return tenant as unknown as Tenant;
  }

  // SSoT: ../../../docs/spec/modules/admin.md #Delete-Tenant
  async deleteTenant(id: string): Promise<boolean> {
    await this.prisma.tenant.update({
      where: { id },
      data: { status: TenantStatus.DELETED },
    });
    // Schedule hard delete (queue) - TODO
    return true;
  }

  async updateTenant(id: string, input: UpdateTenantInput): Promise<Tenant> {
    return (await this.prisma.tenant.update({
      where: { id },
      data: {
        ...input,
        settings: input.settings ? JSON.parse(input.settings) : undefined,
      },
    })) as unknown as Tenant;
  }

  // SSoT: ../../../docs/spec/modules/admin.md #Import-Users
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async importUsers(_file: any, _tenantId: string): Promise<ImportJob> {
    // Stub implementation
    const jobId = uuidv4();
    await Promise.resolve(); // satisfy require-await
    // Push to Queue...
    return {
      jobId,
      status: JobStatus.PENDING,
    };
  }

  // SSoT: ../../../docs/spec/modules/admin.md #Impersonate
  async impersonateUser(
    adminId: string,
    targetUserId: string,
  ): Promise<AuthPayload> {
    // Log Audit Trail
    // await this.auditService.log(...)

    return this.authService.generateImpersonationToken(adminId, targetUserId);
  }
}
