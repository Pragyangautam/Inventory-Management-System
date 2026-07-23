import React, { useState } from "react";
import {
  FaShoppingCart,
  FaPlus,
  FaTrash,
  FaPrint,
  FaCheckCircle,
  FaUserCheck,
  FaReceipt,
  FaSearch,
} from "react-icons/fa";

function Billing({ onCompleteSale, customerList = [], setCustomerList }) {
  // Load products from LocalStorage
  const [productCatalog, setProductCatalog] = useState(() => {
    const saved = localStorage.getItem("pragyan_products");
    return saved ? JSON.parse(saved) : [];
  });

  // Article Search Input State
  const [articleSearchQuery, setArticleSearchQuery] = useState("");

  // Customer State
  const [customerInfo, setCustomerInfo] = useState({
    pan: "",
    name: "",
    paymentType: "Cash",
  });

  // Invoice Items Table State
  const [items, setItems] = useState([]);

  // Overall Bill Trade Discount State
  const [tradeDiscountType, setTradeDiscountType] = useState("flat"); // 'flat' or 'percent'
  const [tradeDiscountValue, setTradeDiscountValue] = useState(0);

  // NPR Formatter
  const formatNPR = (amount) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  // Fetch Customer Details by Searching Name
  const handleNameChange = (nameVal) => {
    const matchedCustomer = customerList.find(
      (c) => c.name.toLowerCase() === nameVal.toLowerCase(),
    );
    if (matchedCustomer) {
      setCustomerInfo({
        ...customerInfo,
        name: nameVal,
        pan: matchedCustomer.pan || "",
      });
    } else {
      setCustomerInfo({ ...customerInfo, name: nameVal });
    }
  };

  // Fetch Customer Details by PAN
  const handlePanChange = (panVal) => {
    const matchedCustomer = customerList.find((c) => c.pan === panVal);
    if (matchedCustomer) {
      setCustomerInfo({
        ...customerInfo,
        pan: panVal,
        name: matchedCustomer.name,
      });
    } else {
      setCustomerInfo({ ...customerInfo, pan: panVal });
    }
  };

  // Add Product to Table via Article Name Search
  const handleAddProductBySearch = (queryVal) => {
    setArticleSearchQuery(queryVal);

    const prod = productCatalog.find(
      (p) =>
        p.particular.toLowerCase() === queryVal.trim().toLowerCase() ||
        `${p.particular} (${p.hsCode})`.toLowerCase() ===
          queryVal.trim().toLowerCase(),
    );

    if (prod) {
      if (prod.qty <= 0) {
        alert(`Warning: ${prod.particular} is out of stock!`);
        return;
      }

      const existingIdx = items.findIndex((i) => i.id === prod.id);

      if (existingIdx !== -1) {
        const updated = [...items];
        updated[existingIdx].qty += 1;
        setItems(updated);
      } else {
        setItems([
          ...items,
          {
            id: prod.id,
            hsCode: prod.hsCode,
            particular: prod.particular,
            price: prod.sellingPrice,
            qty: 1,
            discountType: "flat",
            discountVal: 0,
          },
        ]);
      }

      setArticleSearchQuery("");
    }
  };

  const handleManualAdd = () => {
    if (!articleSearchQuery) return;
    handleAddProductBySearch(articleSearchQuery);
  };

  // Remove Item Row
  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Handle Input Changes (editable rate & discount)
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    if (
      field === "particular" ||
      field === "hsCode" ||
      field === "discountType"
    ) {
      updated[index][field] = value;
    } else {
      updated[index][field] = parseFloat(value) || 0;
    }
    setItems(updated);
  };

  // Calculate Row Total
  const calculateRowTotal = (item) => {
    const gross = item.price * item.qty;
    let disc = 0;
    if (item.discountType === "percent") {
      disc = (gross * item.discountVal) / 100;
    } else {
      disc = item.discountVal;
    }
    return Math.max(0, gross - disc);
  };

  // Overall Billing Calculations
  const grossSubtotal = items.reduce(
    (sum, item) => sum + calculateRowTotal(item),
    0,
  );

  let overallTradeDiscount = 0;
  if (tradeDiscountType === "percent") {
    overallTradeDiscount = (grossSubtotal * tradeDiscountValue) / 100;
  } else {
    overallTradeDiscount = tradeDiscountValue;
  }
  overallTradeDiscount = Math.min(
    grossSubtotal,
    parseFloat(overallTradeDiscount) || 0,
  );

  const taxableAmount = Math.max(0, grossSubtotal - overallTradeDiscount);
  const vatAmount = taxableAmount * 0.13; // 13% IRD VAT Standard
  const grandTotal = taxableAmount + vatAmount;

  // Checkout Handler
  const handleCheckout = (e) => {
    e.preventDefault();
    if (!customerInfo.name) {
      alert("Please enter or select a Customer Name!");
      return;
    }
    if (items.length === 0) {
      alert("Invoice must have at least one product item!");
      return;
    }

    // Auto-create Customer if not found
    const existingCustomer = customerList.find(
      (c) => c.name.toLowerCase() === customerInfo.name.trim().toLowerCase(),
    );

    if (!existingCustomer && setCustomerList) {
      const newCustomerRecord = {
        id: Date.now(),
        pan: customerInfo.pan || "N/A",
        name: customerInfo.name.trim(),
        location: "Walk-In",
        dueAmount: customerInfo.paymentType === "Credit" ? grandTotal : 0,
      };

      setCustomerList((prevCustomers) => [...prevCustomers, newCustomerRecord]);
    } else if (
      existingCustomer &&
      customerInfo.paymentType === "Credit" &&
      onCompleteSale
    ) {
      onCompleteSale({
        pan: customerInfo.pan,
        name: customerInfo.name,
        dueAmount: grandTotal,
      });
    }

    // Deduct Stock in LocalStorage
    const updatedCatalog = productCatalog.map((prod) => {
      const soldItem = items.find((i) => i.id === prod.id);
      if (soldItem) {
        return { ...prod, qty: Math.max(0, prod.qty - soldItem.qty) };
      }
      return prod;
    });

    localStorage.setItem("pragyan_products", JSON.stringify(updatedCatalog));
    setProductCatalog(updatedCatalog);

    // Save Issued Bill to Sales Register (With Full Item Array for Printing)
    const newIssuedBill = {
      id: Date.now(),
      billNo: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split("T")[0],
      customerName: customerInfo.name,
      pan: customerInfo.pan,
      paymentType: customerInfo.paymentType,
      items: items, // Saved for re-printing invoice breakdown
      taxableAmount: taxableAmount,
      vatAmount: vatAmount,
      grandTotal: grandTotal,
    };

    const savedBills = JSON.parse(
      localStorage.getItem("pragyan_issued_bills") || "[]",
    );
    localStorage.setItem(
      "pragyan_issued_bills",
      JSON.stringify([newIssuedBill, ...savedBills]),
    );

    alert(
      `Tax Invoice Issued!\nCustomer: ${customerInfo.name}\nTotal Payable: ${formatNPR(grandTotal)}`,
    );

    // Reset Form
    setCustomerInfo({ pan: "", name: "", paymentType: "Cash" });
    setItems([]);
    setTradeDiscountValue(0);
  };

  return (
    <div className="container py-3">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3
          className="fw-bold mb-0 d-flex align-items-center"
          style={{ color: "#0f172a" }}
        >
          <FaShoppingCart className="me-2 text-primary" /> POS Billing Terminal
        </h3>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm shadow-sm bg-white"
          onClick={() => window.print()}
        >
          <FaPrint className="me-1" /> Print Bill
        </button>
      </div>

      <p className="text-muted small mb-4">
        IRD Compliant Tax Invoice Register (13% VAT Standard)
      </p>

      <form onSubmit={handleCheckout}>
        <div className="row g-4">
          {/* LEFT COLUMN: CUSTOMER & PARTICULARS */}
          <div className="col-lg-8">
            {/* Customer Details Box */}
            <div className="card shadow-sm border-0 p-4 mb-4 rounded-3 bg-white">
              <h5 className="fw-bold mb-3 d-flex align-items-center text-dark">
                <FaUserCheck className="me-2 text-primary" /> Customer / Firm
                Details
              </h5>
              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label small fw-semibold">
                    Customer Name (Type or Select) *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    list="customerOptions"
                    placeholder="Search or enter new name..."
                    value={customerInfo.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                  <datalist id="customerOptions">
                    {customerList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.pan ? `PAN: ${c.pan}` : "No PAN"}
                      </option>
                    ))}
                  </datalist>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold">
                    PAN / VAT Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 605544332"
                    value={customerInfo.pan}
                    onChange={(e) => handlePanChange(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">
                    Payment Method
                  </label>
                  <select
                    className="form-select fw-semibold"
                    value={customerInfo.paymentType}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        paymentType: e.target.value,
                      })
                    }
                  >
                    <option value="Cash">Cash Sale</option>
                    <option value="Credit">Credit Sale (Ledger)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Particulars Table */}
            <div className="card shadow-sm border-0 p-4 rounded-3 bg-white">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
                <h5 className="fw-bold mb-0 text-dark">Invoice Particulars</h5>

                {/* SEARCHABLE ARTICLE FIELD */}
                <div
                  className="input-group input-group-sm"
                  style={{ maxWidth: "340px" }}
                >
                  <input
                    type="text"
                    className="form-control"
                    list="articleSearchCatalog"
                    placeholder="Search article or HS Code..."
                    value={articleSearchQuery}
                    onChange={(e) => handleAddProductBySearch(e.target.value)}
                  />
                  <datalist id="articleSearchCatalog">
                    {productCatalog.map((prod) => (
                      <option
                        key={prod.id}
                        value={`${prod.particular} (${prod.hsCode})`}
                      >
                        Stock: {prod.qty} | Price: NPR {prod.sellingPrice}
                      </option>
                    ))}
                  </datalist>
                  <button
                    type="button"
                    className="btn btn-dark fw-bold px-3"
                    onClick={handleManualAdd}
                  >
                    <FaPlus className="me-1" /> Add
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle border-top">
                  <thead className="table-light text-muted small text-uppercase">
                    <tr>
                      <th style={{ width: "15%" }}>HS CODE</th>
                      <th style={{ width: "30%" }}>PARTICULAR</th>
                      <th style={{ width: "15%" }}>RATE (NPR)</th>
                      <th style={{ width: "10%" }}>QTY</th>
                      <th style={{ width: "18%" }}>DISCOUNT</th>
                      <th style={{ width: "12%" }} className="text-end">
                        TOTAL
                      </th>
                      <th style={{ width: "5%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center text-muted py-4 small"
                        >
                          No items added. Pick a product from the dropdown
                          above.
                        </td>
                      </tr>
                    ) : (
                      items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={item.hsCode}
                              onChange={(e) =>
                                handleItemChange(idx, "hsCode", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={item.particular}
                              onChange={(e) =>
                                handleItemChange(
                                  idx,
                                  "particular",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm text-end fw-bold text-primary"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(idx, "price", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm text-center"
                              value={item.qty}
                              onChange={(e) =>
                                handleItemChange(idx, "qty", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <div className="input-group input-group-sm">
                              <input
                                type="number"
                                className="form-control text-center px-1"
                                value={item.discountVal}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "discountVal",
                                    e.target.value,
                                  )
                                }
                              />
                              <select
                                className="form-select px-1 fw-bold bg-light"
                                style={{ maxWidth: "60px" }}
                                value={item.discountType}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "discountType",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="flat">Rs</option>
                                <option value="percent">%</option>
                              </select>
                            </div>
                          </td>
                          <td className="text-end fw-bold">
                            {formatNPR(calculateRowTotal(item))}
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger border-0"
                              onClick={() => handleRemoveItem(idx)}
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

          {/* RIGHT COLUMN: TAX & BILL SUMMARY PANEL */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 rounded-3 bg-white h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center text-dark">
                <FaReceipt className="me-2 text-success" /> Tax & Bill Summary
              </h5>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Item Subtotal:</span>
                <span className="fw-semibold">{formatNPR(grossSubtotal)}</span>
              </div>

              {/* Bill Level Trade Discount */}
              <div className="py-2 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small fw-semibold">
                    Bill Trade Discount:
                  </span>
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      className={`btn ${tradeDiscountType === "flat" ? "btn-secondary" : "btn-outline-secondary"}`}
                      onClick={() => setTradeDiscountType("flat")}
                    >
                      NPR
                    </button>
                    <button
                      type="button"
                      className={`btn ${tradeDiscountType === "percent" ? "btn-secondary" : "btn-outline-secondary"}`}
                      onClick={() => setTradeDiscountType("percent")}
                    >
                      %
                    </button>
                  </div>
                </div>
                <div className="input-group input-group-sm mt-1">
                  <span className="input-group-text bg-white">
                    {tradeDiscountType === "flat" ? "NPR" : "%"}
                  </span>
                  <input
                    type="number"
                    className="form-control text-end fw-semibold"
                    value={tradeDiscountValue}
                    onChange={(e) =>
                      setTradeDiscountValue(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Taxable Base Amount:</span>
                <span className="fw-bold text-dark">
                  {formatNPR(taxableAmount)}
                </span>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">IRD VAT Rate:</span>
                <span className="badge bg-secondary">13.00%</span>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom text-danger">
                <span>VAT Amount (13%):</span>
                <span className="fw-semibold">{formatNPR(vatAmount)}</span>
              </div>

              <div className="d-flex justify-content-between py-3 my-2 border-top border-bottom border-2">
                <span className="h6 fw-bold mb-0">Grand Total:</span>
                <span className="h5 fw-bold text-success mb-0">
                  {formatNPR(grandTotal)}
                </span>
              </div>

              {customerInfo.paymentType === "Credit" && (
                <div className="alert alert-warning small py-2 mb-3">
                  ⚠️ Ledger Posting: Charges to{" "}
                  <strong>{customerInfo.name || "Customer"}</strong>.
                </div>
              )}

              <button
                type="submit"
                className="btn btn-success btn-lg w-100 fw-bold py-3 mt-auto shadow-sm rounded-3 d-flex align-items-center justify-content-center"
              >
                <FaCheckCircle className="me-2" /> Issue Tax Invoice
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Billing;
