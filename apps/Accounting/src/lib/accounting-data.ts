import prisma from "./prisma";

const TENANT_ID = process.env.ACCOUNTING_TENANT_ID || "demo-tenant";
const db = prisma as any;

function asNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toString" in value) {
    return Number((value as { toString: () => string }).toString());
  }
  return 0;
}

function vnd(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusVn(status: string): string {
  const map: Record<string, string> = {
    DRAFT: "Nhap",
    PENDING: "Cho duyet",
    APPROVED: "Da duyet",
    POSTED: "Da ghi so",
    REVERSED: "Da dao",
    REJECTED: "Tu choi",
  };
  return map[status] || status;
}

function periodStatusVn(status: string): string {
  const map: Record<string, string> = {
    OPEN: "Mo",
    SOFT_CLOSE: "Dong mem",
    HARD_CLOSE: "Dong cung",
    REOPENED: "Mo lai",
  };
  return map[status] || status;
}

export async function getDashboardData() {
  const [accounts, journals, periods] = await Promise.all([
    db.account.findMany({
      where: { tenantId: TENANT_ID, isActive: true },
      select: {
        id: true,
        accountNumber: true,
        name: true,
        currentBalance: true,
      },
    }),
    db.journalEntry.findMany({
      where: { tenantId: TENANT_ID },
      orderBy: { entryDate: "desc" },
      take: 6,
      select: {
        id: true,
        entryNumber: true,
        entryDate: true,
        description: true,
        status: true,
        totalDebit: true,
      },
    }),
    db.fiscalPeriod.findMany({
      where: { tenantId: TENANT_ID },
      orderBy: [{ fiscalYear: { year: "desc" } }, { period: "asc" }],
      take: 12,
      select: {
        id: true,
        period: true,
        status: true,
      },
    }),
  ]);

  const cashPosition = (accounts as any[])
    .filter((item) => item.accountNumber.startsWith("111") || item.accountNumber.startsWith("112"))
    .reduce((sum, item) => sum + asNumber(item.currentBalance), 0);

  const receivables = (accounts as any[])
    .filter((item) => item.accountNumber.startsWith("131"))
    .reduce((sum, item) => sum + asNumber(item.currentBalance), 0);

  const payables = (accounts as any[])
    .filter((item) => item.accountNumber.startsWith("331"))
    .reduce((sum, item) => sum + asNumber(item.currentBalance), 0);

  const closedPeriods = (periods as any[]).filter((item: any) => item.status !== "OPEN").length;
  const closeProgress = (periods as any[]).length ? Math.round((closedPeriods / (periods as any[]).length) * 100) : 0;

  return {
    kpis: {
      cashPosition: vnd(cashPosition),
      receivables: vnd(receivables),
      payables: vnd(payables),
      closeProgress: `${closeProgress}%`,
      accountCount: (accounts as any[]).length,
      journalCount: (journals as any[]).length,
    },
    recentJournals: (journals as any[]).map((item: any) => ({
      id: item.id,
      entryNumber: item.entryNumber,
      entryDate: item.entryDate,
      description: item.description,
      status: item.status,
      statusLabel: statusVn(item.status),
      totalDebit: vnd(asNumber(item.totalDebit)),
    })),
  };
}

export async function getAccountsData() {
  const accounts = await db.account.findMany({
    where: { tenantId: TENANT_ID },
    orderBy: { accountNumber: "asc" },
    take: 200,
    select: {
      id: true,
      accountNumber: true,
      name: true,
      accountType: true,
      accountGroup: true,
      currentBalance: true,
      isActive: true,
    },
  });

  return (accounts as any[]).map((item: any) => ({
    ...item,
    currentBalanceText: vnd(asNumber(item.currentBalance)),
  }));
}

export async function getJournalsData() {
  const journals = await db.journalEntry.findMany({
    where: { tenantId: TENANT_ID },
    orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
    take: 50,
    select: {
      id: true,
      entryNumber: true,
      entryDate: true,
      description: true,
      status: true,
      totalDebit: true,
      source: true,
      journalType: true,
    },
  });

  return (journals as any[]).map((item: any) => ({
    ...item,
    statusLabel: statusVn(item.status),
    totalDebitText: vnd(asNumber(item.totalDebit)),
  }));
}

export async function getPeriodsData() {
  const periods = await db.fiscalPeriod.findMany({
    where: { tenantId: TENANT_ID },
    include: {
      fiscalYear: {
        select: {
          year: true,
          status: true,
        },
      },
    },
    orderBy: [{ fiscalYear: { year: "desc" } }, { period: "asc" }],
    take: 24,
  });

  return (periods as any[]).map((item: any) => ({
    id: item.id,
    year: item.fiscalYear.year,
    period: item.period,
    name: item.name,
    status: item.status,
    statusLabel: periodStatusVn(item.status),
    closedAt: item.closedAt,
  }));
}

export async function getReportsData() {
  const [accounts, journals] = await Promise.all([
    db.account.groupBy({
      by: ["accountType"],
      where: { tenantId: TENANT_ID },
      _count: { _all: true },
    }),
    db.journalEntry.findMany({
      where: { tenantId: TENANT_ID },
      orderBy: { entryDate: "desc" },
      take: 12,
      select: {
        id: true,
        entryDate: true,
        totalDebit: true,
      },
    }),
  ]);

  const journalVolume = (journals as any[]).reduce((sum: number, item: any) => sum + asNumber(item.totalDebit), 0);

  return {
    accountMix: (accounts as any[]).map((item: any) => ({
      type: item.accountType,
      count: item._count._all,
    })),
    journalVolume: vnd(journalVolume),
    journalCount: (journals as any[]).length,
  };
}
