import { getEcommerceDashboardData } from "../src/lib/ecommerce-data";

function orderPill(status: string): string {
  if (["COMPLETED", "DELIVERED"].includes(status)) return "pill ok";
  if (["PENDING", "PROCESSING", "CONFIRMED", "SHIPPED"].includes(status)) return "pill warn";
  if (["CANCELLED", "REFUNDED", "RETURNED"].includes(status)) return "pill bad";
  return "pill neutral";
}

function paymentPill(status: string): string {
  if (["CAPTURED"].includes(status)) return "pill ok";
  if (["PENDING", "AUTHORIZED"].includes(status)) return "pill warn";
  if (["FAILED", "EXPIRED", "CANCELLED"].includes(status)) return "pill bad";
  return "pill neutral";
}

export default async function HomePage() {
  const data = await getEcommerceDashboardData();

  return (
    <section className="grid">
      <div className="grid kpis">
        <article className="card">
          <p className="kpi-title">San pham dang ban</p>
          <p className="kpi-value">{data.kpis.activeProducts}</p>
          <div className="kpi-note">San pham ACTIVE</div>
        </article>

        <article className="card">
          <p className="kpi-title">Canh bao ton kho thap</p>
          <p className="kpi-value">{data.kpis.lowStock}</p>
          <div className="kpi-note">Nguong {"<="} 5</div>
        </article>

        <article className="card">
          <p className="kpi-title">Doanh thu don hang</p>
          <p className="kpi-value">{data.kpis.totalRevenueText}</p>
          <div className="kpi-note">{data.kpis.orderCount} don gan nhat</div>
        </article>

        <article className="card">
          <p className="kpi-title">Da thu tien</p>
          <p className="kpi-value">{data.kpis.paidRevenueText}</p>
          <div className="kpi-note">{data.kpis.storefrontCount} cua hang dang quan ly</div>
        </article>
      </div>

      <div className="grid cols">
        <article className="card">
          <h2 className="title">Don hang moi nhat</h2>
          <table className="table">
            <thead>
              <tr>
                <th>So DH</th>
                <th>Khach hang</th>
                <th>Tong tien</th>
                <th>Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {data.latestOrders.length === 0 ? (
                <tr>
                  <td colSpan={4}>Chua co don hang. Hay bo sung du lieu nguon.</td>
                </tr>
              ) : (
                data.latestOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.totalText}</td>
                    <td>
                      <span className={orderPill(order.status)}>{order.statusLabel}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </article>

        <div className="grid">
          <article className="card">
            <h2 className="title">Thanh toan gan day</h2>
            <div className="list">
              {data.latestPayments.length === 0 ? (
                <div>Chua co thanh toan.</div>
              ) : (
                data.latestPayments.slice(0, 5).map((payment) => (
                  <div key={payment.id}>
                    <strong>{payment.method}</strong> - {payment.amountText} -{" "}
                    <span className={paymentPill(payment.status)}>{payment.statusLabel}</span>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="card">
            <h2 className="title">Tac vu nhanh</h2>
            <div className="quick">
              <a href="/products">Quan ly san pham</a>
              <a href="/orders">Xu ly don hang</a>
              <a href="/payments">Kiem soat thanh toan</a>
              <a href="/storefronts">Dieu hanh cua hang</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
