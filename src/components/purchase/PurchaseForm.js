import { useEffect, useState } from "react";

function PurchaseForm({ editingPurchase, onSave, onCancel }) {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [dueDate, setDueDate] = useState("");

  const [articleNo, setArticleNo] = useState("");
  const [product, setProduct] = useState("");
  const [hsCode, setHsCode] = useState("");

  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (editingPurchase) {
      setInvoiceNo(editingPurchase.invoiceNo || "");
      setPurchaseDate(editingPurchase.purchaseDate || "");
      setSupplier(editingPurchase.supplier || "");
      setWarehouse(editingPurchase.warehouse || "");
      setPaymentMethod(editingPurchase.paymentMethod || "Cash");
      setDueDate(editingPurchase.dueDate || "");

      setArticleNo(editingPurchase.articleNo || "");
      setProduct(editingPurchase.product || "");
      setHsCode(editingPurchase.hsCode || "");

      setQty(editingPurchase.qty || 1);
      setRate(editingPurchase.rate || 0);
      setDiscount(editingPurchase.discount || 0);
      setTax(editingPurchase.tax || 0);

      setRemarks(editingPurchase.remarks || "");
    }
  }, [editingPurchase]);

  const subtotal = qty * rate;
  const grandTotal = subtotal - discount + tax;

  const save = () => {
    if (!invoiceNo || !product) {
      alert("Invoice No and Product are required.");
      return;
    }

    onSave({
      invoiceNo,
      purchaseDate,
      supplier,
      warehouse,
      paymentMethod,
      dueDate,

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
      <h3>Purchase Information</h3>
      <input
        className="form-control"
        placeholder="Invoice No"
        value={invoiceNo}
        onChange={(e) => setInvoiceNo(e.target.value)}
      />
      <input
        className="form-control"
        type="date"
        value={purchaseDate}
        onChange={(e) => setPurchaseDate(e.target.value)}
      />
      <input
        className="form-control"
        placeholder="Supplier"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      />
      <input
        className="form-control"
        placeholder="Warehouse"
        value={warehouse}
        onChange={(e) => setWarehouse(e.target.value)}
      />{" "}
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
      <input
        className="form-control"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
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
      />
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
      <h3>Summary</h3>
      <input
        className="form-control"
        value={`Sub Total : ${subtotal.toFixed(2)}`}
        readOnly
      />
      <input
        className="form-control"
        value={`Grand Total : ${grandTotal.toFixed(2)}`}
        readOnly
      />
      <textarea
        className="form-control"
        rows="4"
        placeholder="Remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
      <br />{" "}
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
          {editingPurchase ? "Update Purchase" : "Save Purchase"}
        </button>
      </div>
    </div>
  );
}

export default PurchaseForm;
