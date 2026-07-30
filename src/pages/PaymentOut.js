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

const STORAGE_KEY = "payment_out";

function PaymentOut() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [date, setDate] = useState("");
  const [voucherNo, setVoucherNo] = useState("");
  const [supplier, setSupplier] = useState("");
  const [purchaseInvoice, setPurchaseInvoice] = useState("");
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
    setVoucherNo("");
    setSupplier("");
    setPurchaseInvoice("");
    setMethod("Cash");
    setBank("");
    setReference("");
    setAmount("");
    setRemarks("");
  };

  const save = () => {
    const obj = {
      date,
      voucherNo,
      supplier,
      purchaseInvoice,
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
        type: "OUT",
        particulars: "Supplier Payment",
        amount,
        reference: voucherNo,
      });
    }
    load();

    clear();

    setShowModal(false);
  };

  const edit = (row) => {
    setEditing(row);

    setDate(row.date);
    setVoucherNo(row.voucherNo);
    setSupplier(row.supplier);
    setPurchaseInvoice(row.purchaseInvoice);
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
      x.supplier.toLowerCase().includes(search.toLowerCase()) ||
      x.voucherNo.toLowerCase().includes(search.toLowerCase()) ||
      x.purchaseInvoice.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPaid = filtered.reduce((t, x) => t + Number(x.amount || 0), 0);

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
        <h1>Payment Out</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            clear();
            setShowModal(true);
          }}
        >
          + Make Payment
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
            <th>Voucher</th>
            <th>Supplier</th>
            <th>Purchase Invoice</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="8">No Payment Records</td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>

                <td>{item.voucherNo}</td>

                <td>{item.supplier}</td>

                <td>{item.purchaseInvoice}</td>

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
            <th colSpan="5">Total Paid</th>

            <th>{totalPaid.toFixed(2)}</th>

            <th colSpan="2"></th>
          </tr>
        </tfoot>
      </table>

      {showModal && (
        <FormModal
          title={editing ? "Edit Payment" : "Supplier Payment"}
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
            placeholder="Voucher No"
            value={voucherNo}
            onChange={(e) => setVoucherNo(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Purchase Invoice"
            value={purchaseInvoice}
            onChange={(e) => setPurchaseInvoice(e.target.value)}
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
            placeholder="Bank"
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

export default PaymentOut;
