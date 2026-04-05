import { getOrdersData } from "../../src/lib/ecommerce-data";

function statusPill(status: string): string {
  if (["COMPLETED", "DELIVERED"].includes(status)) return "pill ok";
  if (["PENDING", "PROCESSING", "CONFIRMED", "SHIPPED"].includes(status)) return "pill warn";
  if (["CANCELLED", "REFUNDED", "RETURNED"].includes(status)) return "pill bad";
  return "pill neutral";
}

export default async function OrdersPage() {
  const orders = await getOrdersData();

  return (
    <section className="grid">
      <article className="card">
        <h2 className="title">Danh sach don hang</h2>
        <table className="table">
          <thead>
            <tr>
              <th>So don</th>
              <th>Khach hang</th>
              <th>Dien thoai</th>
              <th>Tong tien</th>
              <th>Trang thai</th>
              <th>Ngay tao</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6}>Chua co don hang.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerPhone}</td>
                  <td>{order.totalText}</td>
                  <td>
                    <span className={statusPill(order.status)}>{order.statusLabel}</span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
