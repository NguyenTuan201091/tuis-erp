const accounts = [
  { number: "111", name: "Cash", group: "Group 1", balance: "2,450,000,000" },
  { number: "112", name: "Bank", group: "Group 1", balance: "8,300,000,000" },
  { number: "131", name: "Accounts Receivable", group: "Group 1", balance: "5,120,000,000" },
  { number: "331", name: "Accounts Payable", group: "Group 3", balance: "3,840,000,000" },
  { number: "511", name: "Revenue", group: "Group 5", balance: "11,900,000,000" },
];

export default function AccountsPage() {
  return (
    <section className="page-grid">
      <article className="card">
        <h2 className="card-title">Chart of Accounts (VAS)</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Name</th>
              <th>Group</th>
              <th>Current Balance (VND)</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.number}>
                <td>{account.number}</td>
                <td>{account.name}</td>
                <td>{account.group}</td>
                <td>{account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
