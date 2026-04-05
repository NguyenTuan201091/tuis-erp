const entries = [
  { no: "JV-2026-000143", date: "2026-04-03", note: "Payroll accrual", status: "Posted" },
  { no: "JV-2026-000144", date: "2026-04-04", note: "Inventory adjustment", status: "In Review" },
  { no: "JV-2026-000145", date: "2026-04-05", note: "Service revenue recognition", status: "Draft" },
];

function getStatusClass(status: string) {
  if (status === "Posted") return "status-pill status-posted";
  if (status === "In Review") return "status-pill status-review";
  return "status-pill status-draft";
}

export default function JournalsPage() {
  return (
    <section className="page-grid">
      <article className="card">
        <h2 className="card-title">Journal Entries Queue</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Entry No</th>
              <th>Date</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.no}>
                <td>{entry.no}</td>
                <td>{entry.date}</td>
                <td>{entry.note}</td>
                <td>
                  <span className={getStatusClass(entry.status)}>{entry.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
