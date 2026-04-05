import { getJournalsData } from "../../src/lib/accounting-data";

function getStatusClass(status: string) {
  if (status === "POSTED") return "status-pill status-posted";
  if (status === "PENDING" || status === "APPROVED") return "status-pill status-review";
  return "status-pill status-draft";
}

export default async function JournalsPage() {
  const entries = await getJournalsData();

  return (
    <section className="page-grid">
      <article className="card">
        <h2 className="card-title">Danh sach but toan</h2>
        <table className="table">
          <thead>
            <tr>
              <th>So but toan</th>
              <th>Ngay hach toan</th>
              <th>Dien giai</th>
              <th>Nguon</th>
              <th>Loai</th>
              <th>Tong no</th>
              <th>Trang thai</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7}>Chua co but toan. Hay tao but toan moi hoac chay seed.</td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.entryNumber}</td>
                  <td>{new Date(entry.entryDate).toLocaleDateString("vi-VN")}</td>
                  <td>{entry.description}</td>
                  <td>{entry.source}</td>
                  <td>{entry.journalType}</td>
                  <td>{entry.totalDebitText}</td>
                  <td>
                    <span className={getStatusClass(entry.status)}>{entry.statusLabel}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
