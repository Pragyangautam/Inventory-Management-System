import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "branches";

function Branches() {
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = () => {
    setBranches(getData(STORAGE_KEY));
  };

  const resetForm = () => {
    setName("");
    setCode("");
    setManager("");
    setPhone("");
    setAddress("");
    setStatus("Active");

    setEditing(false);
    setSelectedId(null);
    setShowModal(false);
  };

  const saveBranch = () => {
    if (!name.trim()) {
      alert("Branch Name is required.");
      return;
    }

    const branch = {
      id: selectedId,
      name,
      code,
      manager,
      phone,
      address,
      status,
    };

    if (editing) {
      updateData(STORAGE_KEY, branch);
    } else {
      delete branch.id;
      addData(STORAGE_KEY, branch);
    }

    loadBranches();
    resetForm();
  };

  const editBranch = (item) => {
    setEditing(true);

    setSelectedId(item.id);
    setName(item.name);
    setCode(item.code);
    setManager(item.manager);
    setPhone(item.phone);
    setAddress(item.address);
    setStatus(item.status);

    setShowModal(true);
  };

  const removeBranch = (id) => {
    if (window.confirm("Delete this branch?")) {
      deleteData(STORAGE_KEY, id);
      loadBranches();
    }
  };

  const filtered = branches.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Branches</h1>

      <br />

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Add Branch
      </button>

      <br />
      <br />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Branch..."
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Branch</th>
            <th>Code</th>
            <th>Manager</th>
            <th>Phone</th>
            <th>Status</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7">No Branches Found</td>
            </tr>
          ) : (
            filtered.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.name}</td>

                <td>{item.code}</td>

                <td>{item.manager}</td>

                <td>{item.phone}</td>

                <td>{item.status}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editBranch(item)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBranch(item.id)}
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
          title={editing ? "Edit Branch" : "Add Branch"}
          onSave={saveBranch}
          onClose={resetForm}
          saveText={editing ? "Update" : "Save"}
        >
          <input
            className="form-control"
            placeholder="Branch Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Branch Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Manager"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            className="form-control"
            rows="3"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </FormModal>
      )}
    </div>
  );
}

export default Branches;
