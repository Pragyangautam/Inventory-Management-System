import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "payments";

function Payments() {
  const [payments, setPayments] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editing, setEditing] = useState(null);

  const [date, setDate] = useState("");

  const [party, setParty] = useState("");

  const [type, setType] = useState("Receive");

  const [method, setMethod] = useState("Cash");

  const [amount, setAmount] = useState("");

  const [reference, setReference] = useState("");

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

    setParty("");

    setType("Receive");

    setMethod("Cash");

    setAmount("");

    setReference("");

    setRemarks("");
  };

  const save = () => {
    const obj = {
      date,

      party,

      type,

      method,

      amount: Number(amount),

      reference,

      remarks,
    };

    if (editing) {
      updateData(STORAGE_KEY, {
        ...editing,

        ...obj,
      });
    } else {
      addData(STORAGE_KEY, obj);
    }

    load();

    clear();

    setShowModal(false);
  };

  const edit = (row) => {
    setEditing(row);

    setDate(row.date);

    setParty(row.party);

    setType(row.type);

    setMethod(row.method);

    setAmount(row.amount);

    setReference(row.reference);

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
      x.party.toLowerCase().includes(search.toLowerCase()) ||
      x.reference.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>Payments</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            clear();
            setShowModal(true);
          }}
        >
          + Payment
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search..." />

      <br />

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>

            <th>Party</th>

            <th>Type</th>

            <th>Method</th>

            <th>Amount</th>

            <th>Reference</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7">No Payment</td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>

                <td>{item.party}</td>

                <td>{item.type}</td>

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
      </table>

      {showModal && (
        <FormModal
          title={editing ? "Edit Payment" : "New Payment"}
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
            placeholder="Customer / Supplier"
            value={party}
            onChange={(e) => setParty(e.target.value)}
          />

          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Receive</option>
            <option>Pay</option>
          </select>

          <select
            className="form-control"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option>Cash</option>
            <option>Bank</option>
            <option>QR</option>
            <option>Cheque</option>
          </select>

          <input
            className="form-control"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
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

export default Payments;
