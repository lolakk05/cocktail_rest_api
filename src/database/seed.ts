import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash('testpassword', 10);
  const adminPassword = await bcrypt.hash('adminpassword', 10);

  await prisma.user.create({
    data: {
      login: 'testuser',
      email: 'user@example.com',
      password: hashedPassword,
      role: Role.USER,
    },
  });

  await prisma.user.create({
    data: {
      login: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
}
