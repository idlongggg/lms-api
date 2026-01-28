import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { AuthModule } from '../auth/auth.module';
// import { CreateTenantInput, UpdateTenantInput } from './dto/admin.dto';

// import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [AuthModule],
  providers: [AdminService, AdminResolver],
})
export class AdminModule {}
