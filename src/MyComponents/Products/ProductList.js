import React, { useState, useEffect } from "react";
import {
  FaBoxes,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaFileInvoice,
} from "react-icons/fa";

function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Persistent Products from Browser LocalStorage
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("pragyan_products");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pragyan_products", JSON.stringify(products));
  }, [products]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    hsCode: "",
    particular: "",
    costPrice: "",
    sellingPrice: "",
    qty: "",
  });

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    hsCode: "",
    particular: "",
    costPrice: "",
    sellingPrice: "",
    qty: "",
  });

  const formatNPR = (amount) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.hsCode || !newProduct.particular) {
      alert("HS Code and Particulars/Article Name are required!");
      return;
    }

    const item = {
      id: Date.now(),
      hsCode: newProduct.hsCode,
      particular: newProduct.particular,
      costPrice: parseFloat(newProduct.costPrice) || 0,
      sellingPrice: parseFloat(newProduct.sellingPrice) || 0,
      qty: parseInt(newProduct.qty, 10) || 0,
    };

    setProducts([...products, item]);
    setNewProduct({
      hsCode: "",
      particular: "",
      costPrice: "",
      sellingPrice: "",
      qty: "",
    });
    setShowModal(false);
  };

  const handleStartEdit = (prod) => {
    setEditingId(prod.id);
    setEditFormData({
      hsCode: prod.hsCode,
      particular: prod.particular,
      costPrice: prod.costPrice,
      sellingPrice: prod.sellingPrice,
      qty: prod.qty,
    });
  };

  const handleSaveEdit = (id) => {
    const updated = products.map((prod) => {
      if (prod.id === id) {
        return {
          ...prod,
          hsCode: editFormData.hsCode,
          particular: editFormData.particular,
          costPrice: parseFloat(editFormData.costPrice) || 0,
          sellingPrice: parseFloat(editFormData.sellingPrice) || 0,
          qty: parseInt(editFormData.qty, 10) || 0,
        };
      }
      return prod;
    });

    setProducts(updated);
    setEditingId(null);
  };

  const handleDeleteProduct = (id, particular) => {
    if (window.confirm(`Are you sure you want to delete ${particular}?`)) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const totalStockValuation = products.reduce(
    (acc, p) => acc + p.costPrice * p.qty,
    0,
  );

  const filteredProducts = products.filter(
    (p) =>
      p.particular.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hsCode.includes(searchTerm),
  );

  return (
    <div className="container py-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
            <FaBoxes className="me-2 text-primary" /> Product Inventory Catalog
          </h3>
          <p className="text-muted small mb-0">
            IRD Nepal Compliant Standard Register (HS Code & Stock Valuation)
          </p>
        </div>
        <button
          className="btn btn-primary fw-semibold d-flex align-items-center"
          style={{ backgroundColor: "#1e293b", borderColor: "#1e293b" }}
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="me-2" /> Add New Item
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm p-3 bg-light">
            <span className="text-muted small fw-semibold">
              TOTAL UNIQUE ARTICLES
            </span>
            <h3 className="fw-bold text-dark mb-0">{products.length} Items</h3>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm p-3 bg-light">
            <span className="text-muted small fw-semibold">
              TOTAL INVENTORY STOCK QTY
            </span>
            <h3 className="fw-bold text-info mb-0">
              {products.reduce((sum, p) => sum + p.qty, 0)} Units
            </h3>
          </div>
        </div>
        <div className="col-md-12 col-lg-4">
          <div className="card border-0 shadow-sm p-3 bg-light">
            <span className="text-muted small fw-semibold">
              TOTAL STOCK VALUATION (AT COST)
            </span>
            <h3 className="fw-bold text-success mb-0">
              {formatNPR(totalStockValuation)}
            </h3>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
            IRD Registered Products
          </h5>

          <div className="input-group" style={{ maxWidth: "300px" }}>
            <span className="input-group-text bg-light border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search HS Code or Particulars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-dark">
              <tr>
                <th>HS CODE</th>
                <th>PARTICULAR / ARTICLE</th>
                <th className="text-end">COST PRICE (NPR)</th>
                <th className="text-end">SELLING PRICE (NPR)</th>
                <th className="text-center">QTY</th>
                <th className="text-end">AMOUNT (NPR)</th>
                <th className="text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5">
                    No products in store. Click <strong>"Add New Item"</strong>{" "}
                    above to register inventory.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) =>
                  editingId === p.id ? (
                    <tr key={`edit-${p.id}`} className="table-warning">
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editFormData.hsCode}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              hsCode: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editFormData.particular}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              particular: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm text-end"
                          value={editFormData.costPrice}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              costPrice: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm text-end"
                          value={editFormData.sellingPrice}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              sellingPrice: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          value={editFormData.qty}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              qty: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="text-end fw-bold">
                        {formatNPR(
                          (parseFloat(editFormData.costPrice) || 0) *
                            (parseInt(editFormData.qty, 10) || 0),
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleSaveEdit(p.id)}
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
                    <tr key={p.id}>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary border">
                          <FaFileInvoice className="me-1" />
                          {p.hsCode}
                        </span>
                      </td>
                      <td className="fw-semibold">{p.particular}</td>
                      <td className="text-end text-muted">
                        {formatNPR(p.costPrice)}
                      </td>
                      <td className="text-end fw-bold text-primary">
                        {formatNPR(p.sellingPrice)}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${p.qty < 5 ? "bg-danger" : "bg-success"}`}
                        >
                          {p.qty}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-dark">
                        {formatNPR(p.costPrice * p.qty)}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleStartEdit(p)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDeleteProduct(p.id, p.particular)
                          }
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

      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#1e293b", color: "#fff" }}
              >
                <h5 className="modal-title fw-bold">Add New Article</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddProduct}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      HS CODE *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 8471.30.00"
                      value={newProduct.hsCode}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, hsCode: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      PARTICULAR / ARTICLE NAME *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Wireless Mouse"
                      value={newProduct.particular}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          particular: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">
                        COST PRICE (NPR)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0.00"
                        value={newProduct.costPrice}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            costPrice: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">
                        SELLING PRICE (NPR)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0.00"
                        value={newProduct.sellingPrice}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            sellingPrice: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      QUANTITY (QTY)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="1"
                      value={newProduct.qty}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, qty: e.target.value })
                      }
                      required
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
                    Save Article
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

export default ProductList;
