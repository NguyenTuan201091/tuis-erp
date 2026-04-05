export default function HomePage() {
  return (
    <section className="page-grid">
      <div className="kpi-grid">
        <article className="card">
          <p className="kpi-title">Cash Position</p>
          <p className="kpi-value">10.75B VND</p>
          <div className="kpi-trend kpi-trend-up">+4.2% vs last month</div>
        </article>

        <article className="card">
          <p className="kpi-title">Outstanding Receivables</p>
          <p className="kpi-value">5.12B VND</p>
          <div className="kpi-trend kpi-trend-down">+8.1% overdue risk</div>
        </article>

        <article className="card">
          <p className="kpi-title">Payables Due (7d)</p>
          <p className="kpi-value">1.36B VND</p>
          <div className="kpi-trend">11 invoices pending approval</div>
        </article>

        <article className="card">
          <p className="kpi-title">Close Progress</p>
          <p className="kpi-value">78%</p>
          <div className="kpi-trend">April period close in progress</div>
        </article>
      </div>

      <div className="columns">
        <article className="card">
          <h2 className="card-title">Recent Journal Entries</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Entry</th>
                <th>Date</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>JV-2026-000145</td>
                <td>2026-04-05</td>
                <td>Revenue recognition for service contract</td>
                <td><span className="status-pill status-draft">Draft</span></td>
              </tr>
              <tr>
                <td>JV-2026-000144</td>
                <td>2026-04-04</td>
                <td>Inventory valuation adjustment</td>
                <td><span className="status-pill status-review">In Review</span></td>
              </tr>
              <tr>
                <td>JV-2026-000143</td>
                <td>2026-04-03</td>
                <td>Payroll accrual and tax provision</td>
                <td><span className="status-pill status-posted">Posted</span></td>
              </tr>
            </tbody>
          </table>
        </article>

        <div className="page-grid">
          <article className="card">
            <h2 className="card-title">Quick Actions</h2>
            <div className="quick-actions">
              <a className="action-link" href="/journals">Review journal queue</a>
              <a className="action-link" href="/accounts">Open chart of accounts</a>
              <a className="action-link" href="/periods">Manage period close</a>
              <a className="action-link" href="/reports">Generate management reports</a>
            </div>
          </article>

          <article className="card">
            <h2 className="card-title">System Endpoints</h2>
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
