import { getDashboardData } from "../src/lib/accounting-data";

function getStatusClass(status: string) {
  if (status === "POSTED") return "status-pill status-posted";
  if (status === "PENDING" || status === "APPROVED") return "status-pill status-review";
  return "status-pill status-draft";
}

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <section className="page-grid">
      <div className="kpi-grid">
        <article className="card">
          <p className="kpi-title">Tien va tuong duong tien</p>
          <p className="kpi-value">{data.kpis.cashPosition}</p>
          <div className="kpi-trend kpi-trend-up">Du lieu tu tai khoan 111/112</div>
        </article>

        <article className="card">
          <p className="kpi-title">Cong no phai thu</p>
          <p className="kpi-value">{data.kpis.receivables}</p>
          <div className="kpi-trend">Tong hop theo nhom tai khoan 131</div>
        </article>

        <article className="card">
          <p className="kpi-title">Cong no phai tra</p>
          <p className="kpi-value">{data.kpis.payables}</p>
          <div className="kpi-trend">Tong hop theo nhom tai khoan 331</div>
        </article>

        <article className="card">
          <p className="kpi-title">Tien do dong ky</p>
          <p className="kpi-value">{data.kpis.closeProgress}</p>
          <div className="kpi-trend">{data.kpis.accountCount} tai khoan dang kich hoat</div>
        </article>
      </div>

      <div className="columns">
        <article className="card">
          <h2 className="card-title">But toan gan day</h2>
          <table className="table">
            <thead>
              <tr>
                <th>So but toan</th>
                <th>Ngay</th>
                <th>Dien giai</th>
                <th>So tien</th>
                <th>Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {data.recentJournals.length === 0 ? (
                <tr>
                  <td colSpan={5}>Chua co du lieu but toan. Hay chay seed de khoi tao du lieu mau.</td>
                </tr>
              ) : (
                data.recentJournals.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.entryNumber}</td>
                    <td>{new Date(entry.entryDate).toLocaleDateString("vi-VN")}</td>
                    <td>{entry.description}</td>
                    <td>{entry.totalDebit}</td>
                    <td>
                      <span className={getStatusClass(entry.status)}>{entry.statusLabel}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </article>

        <div className="page-grid">
          <article className="card">
            <h2 className="card-title">Tac vu nhanh</h2>
            <div className="quick-actions">
              <a className="action-link" href="/journals">Kiem duyet but toan</a>
              <a className="action-link" href="/accounts">Mo he thong tai khoan</a>
              <a className="action-link" href="/periods">Quan ly dong ky</a>
              <a className="action-link" href="/reports">Xem bao cao quan tri</a>
            </div>
          </article>

          <article className="card">
            <h2 className="card-title">Diem cuoi he thong</h2>
            <div className="simple-list">
              <a href="/api/health">/api/health</a>
              <a href="/api/docs">/api/docs</a>
              <a href="/api/docs/ui">/api/docs/ui</a>
              <a href="/api/metrics">/api/metrics</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
