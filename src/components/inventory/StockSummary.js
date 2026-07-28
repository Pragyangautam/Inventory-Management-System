import {
  calculateAvailableStock,
  stockStatus,
  stockColor,
} from "../../services/inventory/stockService";

function StockSummary({ product }) {
  if (!product) return null;

  const availableStock = calculateAvailableStock(product);
  const status = stockStatus(product);
  const color = stockColor(product);

  const stockValue = Number(product.costPrice || 0) * Number(availableStock);

  const saleValue = Number(product.mrp || 0) * Number(availableStock);

  return (
    <div className="card">
      <h2>Stock Summary</h2>

      <table className="data-table">
        <tbody>
          <tr>
            <th width="250">Available Stock</th>
            <td>{availableStock}</td>
          </tr>

          <tr>
            <th>Minimum Stock</th>
            <td>{product.minimumStock}</td>
          </tr>

          <tr>
            <th>Status</th>
            <td>
              <span
                style={{
                  color,
                  fontWeight: "bold",
                }}
              >
                {status}
              </span>
            </td>
          </tr>

          <tr>
            <th>Cost Price</th>
            <td>{product.costPrice}</td>
          </tr>

          <tr>
            <th>MRP</th>
            <td>{product.mrp}</td>
          </tr>

          <tr>
            <th>Total Cost Value</th>
            <td>{stockValue.toFixed(2)}</td>
          </tr>

          <tr>
            <th>Total Sale Value</th>
            <td>{saleValue.toFixed(2)}</td>
          </tr>

          <tr>
            <th>Expected Profit</th>
            <td
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              {(saleValue - stockValue).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StockSummary;
