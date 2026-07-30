import { useEffect, useState } from "react";

function SalesForm({ editingSale, onSave, onCancel }) {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [articleNo, setArticleNo] = useState("");
  const [product, setProduct] = useState("");
  const [hsCode, setHsCode] = useState("");

  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (editingSale) {
      setInvoiceNo(editingSale.invoiceNo || "");
      setInvoiceDate(editingSale.invoiceDate || "");

      setCustomer(editingSale.customer || "");
      setPaymentMethod(editingSale.paymentMethod || "Cash");

      setArticleNo(editingSale.articleNo || "");
      setProduct(editingSale.product || "");
      setHsCode(editingSale.hsCode || "");

      setQty(editingSale.qty || 1);
      setRate(editingSale.rate || 0);
      setDiscount(editingSale.discount || 0);
      setTax(editingSale.tax || 0);

      setRemarks(editingSale.remarks || "");
    }
  }, [editingSale]);

  const subtotal = qty * rate;
  const grandTotal = subtotal - discount + tax;

  const save = () => {
    if (!invoiceNo || !customer || !product) {
      alert("Fill all required fields.");
      return;
    }

    onSave({
      invoiceNo,
      invoiceDate,
      customer,
      paymentMethod,

      articleNo,
      product,
      hsCode,

      qty: Number(qty),
      rate: Number(rate),
      discount: Number(discount),
      tax: Number(tax),

      subtotal,
      grandTotal,

      remarks,
    });
  };

  return (
    <div>
      <h3>Sales Information</h3>
      <input
        className="form-control"
        placeholder="Invoice No"
        value={invoiceNo}
        onChange={(e) => setInvoiceNo(e.target.value)}
      />
      <input
        className="form-control"
        type="date"
        value={invoiceDate}
        onChange={(e) => setInvoiceDate(e.target.value)}
      />
      <input
        className="form-control"
        placeholder="Customer"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />
      <select
        className="form-control"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option>Cash</option>
        <option>Bank</option>
        <option>Credit</option>
        <option>QR Payment</option>
      </select>
      <hr />
      <h3>Product Details</h3>
      <input
        className="form-control"
        placeholder="Article No"
        value={articleNo}
        onChange={(e) => setArticleNo(e.target.value)}
      />
      <input
        className="form-control"
        placeholder="Product"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />
      <input
        className="form-control"
        placeholder="HS Code"
        value={hsCode}
        onChange={(e) => setHsCode(e.target.value)}
      />{" "}
      <input
        className="form-control"
        type="number"
        placeholder="Quantity"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
      <input
        className="form-control"
        type="number"
        placeholder="Rate"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />
      <input
        className="form-control"
        type="number"
        placeholder="Discount"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
      />
      <input
        className="form-control"
        type="number"
        placeholder="Tax"
        value={tax}
        onChange={(e) => setTax(e.target.value)}
      />
      <hr />
      <h3>Bill Summary</h3>
      <input
        className="form-control"
        readOnly
        value={`Sub Total : ${subtotal.toFixed(2)}`}
      />
      <input
        className="form-control"
        readOnly
        value={`Grand Total : ${grandTotal.toFixed(2)}`}
      />
      <textarea
        className="form-control"
        rows="4"
        placeholder="Remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>

        <button type="button" className="btn btn-primary" onClick={save}>
          {editingSale ? "Update Sale" : "Save Sale"}
        </button>
      </div>{" "}
    </div>
  );
}

export default SalesForm;
