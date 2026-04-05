import { getPeriodsData } from "../../src/lib/accounting-data";

export default async function PeriodsPage() {
  const periods = await getPeriodsData();

  return (
    <section className="page-grid">
      <article className="card">
        <h2 className="card-title">Quan ly ky ke toan</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nam</th>
              <th>Ky</th>
              <th>Ten ky</th>
              <th>Trang thai</th>
              <th>Ngay dong</th>
            </tr>
          </thead>
          <tbody>
            {periods.length === 0 ? (
              <tr>
                <td colSpan={5}>Chua co ky ke toan. Hay chay seed de tao ky mac dinh.</td>
              </tr>
            ) : (
              periods.map((row) => (
                <tr key={row.id}>
                  <td>{row.year}</td>
                  <td>{row.period}</td>
                  <td>{row.name}</td>
                  <td>{row.statusLabel}</td>
                  <td>{row.closedAt ? new Date(row.closedAt).toLocaleDateString("vi-VN") : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
