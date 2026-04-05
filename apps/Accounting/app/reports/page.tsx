import { getReportsData } from "../../src/lib/accounting-data";

export default async function ReportsPage() {
  const data = await getReportsData();

  return (
    <section className="page-grid">
      <article className="card">
        <h2 className="card-title">Trung tam bao cao</h2>
        <div className="simple-list">
          <div>- Bang can doi ke toan</div>
          <div>- Bao cao ket qua kinh doanh</div>
          <div>- Luu chuyen tien te (gian tiep)</div>
          <div>- Bang can doi so phat sinh</div>
          <div>- Doi chieu thue GTGT</div>
          <div>- Bao cao tuoi no phai thu</div>
          <div>- Bao cao tuoi no phai tra</div>
        </div>
      </article>

      <article className="card">
        <h2 className="card-title">Tong quan du lieu thuc</h2>
        <div className="simple-list">
          <div>- So dong but toan gan nhat: {data.journalCount}</div>
          <div>- Gia tri but toan 12 ky gan nhat: {data.journalVolume}</div>
          <div>- Co cau loai tai khoan:</div>
          {data.accountMix.length === 0 ? (
            <div>  Chua co du lieu tai khoan.</div>
          ) : (
            data.accountMix.map((row) => <div key={row.type}>  {row.type}: {row.count} tai khoan</div>)
          )}
        </div>
      </article>
    </section>
  );
}
