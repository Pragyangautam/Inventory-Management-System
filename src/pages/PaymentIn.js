import { useEffect, useState } from "react";
import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";
import { addCashTransaction } from "../services/finance/cashBookService";
const STORAGE_KEY = "payment_in";

function PaymentIn() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [date, setDate] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [method, setMethod] = useState("Cash");
  const [bank, setBank] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setPayments(getData(STORAGE_KEY));
  };

  const clear = () => {
    setEditing(null);

    setDate("");
    setReceiptNo("");
    setCustomer("");
    setInvoiceNo("");
    setMethod("Cash");
    setBank("");
    setReference("");
    setAmount("");
    setRemarks("");
  };

  const save = () => {
    const obj = {
      date,
      receiptNo,
      customer,
      invoiceNo,
      method,
      bank,
      reference,
      amount: Number(amount),
      remarks,
    };

    if (editing) {
      updateData(STORAGE_KEY, {
        ...editing,

        ...obj,
      });
    } else {
      addData(STORAGE_KEY, obj);

      addCashTransaction({
        date,
        type: "IN",
        particulars: "Customer Payment",
        amount,
        reference: receiptNo,
      });
    }
    cashIn(
      date,

      "Customer Payment",

      amount,

      receiptNo,
    );
    load();

    clear();

    setShowModal(false);
  };

  const edit = (row) => {
    setEditing(row);

    setDate(row.date);
    setReceiptNo(row.receiptNo);
    setCustomer(row.customer);
    setInvoiceNo(row.invoiceNo);
    setMethod(row.method);
    setBank(row.bank);
    setReference(row.reference);
    setAmount(row.amount);
    setRemarks(row.remarks);

    setShowModal(true);
  };

  const remove = (id) => {
    if (window.confirm("Delete Payment?")) {
      deleteData(STORAGE_KEY, id);

      load();
    }
  };

  const filtered = payments.filter(
    (x) =>
      x.customer.toLowerCase().includes(search.toLowerCase()) ||
      x.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
      x.invoiceNo.toLowerCase().includes(search.toLowerCase()),
  );

  const totalReceived = filtered.reduce((t, x) => t + Number(x.amount || 0), 0);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Payment In</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            clear();
            setShowModal(true);
          }}
        >
          + Receive Payment
        </button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Payment..."
      />

      <br />

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Receipt</th>
            <th>Customer</th>
            <th>Invoice</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="8">No Payment Received</td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>

                <td>{item.receiptNo}</td>

                <td>{item.customer}</td>

                <td>{item.invoiceNo}</td>

                <td>{item.method}</td>

                <td>{item.amount}</td>

                <td>{item.reference}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => edit(item)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => remove(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>

        <tfoot>
          <tr>
            <th colSpan="5">Total Received</th>

            <th>{totalReceived.toFixed(2)}</th>

            <th colSpan="2"></th>
          </tr>
        </tfoot>
      </table>

      {showModal && (
        <FormModal
          title={editing ? "Edit Payment" : "Receive Payment"}
          onSave={save}
          onClose={() => setShowModal(false)}
        >
          <input
            className="form-control"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Receipt No"
            value={receiptNo}
            onChange={(e) => setReceiptNo(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Customer Name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Invoice No"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
          />

          <select
            className="form-control"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>Cheque</option>
            <option>QR Payment</option>
          </select>

          <input
            className="form-control"
            placeholder="Bank (Optional)"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Reference / Cheque No"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <input
            className="form-control"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <textarea
            className="form-control"
            rows="3"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </FormModal>
      )}
    </div>
  );
}

export default PaymentIn;
