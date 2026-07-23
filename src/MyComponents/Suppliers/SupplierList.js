import React, { useState } from "react";
import {
  FaTruck,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaSearch,
  FaCog,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

function PartiesLedger({ customerList, setCustomerList }) {
  // Tabs: 'suppliers', 'customers', or 'settings'
  const [activeTab, setActiveTab] = useState("suppliers");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Suppliers Data
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      pan: "600123456",
      name: "TechWholesale Pvt. Ltd.",
      location: "Kathmandu",
      dueAmount: 145000.0,
    },
    {
      id: 2,
      pan: "300987654",
      name: "Global Logistics Nepal",
      location: "Lalitpur",
      dueAmount: 0.0,
    },
    {
      id: 3,
      pan: "601122334",
      name: "Himalayan Hardware",
      location: "Pokhara",
      dueAmount: 82050.0,
    },
  ]);

  // Modals & Inline Edit State
  const [showModal, setShowModal] = useState(false);
  const [newParty, setNewParty] = useState({
    pan: "",
    name: "",
    location: "",
    dueAmount: 0,
    type: "customer",
  });

  // CRUD Edit State inside Settings tab
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null); // 'supplier' or 'customer'
  const [editFormData, setEditFormData] = useState({
    pan: "",
    name: "",
    location: "",
    dueAmount: 0,
  });

  // Helper for NPR Formatting
  const formatNPR = (amount) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  // Add Party (Supplier or Customer)
  const handleAddParty = (e) => {
    e.preventDefault();
    if (!newParty.name || !newParty.pan) {
      alert("Please fill out Name and PAN/VAT number!");
      return;
    }

    const newItem = {
      id: Date.now(),
      pan: newParty.pan,
      name: newParty.name,
      location: newParty.location || "N/A",
      dueAmount: parseFloat(newParty.dueAmount) || 0,
    };

    if (newParty.type === "supplier") {
      setSuppliers([...suppliers, newItem]);
    } else {
      setCustomerList([...customerList, newItem]);
    }

    setNewParty({
      pan: "",
      name: "",
      location: "",
      dueAmount: 0,
      type: "customer",
    });
    setShowModal(false);
  };

  // Start Inline Edit
  const handleStartEdit = (item, type) => {
    setEditingId(item.id);
    setEditingType(type);
    setEditFormData({
      pan: item.pan,
      name: item.name,
      location: item.location,
      dueAmount: item.dueAmount,
    });
  };

  // Save Inline Edit
  const handleSaveEdit = (id) => {
    if (editingType === "supplier") {
      setSuppliers(
        suppliers.map((s) =>
          s.id === id
            ? {
                ...s,
                ...editFormData,
                dueAmount: parseFloat(editFormData.dueAmount) || 0,
              }
            : s,
        ),
      );
    } else {
      setCustomerList(
        customerList.map((c) =>
          c.id === id
            ? {
                ...c,
                ...editFormData,
                dueAmount: parseFloat(editFormData.dueAmount) || 0,
              }
            : c,
        ),
      );
    }
    setEditingId(null);
  };

  // Delete Record
  const handleDelete = (id, name, type) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      if (type === "supplier") {
        setSuppliers(suppliers.filter((s) => s.id !== id));
      } else {
        setCustomerList(customerList.filter((c) => c.id !== id));
      }
    }
  };

  // Calculations
  const totalPayables = suppliers.reduce((sum, s) => sum + s.dueAmount, 0);
  const totalReceivables = customerList.reduce(
    (sum, c) => sum + c.dueAmount,
    0,
  );

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pan.includes(searchTerm),
  );

  const filteredCustomers = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pan.includes(searchTerm),
  );

  return (
    <div className="container py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
          Parties & Financial Ledger (NPR)
        </h3>
        <button
          className="btn btn-primary d-flex align-items-center"
          style={{ backgroundColor: "#1e293b", borderColor: "#1e293b" }}
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="me-2" /> Quick Add Party
        </button>
      </div>

      {/* LEDGER OVERVIEW CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div
            className="card shadow-sm border-0 p-3"
            style={{ borderLeft: "5px solid #ef4444" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Total Payables (To Suppliers)
                </span>
                <h2 className="fw-bold text-danger mb-0 mt-1">
                  {formatNPR(totalPayables)}
                </h2>
              </div>
              <div className="p-3 bg-danger-subtle text-danger rounded-circle">
                <FaArrowUp size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card shadow-sm border-0 p-3"
            style={{ borderLeft: "5px solid #10b981" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">
                  Total Receivables (From Customers)
                </span>
                <h2 className="fw-bold text-success mb-0 mt-1">
                  {formatNPR(totalReceivables)}
                </h2>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-circle">
                <FaArrowDown size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION TABS & SEARCH */}
      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="btn-group">
            <button
              className={`btn ${activeTab === "suppliers" ? "btn-primary" : "btn-outline-secondary"}`}
              style={
                activeTab === "suppliers"
                  ? { backgroundColor: "#1e293b", borderColor: "#1e293b" }
                  : {}
              }
              onClick={() => setActiveTab("suppliers")}
            >
              <FaTruck className="me-2" /> Suppliers ({suppliers.length})
            </button>
            <button
              className={`btn ${activeTab === "customers" ? "btn-primary" : "btn-outline-secondary"}`}
              style={
                activeTab === "customers"
                  ? { backgroundColor: "#1e293b", borderColor: "#1e293b" }
                  : {}
              }
              onClick={() => setActiveTab("customers")}
            >
              <FaUsers className="me-2" /> Customers ({customerList.length})
            </button>
            <button
              className={`btn ${activeTab === "settings" ? "btn-primary" : "btn-outline-secondary"}`}
              style={
                activeTab === "settings"
                  ? { backgroundColor: "#0ea5e9", borderColor: "#0ea5e9" }
                  : {}
              }
              onClick={() => setActiveTab("settings")}
            >
              <FaCog className="me-2" /> CRUD Settings
            </button>
          </div>

          <div className="input-group" style={{ maxWidth: "300px" }}>
            <span className="input-group-text bg-light border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search by Name or PAN/VAT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 1. SUPPLIERS VIEW */}
        {activeTab === "suppliers" && (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>PAN / VAT NO</th>
                  <th>NAME</th>
                  <th>LOCATION</th>
                  <th>DUE AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((sup) => (
                  <tr key={sup.id}>
                    <td>
                      <code>{sup.pan}</code>
                    </td>
                    <td className="fw-semibold">{sup.name}</td>
                    <td className="text-muted">{sup.location}</td>
                    <td className="fw-bold text-danger">
                      {formatNPR(sup.dueAmount)}
                    </td>
                    <td>
                      <span
                        className={`badge ${sup.dueAmount > 0 ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`}
                      >
                        {sup.dueAmount > 0 ? "Dues Owed" : "Cleared"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. CUSTOMERS VIEW */}
        {activeTab === "customers" && (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>PAN / VAT NO</th>
                  <th>NAME</th>
                  <th>LOCATION</th>
                  <th>DUE AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td>
                      <code>{cust.pan}</code>
                    </td>
                    <td className="fw-semibold">{cust.name}</td>
                    <td className="text-muted">{cust.location}</td>
                    <td className="fw-bold text-success">
                      {formatNPR(cust.dueAmount)}
                    </td>
                    <td>
                      <span
                        className={`badge ${cust.dueAmount > 0 ? "bg-warning-subtle text-warning" : "bg-success-subtle text-success"}`}
                      >
                        {cust.dueAmount > 0 ? "Pending Payment" : "Settled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. SETTINGS / CRUD MANAGEMENT VIEW */}
        {activeTab === "settings" && (
          <div>
            <h5 className="fw-bold mb-3 text-dark">
              Customer & Supplier Master Data Controls
            </h5>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Type</th>
                    <th>PAN / VAT No</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Due Amount (NPR)</th>
                    <th className="text-center">Manage Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Customers CRUD Rows */}
                  {filteredCustomers.map((cust) =>
                    editingId === cust.id && editingType === "customer" ? (
                      <tr key={`edit-${cust.id}`} className="table-warning">
                        <td>
                          <span className="badge bg-primary">Customer</span>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editFormData.pan}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                pan: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editFormData.name}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                name: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editFormData.location}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                location: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={editFormData.dueAmount}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                dueAmount: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => handleSaveEdit(cust.id)}
                          >
                            <FaSave />
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingId(null)}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={`cust-${cust.id}`}>
                        <td>
                          <span className="badge bg-primary-subtle text-primary">
                            Customer
                          </span>
                        </td>
                        <td>
                          <code>{cust.pan}</code>
                        </td>
                        <td className="fw-semibold">{cust.name}</td>
                        <td>{cust.location}</td>
                        <td className="fw-bold text-success">
                          {formatNPR(cust.dueAmount)}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleStartEdit(cust, "customer")}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(cust.id, cust.name, "customer")
                            }
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ),
                  )}

                  {/* Suppliers CRUD Rows */}
                  {filteredSuppliers.map((sup) =>
                    editingId === sup.id && editingType === "supplier" ? (
                      <tr key={`edit-${sup.id}`} className="table-warning">
                        <td>
                          <span className="badge bg-warning text-dark">
                            Supplier
                          </span>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editFormData.pan}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                pan: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editFormData.name}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                name: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={editFormData.location}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                location: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={editFormData.dueAmount}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                dueAmount: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => handleSaveEdit(sup.id)}
                          >
                            <FaSave />
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingId(null)}
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={`sup-${sup.id}`}>
                        <td>
                          <span className="badge bg-warning-subtle text-warning-emphasis">
                            Supplier
                          </span>
                        </td>
                        <td>
                          <code>{sup.pan}</code>
                        </td>
                        <td className="fw-semibold">{sup.name}</td>
                        <td>{sup.location}</td>
                        <td className="fw-bold text-danger">
                          {formatNPR(sup.dueAmount)}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleStartEdit(sup, "supplier")}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(sup.id, sup.name, "supplier")
                            }
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* QUICK ADD MODAL */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add New Party</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddParty}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Party Type</label>
                    <select
                      className="form-select"
                      value={newParty.type}
                      onChange={(e) =>
                        setNewParty({ ...newParty, type: e.target.value })
                      }
                    >
                      <option value="customer">Customer Record</option>
                      <option value="supplier">Supplier Record</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">PAN / VAT Number</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. 600123456"
                      value={newParty.pan}
                      onChange={(e) =>
                        setNewParty({ ...newParty, pan: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Enter party name"
                      value={newParty.name}
                      onChange={(e) =>
                        setNewParty({ ...newParty, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location / Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Kathmandu"
                      value={newParty.location}
                      onChange={(e) =>
                        setNewParty({ ...newParty, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Opening Due Amount (NPR)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0.00"
                      value={newParty.dueAmount}
                      onChange={(e) =>
                        setNewParty({ ...newParty, dueAmount: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ backgroundColor: "#1e293b" }}
                  >
                    Save Party
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

export default PartiesLedger;
