import React, { useState, useEffect } from "react";
import {
  FaReceipt,
  FaFileInvoiceDollar,
  FaPlus,
  FaEye,
  FaTrash,
  FaUpload,
  FaSearch,
  FaCalendarAlt,
  FaPrint,
  FaBuilding,
} from "react-icons/fa";

function BillRecords() {
  const [activeTab, setActiveTab] = useState("purchases"); // 'purchases' or 'sales'

  // Storage for Purchases (Entered Bills with image uploads)
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem("pragyan_purchases");
    return saved ? JSON.parse(saved) : [];
  });

  // Storage for Sales (Issued Bills)
  const [issuedSales, setIssuedSales] = useState(() => {
    const saved = localStorage.getItem("pragyan_issued_bills");
    return saved ? JSON.parse(saved) : [];
  });

  // New Purchase Form State
  const [newPurchase, setNewPurchase] = useState({
    billNo: "",
    supplierName: "",
    supplierPan: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    vatAmount: "",
    billImage: null,
  });

  // Preview States
  const [previewImage, setPreviewImage] = useState(null);
  const [printBill, setPrintBill] = useState(null); // Bill selected for printing
  const [searchQuery, setSearchQuery] = useState("");

  // Persist Purchases
  useEffect(() => {
    localStorage.setItem("pragyan_purchases", JSON.stringify(purchases));
  }, [purchases]);

  // Handle File Upload to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size too large! Please upload an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPurchase({ ...newPurchase, billImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Purchase Record
  const handleAddPurchase = (e) => {
    e.preventDefault();
    if (
      !newPurchase.billNo ||
      !newPurchase.supplierName ||
      !newPurchase.amount
    ) {
      alert("Please fill all mandatory fields!");
      return;
    }

    const purchaseEntry = {
      id: Date.now(),
      billNo: newPurchase.billNo,
      supplierName: newPurchase.supplierName,
      supplierPan: newPurchase.supplierPan || "N/A",
      date: newPurchase.date,
      amount: parseFloat(newPurchase.amount) || 0,
      vatAmount: parseFloat(newPurchase.vatAmount) || 0,
      grandTotal:
        (parseFloat(newPurchase.amount) || 0) +
        (parseFloat(newPurchase.vatAmount) || 0),
      billImage: newPurchase.billImage,
    };

    setPurchases([purchaseEntry, ...purchases]);

    setNewPurchase({
      billNo: "",
      supplierName: "",
      supplierPan: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      vatAmount: "",
      billImage: null,
    });

    alert("Purchase Bill Recorded Successfully!");
  };

  // Delete Purchase Record
  const handleDeletePurchase = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this purchase bill record?",
      )
    ) {
      setPurchases(purchases.filter((p) => p.id !== id));
    }
  };

  // NPR Currency Formatter
  const formatNPR = (amount) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
    }).format(amount || 0);
  };

  // Filtered lists
  const filteredPurchases = purchases.filter(
    (p) =>
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierPan.includes(searchQuery),
  );

  const filteredSales = issuedSales.filter(
    (s) =>
      s.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.billNo?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Trigger Print Command
  const handlePrintTrigger = () => {
    window.print();
  };

  return (
    <div className="container py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
            <FaReceipt className="me-2 text-primary" /> Bill & Invoice Records
          </h3>
          <p className="text-muted small mb-0">
            Track Purchase Bills (Inward) and Re-print Issued Sales Invoices
          </p>
        </div>

        {/* Search Field */}
        <div
          className="input-group input-group-sm"
          style={{ maxWidth: "280px" }}
        >
          <span className="input-group-text bg-white border-end-0">
            <FaSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search bill no, party or PAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4 border-bottom-2">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === "purchases" ? "active text-primary border-primary border-bottom-0" : "text-muted"}`}
            onClick={() => setActiveTab("purchases")}
          >
            <FaUpload className="me-2" /> Purchase Bills (Entered)
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === "sales" ? "active text-primary border-primary border-bottom-0" : "text-muted"}`}
            onClick={() => setActiveTab("sales")}
          >
            <FaFileInvoiceDollar className="me-2" /> Issued Bills (Sales)
          </button>
        </li>
      </ul>

      {/* TAB 1: PURCHASE BILLS */}
      {activeTab === "purchases" && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 rounded-3 bg-white">
              <h5 className="fw-bold text-dark mb-3">
                <FaPlus className="me-2 text-success" /> Enter Purchase Bill
              </h5>
              <form onSubmit={handleAddPurchase}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Bill / Invoice No. *
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. PUR-2081-001"
                    value={newPurchase.billNo}
                    onChange={(e) =>
                      setNewPurchase({ ...newPurchase, billNo: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Supplier / Vendor Name *
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. ABC Suppliers Pvt Ltd"
                    value={newPurchase.supplierName}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        supplierName: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold">
                      Supplier PAN/VAT
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. 601234567"
                      value={newPurchase.supplierPan}
                      onChange={(e) =>
                        setNewPurchase({
                          ...newPurchase,
                          supplierPan: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold">
                      Bill Date
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={newPurchase.date}
                      onChange={(e) =>
                        setNewPurchase({ ...newPurchase, date: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold">
                      Taxable Amount *
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="0.00"
                      value={newPurchase.amount}
                      onChange={(e) => {
                        const amt = parseFloat(e.target.value) || 0;
                        setNewPurchase({
                          ...newPurchase,
                          amount: e.target.value,
                          vatAmount: (amt * 0.13).toFixed(2),
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold">
                      VAT (13%)
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="0.00"
                      value={newPurchase.vatAmount}
                      onChange={(e) =>
                        setNewPurchase({
                          ...newPurchase,
                          vatAmount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">
                    Upload Bill Image / Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm"
                    onChange={handleImageUpload}
                  />
                  {newPurchase.billImage && (
                    <div className="mt-2 text-center">
                      <img
                        src={newPurchase.billImage}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxHeight: "100px" }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold btn-sm py-2"
                >
                  Save Purchase Record
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4 rounded-3 bg-white">
              <h5 className="fw-bold text-dark mb-3">
                Entered Purchase Bills Register
              </h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Date / Bill No</th>
                      <th>Supplier Details</th>
                      <th className="text-end">Taxable Base</th>
                      <th className="text-end">Grand Total</th>
                      <th className="text-center">Image</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPurchases.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No purchase bills entered yet.
                        </td>
                      </tr>
                    ) : (
                      filteredPurchases.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="fw-bold">{item.billNo}</div>
                            <div className="text-muted small d-flex align-items-center">
                              <FaCalendarAlt className="me-1" /> {item.date}
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold">
                              {item.supplierName}
                            </div>
                            <div className="text-muted small">
                              PAN: {item.supplierPan}
                            </div>
                          </td>
                          <td className="text-end">{formatNPR(item.amount)}</td>
                          <td className="text-end fw-bold text-success">
                            {formatNPR(item.grandTotal)}
                          </td>
                          <td className="text-center">
                            {item.billImage ? (
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setPreviewImage(item.billImage)}
                              >
                                <FaEye /> View
                              </button>
                            ) : (
                              <span className="text-muted small">No Image</span>
                            )}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-danger border-0"
                              onClick={() => handleDeletePurchase(item.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ISSUED SALES BILLS REGISTER WITH PRINT OPTION */}
      {activeTab === "sales" && (
        <div className="card shadow-sm border-0 p-4 rounded-3 bg-white">
          <h5 className="fw-bold text-dark mb-3">
            Issued Tax Invoices Register
          </h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Invoice No & Date</th>
                  <th>Customer Name</th>
                  <th>PAN / VAT</th>
                  <th>Payment Method</th>
                  <th className="text-end">Grand Total</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No sales invoices issued yet.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>
                        <div className="fw-bold">
                          {sale.billNo || `INV-${sale.id.toString().slice(-6)}`}
                        </div>
                        <div className="text-muted small">{sale.date}</div>
                      </td>
                      <td className="fw-semibold">{sale.customerName}</td>
                      <td>{sale.pan || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${sale.paymentType === "Credit" ? "bg-warning text-dark" : "bg-success"}`}
                        >
                          {sale.paymentType}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-success">
                        {formatNPR(sale.grandTotal)}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-dark d-flex align-items-center mx-auto gap-1"
                          onClick={() => setPrintBill(sale)}
                        >
                          <FaPrint /> Print
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PURCHASE BILL IMAGE MODAL */}
      {previewImage && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setPreviewImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content p-3 text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Uploaded Purchase Bill Image</h6>
                <button
                  className="btn-close"
                  onClick={() => setPreviewImage(null)}
                ></button>
              </div>
              <img
                src={previewImage}
                alt="Purchase Bill Full Preview"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE BILL INVOICE MODAL */}
      {printBill && (
        <div className="modal fade show d-block bg-dark bg-opacity-75">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 p-4">
              {/* Modal Control Bar (Hidden when printing) */}
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom d-print-none">
                <h6 className="fw-bold mb-0 text-muted">
                  Print Tax Invoice Preview
                </h6>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm fw-bold"
                    onClick={handlePrintTrigger}
                  >
                    <FaPrint className="me-1" /> Print Now
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setPrintBill(null)}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Printable Invoice Header */}
              <div className="text-center mb-4">
                <h3
                  className="fw-bold text-uppercase mb-1"
                  style={{ color: "#0f172a" }}
                >
                  <FaBuilding className="me-2 text-primary" /> Pragyan
                  Enterprises
                </h3>
                <p className="small text-muted mb-0">
                  Kathmandu, Nepal • VAT / PAN No: 601234567
                </p>
                <h5 className="fw-bold mt-2 text-decoration-underline text-uppercase">
                  TAX INVOICE
                </h5>
              </div>

              {/* Bill & Customer Meta Info */}
              <div className="row mb-4 border p-3 rounded-2 bg-light">
                <div className="col-6">
                  <p className="mb-1 small">
                    <strong>Invoice No:</strong> {printBill.billNo}
                  </p>
                  <p className="mb-1 small">
                    <strong>Date:</strong> {printBill.date}
                  </p>
                  <p className="mb-0 small">
                    <strong>Payment Method:</strong> {printBill.paymentType}
                  </p>
                </div>
                <div className="col-6 text-end">
                  <p className="mb-1 small">
                    <strong>Customer:</strong> {printBill.customerName}
                  </p>
                  <p className="mb-0 small">
                    <strong>Customer PAN:</strong> {printBill.pan || "N/A"}
                  </p>
                </div>
              </div>

              {/* Itemized Table (If available) */}
              <table className="table table-bordered mb-3">
                <thead className="table-light text-uppercase small">
                  <tr>
                    <th>Particulars</th>
                    <th className="text-end">Amount (NPR)</th>
                  </tr>
                </thead>
                <tbody>
                  {printBill.items && printBill.items.length > 0 ? (
                    printBill.items.map((item, i) => (
                      <tr key={i}>
                        <td>
                          {item.particular} ({item.qty} x {item.price})
                        </td>
                        <td className="text-end">
                          {formatNPR(item.price * item.qty)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>Issued Tax Invoice Goods / Services</td>
                      <td className="text-end">
                        {formatNPR(printBill.taxableAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Tax Calculations Summary */}
              <div className="row justify-content-end me-1 mb-4">
                <div className="col-md-5">
                  <div className="d-flex justify-content-between py-1 border-bottom small">
                    <span>Taxable Base:</span>
                    <span className="fw-semibold">
                      {formatNPR(printBill.taxableAmount)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom small">
                    <span>VAT (13%):</span>
                    <span className="fw-semibold">
                      {formatNPR(printBill.vatAmount)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-top border-bottom border-2 fw-bold">
                    <span>Grand Total:</span>
                    <span className="text-success">
                      {formatNPR(printBill.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Printable Footer */}
              <div className="d-flex justify-content-between align-items-end mt-4 pt-4 border-top">
                <div className="text-center">
                  <hr className="mb-1" style={{ width: "120px" }} />
                  <small className="text-muted">Prepared By</small>
                </div>
                <div className="text-center">
                  <hr className="mb-1" style={{ width: "120px" }} />
                  <small className="text-muted">Authorized Signature</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillRecords;
