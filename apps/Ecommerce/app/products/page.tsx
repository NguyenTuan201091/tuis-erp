import { getProductsData } from "../../src/lib/ecommerce-data";

function statusPill(status: string): string {
  if (status === "ACTIVE") return "pill ok";
  if (status === "OUT_OF_STOCK") return "pill warn";
  if (status === "DISCONTINUED" || status === "ARCHIVED") return "pill bad";
  return "pill neutral";
}

export default async function ProductsPage() {
  const products = await getProductsData();

  return (
    <section className="grid">
      <article className="card">
        <h2 className="title">Danh sach san pham</h2>
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Ten san pham</th>
              <th>Ton kho</th>
              <th>Gia goc</th>
              <th>Gia ban</th>
              <th>Trang thai</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6}>Chua co san pham.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.stockQuantity}</td>
                  <td>{p.basePriceText}</td>
                  <td>{p.salePriceText}</td>
                  <td>
                    <span className={statusPill(p.status)}>{p.status}</span>
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
