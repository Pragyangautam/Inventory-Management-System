import React from "react";

function SalesTable({ sales, onEdit, onDelete }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Invoice No</th>
          <th>Customer</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
          <th>Payment Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {sales.length === 0 ? (
          <tr>
            <td colSpan="9">No Sales Found</td>
          </tr>
        ) : (
          sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.invoiceNo}</td>

              <td>{sale.customer}</td>

              <td>{sale.product}</td>

              <td>{sale.quantity}</td>

              <td>${sale.price}</td>

              <td>${sale.total}</td>

              <td>
                <span>{sale.paymentStatus}</span>
              </td>

              <td>{sale.date}</td>

              <td>
                <button className="btn btn-edit" onClick={() => onEdit(sale)}>
                  Edit
                </button>

                <button
                  className="btn btn-delete"
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
