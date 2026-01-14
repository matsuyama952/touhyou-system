import { PrismaClient } from '@prisma/client';

// Vercel Serverless環境でPrismaClientをシングルトンとして管理
// Hot reloadでのコネクション増加を防止

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
