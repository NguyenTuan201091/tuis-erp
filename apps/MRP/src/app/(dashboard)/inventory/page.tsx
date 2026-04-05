import type { Metadata } from 'next';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { SmartLayout } from '@/components/ui-v2/smart-layout';

export const metadata: Metadata = {
  title: 'Quản lý tồn kho | VietERP MRP',
  description: 'Theo dõi và quản lý tồn kho, luồng nhập xuất, vị trí kho và trạng thái hàng hóa',
};

export default function InventoryPage() {
  return (
    <SmartLayout>
      <InventoryTable />
    </SmartLayout>
  );
}
