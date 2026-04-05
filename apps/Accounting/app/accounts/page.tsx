import { getAccountsData } from "../../src/lib/accounting-data";

export default async function AccountsPage() {
  const accounts = await getAccountsData();

  return (
    <section className="page-grid">
      <article className="card">
        <h2 className="card-title">He thong tai khoan (VAS)</h2>
        <table className="table">
          <thead>
            <tr>
              <th>So TK</th>
              <th>Ten tai khoan</th>
              <th>Loai</th>
              <th>Nhom</th>
              <th>So du hien tai</th>
              <th>Trang thai</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={6}>Chua co tai khoan. Hay chay seed de tao du lieu ban dau.</td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.accountNumber}</td>
                  <td>{account.name}</td>
                  <td>{account.accountType}</td>
                  <td>{account.accountGroup}</td>
                  <td>{account.currentBalanceText}</td>
                  <td>{account.isActive ? "Dang hoat dong" : "Ngung"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
