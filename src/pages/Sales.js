import { saveInvoice } from "../services/sales/salesService";
import { useState } from "react";

// Helper function to calculate line totals on the fly
const calculateLineTotal = (item) => {
  const qty = Number(item.qty) || 0;
  const rate = Number(item.rate) || 0;
  const discount = Number(item.discount) || 0;
  const tax = Number(item.tax) || 0;

  const lineTotal = qty * rate;
  const discountAmount = (lineTotal * discount) / 100;
  const taxable = lineTotal - discountAmount;
  const taxAmount = (taxable * tax) / 100;

  return taxable + taxAmount;
};

function Sales() {
  const [invoice, setInvoice] = useState({
    invoiceNo: `INV-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    customer: "",
    warehouse: "Main",
    paymentMethod: "Cash",
    received: 0,
    discount: 0,
    items: [
      {
        id: crypto.randomUUID(),
        product: "",
        qty: 1,
        rate: 0,
        discount: 0,
        tax: 13,
      },
    ],
  });

  const updateField = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (id, field, value) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          product: "",
          qty: 1,
          rate: 0,
          discount: 0,
          tax: 13,
        },
      ],
    }));
  };

  const removeItem = (id) => {
    if (invoice.items.length === 1) return; // Prevent deleting all rows
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // Derive totals on each render
  const subTotal = invoice.items.reduce(
    (sum, item) => sum + calculateLineTotal(item),
    0,
  );
  const grandTotal = subTotal - Number(invoice.discount || 0);
  const due = grandTotal - Number(invoice.received || 0);

  return (
    <div>
      <h1>Sales Invoice</h1>

      <div className="form-grid">
        <input value={invoice.invoiceNo} readOnly />

        <input
          type="date"
          value={invoice.date}
          onChange={(e) => updateField("date", e.target.value)}
        />

        <input
          placeholder="Customer"
          value={invoice.customer}
          onChange={(e) => updateField("customer", e.target.value)}
        />

        <input
          placeholder="Warehouse"
          value={invoice.warehouse}
          onChange={(e) => updateField("warehouse", e.target.value)}
        />

        <select
          value={invoice.paymentMethod}
          onChange={(e) => updateField("paymentMethod", e.target.value)}
        >
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>Cheque</option>
          <option>QR Payment</option>
        </select>

        <input
          type="number"
          placeholder="Invoice Discount"
          value={invoice.discount}
          onChange={(e) => updateField("discount", Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Amount Received"
          value={invoice.received}
          onChange={(e) => updateField("received", Number(e.target.value))}
        />
      </div>

      <br />

      <table className="data-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Discount %</th>
            <th>VAT %</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => {
            const lineTotal = calculateLineTotal(item);
            return (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>
                  <input
                    value={item.product}
                    onChange={(e) =>
                      updateItem(item.id, "product", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(item.id, "qty", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(item.id, "rate", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      updateItem(item.id, "discount", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.tax}
                    onChange={(e) =>
                      updateItem(item.id, "tax", Number(e.target.value))
                    }
                  />
                </td>
                <td>{lineTotal.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeItem(item.id)}
                    disabled={invoice.items.length === 1}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />

      <button className="btn btn-primary" onClick={addItem}>
        + Add Item
      </button>

      <br />
      <br />

      <div style={{ width: "350px", marginLeft: "auto" }}>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Sub Total</td>
              <td>{subTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Invoice Discount</td>
              <td>{Number(invoice.discount).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Grand Total</th>
              <th>{grandTotal.toFixed(2)}</th>
            </tr>
            <tr>
              <td>Received</td>
              <td>{Number(invoice.received).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Due</th>
              <th>{due.toFixed(2)}</th>
            </tr>
          </tbody>
        </table>
      </div>

      <br />

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          className="btn btn-success"
          onClick={async () => {
            try {
              const sale = await saveInvoice({
                ...invoice,
                subTotal,
                grandTotal,
                due,
              });

              alert(`Invoice ${sale?.invoiceNo || invoice.invoiceNo} Saved`);

              setInvoice({
                invoiceNo: `INV-${Date.now()}`,
                date: new Date().toISOString().split("T")[0],
                customer: "",
                warehouse: "Main",
                paymentMethod: "Cash",
                received: 0,
                discount: 0,
                items: [
                  {
                    id: crypto.randomUUID(),
                    product: "",
                    qty: 1,
                    rate: 0,
                    discount: 0,
                    tax: 13,
                  },
                ],
              });
            } catch (error) {
              console.error("Failed to save invoice:", error);
              alert("Error saving invoice.");
            }
          }}
        >
          Save Invoice
        </button>

        <button
          className="btn btn-primary"
          onClick={() => {
            window.print();
          }}
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}

export default Sales;
