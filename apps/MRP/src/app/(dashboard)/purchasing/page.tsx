import type { Metadata } from 'next';
import { PurchaseOrdersTable } from '@/components/purchasing/purchase-orders-table';

export const metadata: Metadata = {
  title: 'Mua hàng và PO | VietERP MRP',
  description: 'Quản lý đơn mua hàng, tạo PO, theo dõi tiến độ giao và duyệt nghiệp vụ mua sắm',
};

export default function PurchasingPage() {
  return <PurchaseOrdersTable />;
}
