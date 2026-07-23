import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaBoxes,
  FaUsers,
  FaReceipt,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaPrint,
  FaCog,
  FaBuilding,
} from "react-icons/fa";

function Dashboard({ setActiveModule }) {
  // 1. Company Settings State (Loaded from LocalStorage)
  const [companyDetails, setCompanyDetails] = useState(() => {
    const saved = localStorage.getItem("pragyan_company_details");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Pragyan Enterprises Pvt. Ltd.",
          location: "Kathmandu, Nepal",
          pan: "601234567",
          phone: "+977-9800000000",
          email: "info@pragyan.com.np",
        };
  });

  // Modal Visibility State
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Temp State for editing form inside Modal
  const [tempCompanyDetails, setTempCompanyDetails] = useState({
    ...companyDetails,
  });

  // 2. Dashboard Data State
  const [products] = useState(() => {
    const saved = localStorage.getItem("pragyan_products");
    return saved ? JSON.parse(saved) : [];
  });

  const [customers] = useState(() => {
    const saved = localStorage.getItem("pragyan_customers");
    return saved ? JSON.parse(saved) : [];
  });

  const [issuedSales] = useState(() => {
    const saved = localStorage.getItem("pragyan_issued_bills");
    return saved ? JSON.parse(saved) : [];
  });

  const [purchases] = useState(() => {
    const saved = localStorage.getItem("pragyan_purchases");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate Totals
  const totalSalesAmount = issuedSales.reduce(
    (sum, s) => sum + (s.grandTotal || 0),
    0,
  );
  const totalPurchaseAmount = purchases.reduce(
    (sum, p) => sum + (p.grandTotal || 0),
    0,
  );
  const lowStockCount = products.filter((p) => p.qty <= 5).length;

  const formatNPR = (amount) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  // Save Company Details Handler
  const handleSaveCompanyDetails = (e) => {
    e.preventDefault();
    setCompanyDetails(tempCompanyDetails);
    localStorage.setItem(
      "pragyan_company_details",
      JSON.stringify(tempCompanyDetails),
    );
    setShowSettingsModal(false);
    alert("Company details updated successfully!");
  };

  return (
    <div className="container py-3">
      {/* TOP BANNER & COMPANY HEADER */}
      <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <FaBuilding className="text-primary fs-3" />
              <h3 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
                {companyDetails.name}
              </h3>
            </div>
            <p className="text-muted small mb-0">
              📍 {companyDetails.location} | 💳 PAN/VAT:{" "}
              <strong>{companyDetails.pan}</strong> | 📞 {companyDetails.phone}
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-dark btn-sm shadow-sm bg-white d-flex align-items-center gap-2 fw-semibold"
              onClick={() => {
                setTempCompanyDetails({ ...companyDetails });
                setShowSettingsModal(true);
              }}
            >
              <FaCog /> Settings
            </button>
            <button
              className="btn btn-outline-secondary btn-sm shadow-sm bg-white d-flex align-items-center gap-1"
              onClick={() => window.print()}
            >
              <FaPrint /> Print Summary
            </button>
          </div>
        </div>
      </div>

      {/* TOP METRIC CARDS GRID */}
      <div className="row g-4 mb-4">
        {/* Sales Card */}
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-bold text-uppercase d-block mb-1">
                  Total Sales
                </span>
                <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  {formatNPR(totalSalesAmount)}
                </h4>
                <span className="badge bg-success-subtle text-success border border-success-subtle small fw-semibold">
                  <FaArrowUp className="me-1" /> {issuedSales.length} Issued
                  Bills
                </span>
              </div>
              <div className="bg-light p-2 rounded-3 text-primary">
                <FaFileInvoiceDollar size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Purchases Card */}
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-bold text-uppercase d-block mb-1">
                  Total Purchases
                </span>
                <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  {formatNPR(totalPurchaseAmount)}
                </h4>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle small fw-semibold">
                  <FaArrowDown className="me-1" /> {purchases.length} Purchase
                  Bills
                </span>
              </div>
              <div className="bg-light p-2 rounded-3 text-primary">
                <FaReceipt size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Items Card */}
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-bold text-uppercase d-block mb-1">
                  Products
                </span>
                <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  {products.length} Items
                </h4>
                <span
                  className={
                    lowStockCount > 0
                      ? "badge bg-danger-subtle text-danger border border-danger-subtle small fw-semibold"
                      : "badge bg-light text-muted small"
                  }
                >
                  {lowStockCount > 0
                    ? `⚠️ ${lowStockCount} Low Stock`
                    : "Stock Healthy"}
                </span>
              </div>
              <div className="bg-light p-2 rounded-3 text-primary">
                <FaBoxes size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Parties Card */}
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-bold text-uppercase d-block mb-1">
                  Customer Directory
                </span>
                <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  {customers.length} Accounts
                </h4>
                <span className="badge bg-light text-muted border small fw-semibold">
                  Active Ledgers
                </span>
              </div>
              <div className="bg-light p-2 rounded-3 text-primary">
                <FaUsers size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN SECTION */}
      <div className="row g-4">
        {/* LEFT COLUMN: QUICK NAVIGATION & RECENT SALES */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-4 mb-4 bg-white">
            <h5 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
              Quick Navigation
            </h5>
            <div className="row g-2">
              <div className="col-6 col-md-3">
                <button
                  className="btn btn-primary w-100 fw-bold btn-sm py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setActiveModule("billing")}
                >
                  <FaShoppingCart /> POS Billing
                </button>
              </div>
              <div className="col-6 col-md-3">
                <button
                  className="btn btn-outline-primary w-100 fw-semibold btn-sm py-2 bg-white d-flex align-items-center justify-content-center gap-1"
                  onClick={() => setActiveModule("billRecords")}
                >
                  <FaPlus /> Enter Bill
                </button>
              </div>
              <div className="col-6 col-md-3">
                <button
                  className="btn btn-outline-secondary w-100 fw-semibold btn-sm py-2 bg-white d-flex align-items-center justify-content-center gap-1"
                  onClick={() => setActiveModule("products")}
                >
                  <FaBoxes /> Products
                </button>
              </div>
              <div className="col-6 col-md-3">
                <button
                  className="btn btn-outline-secondary w-100 fw-semibold btn-sm py-2 bg-white d-flex align-items-center justify-content-center gap-1"
                  onClick={() => setActiveModule("customers")}
                >
                  <FaUsers /> Customers
                </button>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
                Recent Sales Invoices
              </h5>
              <button
                className="btn btn-link btn-sm text-decoration-none fw-semibold p-0"
                onClick={() => setActiveModule("billRecords")}
              >
                View Register →
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle border-top">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th>Invoice No</th>
                    <th>Customer Particulars</th>
                    <th className="text-end">Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedSales.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center text-muted py-4 small"
                      >
                        No issued sales invoices recorded yet.
                      </td>
                    </tr>
                  ) : (
                    issuedSales.slice(0, 5).map((sale) => (
                      <tr key={sale.id}>
                        <td>
                          <div className="fw-bold text-dark">{sale.billNo}</div>
                          <div className="text-muted small d-flex align-items-center">
                            <FaCalendarAlt
                              className="me-1 text-muted"
                              size={12}
                            />{" "}
                            {sale.date}
                          </div>
                        </td>
                        <td className="fw-semibold">{sale.customerName}</td>
                        <td className="text-end fw-bold text-success">
                          {formatNPR(sale.grandTotal)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT PURCHASES PANEL */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
                <FaReceipt className="me-2 text-success" /> Purchase Bills
              </h5>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th>Supplier / Bill</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length === 0 ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="text-center text-muted py-4 small"
                      >
                        No inward purchase bills entered.
                      </td>
                    </tr>
                  ) : (
                    purchases.slice(0, 5).map((pur) => (
                      <tr key={pur.id}>
                        <td>
                          <div className="fw-bold text-dark">
                            {pur.supplierName}
                          </div>
                          <div className="text-muted small">
                            {pur.billNo} • {pur.date}
                          </div>
                        </td>
                        <td className="text-end fw-bold text-primary">
                          {formatNPR(pur.grandTotal)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              className="btn btn-success btn-lg w-100 fw-bold py-3 mt-auto shadow-sm rounded-3 d-flex align-items-center justify-content-center"
              onClick={() => setActiveModule("billing")}
            >
              <FaShoppingCart className="me-2" /> Launch Terminal
            </button>
          </div>
        </div>
      </div>

      {/* COMPANY SETTINGS MODAL */}
      {showSettingsModal && (
        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg p-3 rounded-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-header-title fw-bold d-flex align-items-center text-dark">
                  <FaCog className="me-2 text-primary" /> Company / Business
                  Settings
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSettingsModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSaveCompanyDetails}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Company / Firm Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={tempCompanyDetails.name}
                      onChange={(e) =>
                        setTempCompanyDetails({
                          ...tempCompanyDetails,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Address / Location *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. New Road, Kathmandu"
                      value={tempCompanyDetails.location}
                      onChange={(e) =>
                        setTempCompanyDetails({
                          ...tempCompanyDetails,
                          location: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">
                        PAN / VAT Number *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 601234567"
                        value={tempCompanyDetails.pan}
                        onChange={(e) =>
                          setTempCompanyDetails({
                            ...tempCompanyDetails,
                            pan: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="+977-98..."
                        value={tempCompanyDetails.phone}
                        onChange={(e) =>
                          setTempCompanyDetails({
                            ...tempCompanyDetails,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="business@example.com"
                      value={tempCompanyDetails.email}
                      onChange={(e) =>
                        setTempCompanyDetails({
                          ...tempCompanyDetails,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm fw-semibold"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm fw-bold px-3"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
