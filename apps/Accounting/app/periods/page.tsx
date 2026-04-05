const periods = [
  { period: "2026-01", closeState: "Closed", owner: "Tran HQ" },
  { period: "2026-02", closeState: "Closed", owner: "Tran HQ" },
  { period: "2026-03", closeState: "Soft Close", owner: "Le PM" },
  { period: "2026-04", closeState: "Open", owner: "Le PM" },
];

export default function PeriodsPage() {
  return (
    <section className="page-grid">
      <article className="card">
        <h2 className="card-title">Fiscal Period Control</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Status</th>
              <th>Responsible</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((row) => (
              <tr key={row.period}>
                <td>{row.period}</td>
                <td>{row.closeState}</td>
                <td>{row.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
