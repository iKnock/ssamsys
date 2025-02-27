import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing users
  await prisma.user.deleteMany();

  // Seed users
  const users = [
    {
      email: 'admin@stockmgt.com',
      name: 'Admin User',
      password: await bcrypt.hash('AdminPass123!', 10),
      role: 'admin'
    },
    {
      email: 'manager@stockmgt.com',
      name: 'Manager User',
      password: await bcrypt.hash('ManagerPass123!', 10),
      role: 'manager'
    },
    {
      email: 'staff@stockmgt.com',
      name: 'Staff User',
      password: await bcrypt.hash('StaffPass123!', 10),
      role: 'staff'
    }
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
    console.log(`Created user: ${user.email}`);
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
