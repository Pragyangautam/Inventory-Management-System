import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaReceipt,
  FaBoxes,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";

// Import Available Components
import Dashboard from "./MyComponents/Dashboard/Dashboard";
import Billing from "./MyComponents/Billing/Billing";
import BillRecords from "./MyComponents/Bills/BillRecords";

// Fallback Component for Products (if file is missing or in another folder)
function ProductsPlaceholder() {
  return (
    <div className="card border-0 shadow-sm p-4 text-center">
      <FaBoxes size={48} className="text-muted mx-auto mb-3" />
      <h4 className="fw-bold text-dark">Product Catalog</h4>
      <p className="text-muted">
        To connect your existing product component, update the import path in{" "}
        <code>App.js</code>.
      </p>
    </div>
  );
}

// Fallback Component for Customers (if file is missing or in another folder)
function CustomersPlaceholder({ customerList }) {
  return (
    <div className="card border-0 shadow-sm p-4">
      <h4 className="fw-bold text-dark mb-3">Customer Directory</h4>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Customer / Firm Name</th>
              <th>PAN / VAT</th>
              <th>Location</th>
              <th className="text-end">Ledger Balance (Due)</th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((cust) => (
              <tr key={cust.id}>
                <td className="fw-bold">{cust.name}</td>
                <td>{cust.pan}</td>
                <td>{cust.location}</td>
                <td className="text-end fw-bold text-danger">
                  NPR {cust.dueAmount.toLocaleString("ne-NP")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  // Navigation State: 'dashboard' | 'billing' | 'billRecords' | 'products' | 'customers'
  const [activeModule, setActiveModule] = useState("dashboard");

  // Load Customer List from LocalStorage
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("pragyan_customers");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Walk-In Customer",
            pan: "N/A",
            location: "Retail",
            dueAmount: 0,
          },
          {
            id: 2,
            name: "Himalayan Traders Pvt Ltd",
            pan: "601234567",
            location: "Kathmandu",
            dueAmount: 12500,
          },
        ];
  });

  // Save Customers to LocalStorage on update
  useEffect(() => {
    localStorage.setItem("pragyan_customers", JSON.stringify(customers));
  }, [customers]);

  // Handle Credit Sale Posting to Ledger
  const handleCreditSale = (saleData) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((cust) => {
        if (
          cust.name.toLowerCase() === saleData.name.toLowerCase() ||
          (saleData.pan && cust.pan === saleData.pan)
        ) {
          return { ...cust, dueAmount: cust.dueAmount + saleData.dueAmount };
        }
        return cust;
      }),
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark shadow-sm px-3"
        style={{ backgroundColor: "#1e293b" }}
      >
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setActiveModule("dashboard")}
          >
            <FaBuilding className="me-2 text-primary" /> Pragyan Tax Billing &
            Accounting
          </span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-1">
              <li className="nav-item">
                <button
                  className={`btn btn-sm w-100 text-start fw-semibold d-flex align-items-center py-2 px-3 ${
                    activeModule === "dashboard"
                      ? "btn-primary text-white"
                      : "btn-link text-white-50 text-decoration-none"
                  }`}
                  onClick={() => setActiveModule("dashboard")}
                >
                  <FaTachometerAlt className="me-2" /> Dashboard
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`btn btn-sm w-100 text-start fw-semibold d-flex align-items-center py-2 px-3 ${
                    activeModule === "billing"
                      ? "btn-primary text-white"
                      : "btn-link text-white-50 text-decoration-none"
                  }`}
                  onClick={() => setActiveModule("billing")}
                >
                  <FaShoppingCart className="me-2" /> POS Billing
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`btn btn-sm w-100 text-start fw-semibold d-flex align-items-center py-2 px-3 ${
                    activeModule === "billRecords"
                      ? "btn-primary text-white"
                      : "btn-link text-white-50 text-decoration-none"
                  }`}
                  onClick={() => setActiveModule("billRecords")}
                >
                  <FaReceipt className="me-2" /> Bill Records
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`btn btn-sm w-100 text-start fw-semibold d-flex align-items-center py-2 px-3 ${
                    activeModule === "products"
                      ? "btn-primary text-white"
                      : "btn-link text-white-50 text-decoration-none"
                  }`}
                  onClick={() => setActiveModule("products")}
                >
                  <FaBoxes className="me-2" /> Products
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`btn btn-sm w-100 text-start fw-semibold d-flex align-items-center py-2 px-3 ${
                    activeModule === "customers"
                      ? "btn-primary text-white"
                      : "btn-link text-white-50 text-decoration-none"
                  }`}
                  onClick={() => setActiveModule("customers")}
                >
                  <FaUsers className="me-2" /> Customers
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow-1 p-3 p-md-4">
        {activeModule === "dashboard" && (
          <Dashboard setActiveModule={setActiveModule} />
        )}

        {activeModule === "billing" && (
          <Billing
            onCompleteSale={handleCreditSale}
            customerList={customers}
            setCustomerList={setCustomers}
          />
        )}

        {activeModule === "billRecords" && <BillRecords />}

        {activeModule === "products" && <ProductsPlaceholder />}

        {activeModule === "customers" && (
          <CustomersPlaceholder customerList={customers} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-3 bg-white border-top text-muted small mt-auto">
        Pragyan ERP & POS Billing Terminal • IRD Compliant
      </footer>
    </div>
  );
}

export default App;
