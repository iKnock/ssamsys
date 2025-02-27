import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // Clear existing users
    await prisma.user.deleteMany();

    // Define user roles
    const roles = ['admin', 'manager', 'staff'];

    // Test users with different roles and credentials
    const testUsers = [
      {
        email: 'admin@stockmgt.com',
        name: 'Admin User',
        password: 'AdminPass123!',
        role: 'admin'
      },
      {
        email: 'manager@stockmgt.com',
        name: 'Manager User',
        password: 'ManagerPass123!',
        role: 'manager'
      },
      {
        email: 'staff@stockmgt.com',
        name: 'Staff User',
        password: 'StaffPass123!',
        role: 'staff'
      }
    ];

    // Create users with hashed passwords
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: userData.role
        }
      });

      console.log(`Created user: ${userData.email} with role: ${userData.role}`);
    }

    console.log('User seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
