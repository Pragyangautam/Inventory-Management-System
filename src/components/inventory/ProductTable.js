function ProductTable({ products, onView, onEdit, onDelete }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>SN</th>
          <th>Article No</th>
          <th>Particular</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Stock</th>
          <th>MRP</th>
          <th>Status</th>
          <th width="220">Action</th>
        </tr>
      </thead>

      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan="9">No Products Found</td>
          </tr>
        ) : (
          products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>

              <td>{product.articleNo}</td>

              <td
                style={{
                  cursor: "pointer",
                  color: "#2563eb",
                  fontWeight: "600",
                }}
                onClick={() => onView(product)}
              >
                {product.particular}
              </td>

              <td>{product.category}</td>

              <td>{product.brand}</td>

              <td>{product.openingStock}</td>

              <td>{product.mrp}</td>

              <td>
                <span
                  style={{
                    color: product.status === "Active" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {product.status}
                </span>
              </td>

              <td>
                <button
                  className="btn btn-info"
                  onClick={() => onView(product)}
                >
                  View
                </button>{" "}
                <button
                  className="btn btn-primary"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(product.id)}
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

export default ProductTable;
