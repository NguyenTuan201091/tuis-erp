import prisma from "./prisma";

const db = prisma as any;
const TENANT_ID = process.env.ECOMMERCE_TENANT_ID || "demo-tenant";

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

function orderStatusVn(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Cho xu ly",
    CONFIRMED: "Da xac nhan",
    PROCESSING: "Dang xu ly",
    SHIPPED: "Da giao van",
    DELIVERED: "Da giao hang",
    COMPLETED: "Hoan tat",
    CANCELLED: "Da huy",
    REFUNDED: "Da hoan tien",
    RETURNED: "Da tra hang",
  };
  return map[status] || status;
}

function paymentStatusVn(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Cho thanh toan",
    AUTHORIZED: "Da uy quyen",
    CAPTURED: "Da thu tien",
    PARTIALLY_REFUNDED: "Hoan tien mot phan",
    REFUNDED: "Da hoan tien",
    FAILED: "That bai",
    EXPIRED: "Het han",
    CANCELLED: "Da huy",
  };
  return map[status] || status;
}

export async function getEcommerceDashboardData() {
  const [products, orders, payments, storefronts] = await Promise.all([
    db.product.findMany({
      where: { tenantId: TENANT_ID },
      select: { id: true, status: true, stockQuantity: true },
    }),
    db.order.findMany({
      where: { tenantId: TENANT_ID },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
    db.payment.findMany({
      where: { order: { tenantId: TENANT_ID } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        method: true,
        status: true,
        amount: true,
        createdAt: true,
      },
    }),
    db.storefront.findMany({
      where: { tenantId: TENANT_ID },
      select: { id: true, name: true, status: true, slug: true },
    }),
  ]);

  const activeProducts = (products as any[]).filter((p: any) => p.status === "ACTIVE").length;
  const lowStock = (products as any[]).filter((p: any) => p.stockQuantity <= 5).length;
  const totalRevenue = (orders as any[]).reduce((sum: number, o: any) => sum + asNumber(o.total), 0);
  const paidRevenue = (payments as any[])
    .filter((p: any) => p.status === "CAPTURED")
    .reduce((sum: number, p: any) => sum + asNumber(p.amount), 0);

  return {
    kpis: {
      activeProducts,
      lowStock,
      orderCount: (orders as any[]).length,
      storefrontCount: (storefronts as any[]).length,
      totalRevenueText: vnd(totalRevenue),
      paidRevenueText: vnd(paidRevenue),
    },
    latestOrders: (orders as any[]).map((o: any) => ({
      ...o,
      totalText: vnd(asNumber(o.total)),
      statusLabel: orderStatusVn(o.status),
    })),
    latestPayments: (payments as any[]).map((p: any) => ({
      ...p,
      amountText: vnd(asNumber(p.amount)),
      statusLabel: paymentStatusVn(p.status),
    })),
  };
}

export async function getProductsData() {
  const products = await db.product.findMany({
    where: { tenantId: TENANT_ID },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      sku: true,
      name: true,
      status: true,
      stockQuantity: true,
      basePrice: true,
      salePrice: true,
      updatedAt: true,
    },
  });

  return (products as any[]).map((p: any) => ({
    ...p,
    basePriceText: vnd(asNumber(p.basePrice)),
    salePriceText: p.salePrice ? vnd(asNumber(p.salePrice)) : "-",
  }));
}

export async function getOrdersData() {
  const orders = await db.order.findMany({
    where: { tenantId: TENANT_ID },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerPhone: true,
      status: true,
      total: true,
      createdAt: true,
    },
  });

  return (orders as any[]).map((o: any) => ({
    ...o,
    totalText: vnd(asNumber(o.total)),
    statusLabel: orderStatusVn(o.status),
  }));
}

export async function getPaymentsData() {
  const payments = await db.payment.findMany({
    where: { order: { tenantId: TENANT_ID } },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      method: true,
      status: true,
      amount: true,
      transactionId: true,
      createdAt: true,
      order: {
        select: {
          orderNumber: true,
          customerName: true,
        },
      },
    },
  });

  return (payments as any[]).map((p: any) => ({
    ...p,
    amountText: vnd(asNumber(p.amount)),
    statusLabel: paymentStatusVn(p.status),
  }));
}

export async function getStorefrontsData() {
  return db.storefront.findMany({
    where: { tenantId: TENANT_ID },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      locale: true,
      currency: true,
      createdAt: true,
    },
  });
}
