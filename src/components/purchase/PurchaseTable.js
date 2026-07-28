function PurchaseTable({ purchases, onEdit, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>SN</th>

          <th>Invoice</th>

          <th>Date</th>

          <th>Supplier</th>

          <th>Product</th>

          <th>Qty</th>

          <th>Rate</th>

          <th>Total</th>

          <th width="170">Action</th>
        </tr>
      </thead>

      <tbody>
        {purchases.length === 0 ? (
          <tr>
            <td colSpan="9">No Purchase Found</td>
          </tr>
        ) : (
          purchases.map((purchase, index) => (
            <tr key={purchase.id}>
              <td>{index + 1}</td>

              <td>{purchase.invoiceNo}</td>

              <td>{purchase.purchaseDate}</td>

              <td>{purchase.supplier}</td>

              <td>{purchase.product}</td>

              <td>{purchase.qty}</td>

              <td>{purchase.rate}</td>

              <td>{purchase.grandTotal}</td>

              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => onEdit(purchase)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(purchase.id)}
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

export default PurchaseTable;
