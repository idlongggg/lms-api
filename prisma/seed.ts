import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Create/Update Default Tenant
  const defaultTenant = await prisma.tenant.upsert({
    where: { code: 'DEFAULT' },
    update: {},
    create: {
      name: 'Default Tenant',
      code: 'DEFAULT',
      domain: 'localhost',
      status: 'ACTIVE',
      settings: { theme: 'light' },
    },
  });
  console.log({ defaultTenant });

  // 2. Create Super Admin User
  const superAdminEmail = 'superadmin@lms.local';
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  let superAdmin = await prisma.user.findFirst({
    where: {
      tenantId: defaultTenant.id,
      email: superAdminEmail,
      deletedAt: null,
    }
  });

  if (!superAdmin) {
    superAdmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword, 
        name: 'Super Admin',
        tenantId: defaultTenant.id,
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
      },
    });
    console.log('Created Super Admin:', superAdmin.id);
  } else {
    // Optional: Update password if it already exists to ensure it's hashed
    superAdmin = await prisma.user.update({
        where: { id: superAdmin.id },
        data: { password: hashedPassword }
    });
    console.log('Updated Super Admin password to hashed version:', superAdmin.id);
  }

  // 3. Assign Role if not exists
  const existingRole = await prisma.userRole.findUnique({
    where: {
      userId_role_tenantId: {
        userId: superAdmin.id,
        role: Role.SUPER_ADMIN,
        tenantId: defaultTenant.id,
      },
    },
  });

  if (!existingRole) {
    await prisma.userRole.create({
      data: {
        userId: superAdmin.id,
        role: Role.SUPER_ADMIN,
        tenantId: defaultTenant.id,
      },
    });
    console.log(`Assigned SUPER_ADMIN role to ${superAdminEmail}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
