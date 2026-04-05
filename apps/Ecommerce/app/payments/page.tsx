import { getPaymentsData } from "../../src/lib/ecommerce-data";

function statusPill(status: string): string {
  if (status === "CAPTURED") return "pill ok";
  if (status === "PENDING" || status === "AUTHORIZED") return "pill warn";
  if (["FAILED", "CANCELLED", "EXPIRED"].includes(status)) return "pill bad";
  return "pill neutral";
}

export default async function PaymentsPage() {
  const payments = await getPaymentsData();

  return (
    <section className="grid">
      <article className="card">
        <h2 className="title">Giao dich thanh toan</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Don hang</th>
              <th>Khach hang</th>
              <th>Phuong thuc</th>
              <th>So tien</th>
              <th>Trang thai</th>
              <th>Ma GD</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6}>Chua co giao dich thanh toan.</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.order?.orderNumber || "-"}</td>
                  <td>{payment.order?.customerName || "-"}</td>
                  <td>{payment.method}</td>
                  <td>{payment.amountText}</td>
                  <td>
                    <span className={statusPill(payment.status)}>{payment.statusLabel}</span>
                  </td>
                  <td>{payment.transactionId || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
