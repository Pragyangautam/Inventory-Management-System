function SalesTable({ sales, onEdit, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>SN</th>

          <th>Invoice</th>

          <th>Date</th>

          <th>Customer</th>

          <th>Product</th>

          <th>Qty</th>

          <th>Rate</th>

          <th>Total</th>

          <th width="170">Action</th>
        </tr>
      </thead>

      <tbody>
        {sales.length === 0 ? (
          <tr>
            <td colSpan="9">No Sales Found</td>
          </tr>
        ) : (
          sales.map((sale, index) => (
            <tr key={sale.id}>
              <td>{index + 1}</td>

              <td>{sale.invoiceNo}</td>

              <td>{sale.invoiceDate}</td>

              <td>{sale.customer}</td>

              <td>{sale.product}</td>

              <td>{sale.qty}</td>

              <td>{sale.rate}</td>

              <td>{sale.grandTotal}</td>

              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => onEdit(sale)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(sale.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default SalesTable;
