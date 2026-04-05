import { PrismaClient, AccountGroup, AccountType, NormalBalance } from "@prisma/client";

const prisma = new PrismaClient();

const TENANT_ID = "demo-tenant";

async function seedAccounts() {
  const chart = [
    {
      accountNumber: "111",
      name: "Tiền mặt",
      accountType: AccountType.ASSET,
      accountGroup: AccountGroup.GROUP_1,
      normalBalance: NormalBalance.DEBIT,
    },
    {
      accountNumber: "112",
      name: "Tiền gửi ngân hàng",
      accountType: AccountType.ASSET,
      accountGroup: AccountGroup.GROUP_1,
      normalBalance: NormalBalance.DEBIT,
    },
    {
      accountNumber: "131",
      name: "Phải thu khách hàng",
      accountType: AccountType.ASSET,
      accountGroup: AccountGroup.GROUP_1,
      normalBalance: NormalBalance.DEBIT,
    },
    {
      accountNumber: "331",
      name: "Phải trả người bán",
      accountType: AccountType.LIABILITY,
      accountGroup: AccountGroup.GROUP_3,
      normalBalance: NormalBalance.CREDIT,
    },
  ];

  for (const account of chart) {
    await prisma.account.upsert({
      where: {
        accountNumber_tenantId: {
          accountNumber: account.accountNumber,
          tenantId: TENANT_ID,
        },
      },
      update: {
        name: account.name,
        accountType: account.accountType,
        accountGroup: account.accountGroup,
        normalBalance: account.normalBalance,
        isActive: true,
      },
      create: {
        accountNumber: account.accountNumber,
        name: account.name,
        accountType: account.accountType,
        accountGroup: account.accountGroup,
        normalBalance: account.normalBalance,
        tenantId: TENANT_ID,
      },
    });
  }
}

async function seedFiscalYear() {
  const year = new Date().getFullYear();

  const fiscalYear = await prisma.fiscalYear.upsert({
    where: {
      year_tenantId: {
        year,
        tenantId: TENANT_ID,
      },
    },
    update: {
      isCurrent: true,
    },
    create: {
      year,
      startDate: new Date(`${year}-01-01T00:00:00.000Z`),
      endDate: new Date(`${year}-12-31T23:59:59.999Z`),
      isCurrent: true,
      tenantId: TENANT_ID,
    },
  });

  await prisma.fiscalPeriod.upsert({
    where: {
      fiscalYearId_period: {
        fiscalYearId: fiscalYear.id,
        period: 1,
      },
    },
    update: {
      name: `Thang 1/${year}`,
    },
    create: {
      fiscalYearId: fiscalYear.id,
      period: 1,
      name: `Thang 1/${year}`,
      startDate: new Date(`${year}-01-01T00:00:00.000Z`),
      endDate: new Date(`${year}-01-31T23:59:59.999Z`),
      tenantId: TENANT_ID,
    },
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required before running seed");
  }

  await seedAccounts();
  await seedFiscalYear();

  console.log("Accounting seed completed");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
