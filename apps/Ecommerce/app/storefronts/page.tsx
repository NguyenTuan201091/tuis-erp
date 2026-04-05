import { getStorefrontsData } from "../../src/lib/ecommerce-data";

function statusPill(status: string): string {
  if (status === "ACTIVE") return "pill ok";
  if (status === "MAINTENANCE") return "pill warn";
  if (status === "SUSPENDED" || status === "CLOSED") return "pill bad";
  return "pill neutral";
}

export default async function StorefrontsPage() {
  const storefronts = await getStorefrontsData();

  return (
    <section className="grid">
      <article className="card">
        <h2 className="title">Quan ly cua hang</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Ten cua hang</th>
              <th>Slug</th>
              <th>Ngon ngu</th>
              <th>Tien te</th>
              <th>Trang thai</th>
              <th>Ngay tao</th>
            </tr>
          </thead>
          <tbody>
            {storefronts.length === 0 ? (
              <tr>
                <td colSpan={6}>Chua co storefront.</td>
              </tr>
            ) : (
              storefronts.map((store: any) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.slug}</td>
                  <td>{store.locale}</td>
                  <td>{store.currency}</td>
                  <td>
                    <span className={statusPill(store.status)}>{store.status}</span>
                  </td>
                  <td>{new Date(store.createdAt).toLocaleDateString("vi-VN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
