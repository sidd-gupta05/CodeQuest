import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Fix: Add proper initialization
export const db =
  globalForPrisma.prisma ??
  (() => {
    console.log('Creating new PrismaClient instance');
    return new PrismaClient();
  })();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
