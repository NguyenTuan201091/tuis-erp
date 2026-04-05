import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __accountingPrisma: PrismaClient | undefined;
}

const prisma = global.__accountingPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__accountingPrisma = prisma;
}

export default prisma;
