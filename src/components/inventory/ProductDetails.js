function ProductDetails({ product }) {
  if (!product) return null;

  return (
    <div className="card">
      <h2>Product Details</h2>

      <table className="data-table">
        <tbody>
          <tr>
            <th width="250">Article No</th>
            <td>{product.articleNo}</td>
          </tr>

          <tr>
            <th>HS Code</th>
            <td>{product.hsCode}</td>
          </tr>

          <tr>
            <th>Product Name</th>
            <td>{product.particular}</td>
          </tr>

          <tr>
            <th>Description</th>
            <td>{product.description}</td>
          </tr>

          <tr>
            <th>Category</th>
            <td>{product.category}</td>
          </tr>

          <tr>
            <th>Brand</th>
            <td>{product.brand}</td>
          </tr>

          <tr>
            <th>Unit</th>
            <td>{product.unit}</td>
          </tr>

          <tr>
            <th>Warehouse</th>
            <td>{product.warehouse}</td>
          </tr>

          <tr>
            <th>Supplier</th>
            <td>{product.supplier}</td>
          </tr>

          <tr>
            <th>Cost Price</th>
            <td>{product.costPrice}</td>
          </tr>

          <tr>
            <th>Wholesale Price</th>
            <td>{product.wholesalePrice}</td>
          </tr>

          <tr>
            <th>MRP</th>
            <td>{product.mrp}</td>
          </tr>

          <tr>
            <th>Opening Stock</th>
            <td>{product.openingStock}</td>
          </tr>

          <tr>
            <th>Minimum Stock</th>
            <td>{product.minimumStock}</td>
          </tr>

          <tr>
            <th>Tax Rate</th>
            <td>{product.taxRate}</td>
          </tr>

          <tr>
            <th>Barcode</th>
            <td>{product.barcode}</td>
          </tr>

          <tr>
            <th>Status</th>
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
          </tr>

          <tr>
            <th>Remarks</th>
            <td>{product.remarks}</td>
          </tr>

          {product.image && (
            <tr>
              <th>Image</th>
              <td>
                <img
                  src={product.image}
                  alt={product.particular}
                  style={{
                    width: "150px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductDetails;
