import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __ecommercePrisma: PrismaClient | undefined;
}

const prisma = global.__ecommercePrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__ecommercePrisma = prisma;
}

export default prisma;
