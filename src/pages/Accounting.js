import { useEffect, useState } from "react";
import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";
import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "journal";

function Accounting() {
  const [entries, setEntries] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editing, setEditing] = useState(null);

  const [date, setDate] = useState("");

  const [voucher, setVoucher] = useState("");

  const [account, setAccount] = useState("");

  const [debit, setDebit] = useState("");

  const [credit, setCredit] = useState("");

  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setEntries(getData(STORAGE_KEY));
  };

  const clear = () => {
    setEditing(null);

    setDate("");

    setVoucher("");

    setAccount("");

    setDebit("");

    setCredit("");

    setRemarks("");
  };

  const save = () => {
    const obj = {
      date,

      voucher,

      account,

      debit: Number(debit),

      credit: Number(credit),

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

    setVoucher(row.voucher);

    setAccount(row.account);

    setDebit(row.debit);

    setCredit(row.credit);

    setRemarks(row.remarks);

    setShowModal(true);
  };

  const remove = (id) => {
    if (window.confirm("Delete Entry?")) {
      deleteData(STORAGE_KEY, id);

      load();
    }
  };

  const filtered = entries.filter(
    (x) =>
      x.account.toLowerCase().includes(search.toLowerCase()) ||
      x.voucher.toLowerCase().includes(search.toLowerCase()),
  );

  const totalDebit = filtered.reduce((t, x) => t + Number(x.debit || 0), 0);

  const totalCredit = filtered.reduce((t, x) => t + Number(x.credit || 0), 0);

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
        <h1>Journal Voucher</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            clear();
            setShowModal(true);
          }}
        >
          + Journal Entry
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search..." />

      <br />

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>

            <th>Voucher</th>

            <th>Account</th>

            <th>Debit</th>

            <th>Credit</th>

            <th>Remarks</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7">No Journal Entries</td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>

                <td>{item.voucher}</td>

                <td>{item.account}</td>

                <td>{item.debit}</td>

                <td>{item.credit}</td>

                <td>{item.remarks}</td>

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
            <th colSpan="3">TOTAL</th>

            <th>{totalDebit}</th>

            <th>{totalCredit}</th>

            <th colSpan="2"></th>
          </tr>
        </tfoot>
      </table>

      {showModal && (
        <FormModal
          title={editing ? "Edit Journal" : "New Journal"}
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
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Account Name"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />

          <input
            className="form-control"
            type="number"
            placeholder="Debit"
            value={debit}
            onChange={(e) => setDebit(e.target.value)}
          />

          <input
            className="form-control"
            type="number"
            placeholder="Credit"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
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

export default Accounting;
