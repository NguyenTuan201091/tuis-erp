const reports = [
  "Balance Sheet",
  "Income Statement",
  "Cash Flow (Indirect)",
  "Trial Balance",
  "VAT Reconciliation",
  "AR Aging",
  "AP Aging",
];

export default function ReportsPage() {
  return (
    <section className="page-grid">
      <article className="card">
        <h2 className="card-title">Reporting Center</h2>
        <div className="simple-list">
          {reports.map((report) => (
            <div key={report}>- {report}</div>
          ))}
        </div>
      </article>
    </section>
  );
}
