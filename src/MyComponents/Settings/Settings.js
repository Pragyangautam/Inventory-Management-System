import React, { useState } from "react";
import {
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaCog,
  FaSearch,
} from "react-icons/fa";

function Settings({ customerList, setCustomerList }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Form State for Adding New Customer
  const [newCustomer, setNewCustomer] = useState({
    pan: "",
    name: "",
    location: "",
    dueAmount: 0,
  });

  // State for tracking which customer is currently being edited inline
  const [editingId, setEditingId] = useState(null);
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

  // 1. CREATE: Add New Customer
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.pan) {
      alert("Please fill out Customer Name and PAN/VAT Number!");
      return;
    }

    const createdCustomer = {
      id: Date.now(),
      pan: newCustomer.pan,
      name: newCustomer.name,
      location: newCustomer.location || "N/A",
      dueAmount: parseFloat(newCustomer.dueAmount) || 0,
    };

    setCustomerList([...customerList, createdCustomer]);
    setNewCustomer({ pan: "", name: "", location: "", dueAmount: 0 });
    alert("Customer added successfully!");
  };

  // 2. UPDATE: Start Editing Row
  const handleStartEdit = (customer) => {
    setEditingId(customer.id);
    setEditFormData({
      pan: customer.pan,
      name: customer.name,
      location: customer.location,
      dueAmount: customer.dueAmount,
    });
  };

  // 2. UPDATE: Save Edited Customer
  const handleSaveEdit = (id) => {
    const updatedList = customerList.map((cust) => {
      if (cust.id === id) {
        return {
          ...cust,
          pan: editFormData.pan,
          name: editFormData.name,
          location: editFormData.location,
          dueAmount: parseFloat(editFormData.dueAmount) || 0,
        };
      }
      return cust;
    });

    setCustomerList(updatedList);
    setEditingId(null);
  };

  // 3. DELETE: Remove Customer Record
  const handleDeleteCustomer = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setCustomerList(customerList.filter((cust) => cust.id !== id));
    }
  };

  // Filtered List based on Search Input
  const filteredCustomers = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pan.includes(searchTerm),
  );

  return (
    <div className="container py-2">
      <div className="d-flex align-items-center mb-4">
        <FaCog className="me-2 text-primary" size={28} />
        <h3 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
          System Settings & Customer CRUD Management
        </h3>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: CREATE CUSTOMER FORM */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4">
            <h5
              className="fw-bold mb-3 d-flex align-items-center"
              style={{ color: "#1e293b" }}
            >
              <FaUserPlus className="me-2 text-success" /> Add New Customer
            </h5>
            <form onSubmit={handleAddCustomer}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  PAN / VAT Number *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 605544332"
                  value={newCustomer.pan}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, pan: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Customer / Firm Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Acme Traders"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Location / City
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kathmandu"
                  value={newCustomer.location}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, location: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Opening Due Amount (NPR)
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0.00"
                  value={newCustomer.dueAmount}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      dueAmount: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold py-2"
                style={{ backgroundColor: "#1e293b", borderColor: "#1e293b" }}
              >
                Save Customer Record
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: READ, UPDATE & DELETE (CRUD TABLE) */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
              <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
                Customer Master Database ({customerList.length})
              </h5>

              {/* Search Control */}
              <div className="input-group" style={{ maxWidth: "250px" }}>
                <span className="input-group-text bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search PAN or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>PAN / VAT No</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Due Amount (NPR)</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        No customer records found.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) =>
                      editingId === cust.id ? (
                        /* INLINE EDIT MODE ROW */
                        <tr key={cust.id} className="table-warning">
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
                              title="Save Changes"
                            >
                              <FaSave />
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setEditingId(null)}
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </td>
                        </tr>
                      ) : (
                        /* STANDARD READ ROW */
                        <tr key={cust.id}>
                          <td>
                            <code>{cust.pan}</code>
                          </td>
                          <td className="fw-semibold">{cust.name}</td>
                          <td className="text-muted">{cust.location}</td>
                          <td className="fw-bold text-success">
                            {formatNPR(cust.dueAmount)}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleStartEdit(cust)}
                              title="Edit Customer"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteCustomer(cust.id, cust.name)
                              }
                              title="Delete Customer"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
