import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "warehouses";

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = () => {
    setWarehouses(getData(STORAGE_KEY));
  };

  const resetForm = () => {
    setName("");
    setCode("");
    setAddress("");
    setContactPerson("");
    setPhone("");
    setStatus("Active");
    setEditing(false);
    setSelectedId(null);
    setShowModal(false);
  };

  const saveWarehouse = () => {
    if (!name.trim()) {
      alert("Warehouse Name is required");
      return;
    }

    const warehouse = {
      id: selectedId,
      name,
      code,
      address,
      contactPerson,
      phone,
      status,
    };

    if (editing) {
      updateData(STORAGE_KEY, warehouse);
    } else {
      delete warehouse.id;
      addData(STORAGE_KEY, warehouse);
    }

    loadWarehouses();
    resetForm();
  };

  const editWarehouse = (item) => {
    setEditing(true);
    setSelectedId(item.id);

    setName(item.name);
    setCode(item.code);
    setAddress(item.address);
    setContactPerson(item.contactPerson);
    setPhone(item.phone);
    setStatus(item.status);

    setShowModal(true);
  };

  const removeWarehouse = (id) => {
    if (window.confirm("Delete this warehouse?")) {
      deleteData(STORAGE_KEY, id);
      loadWarehouses();
    }
  };

  const filtered = warehouses.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Warehouses</h1>

      <br />

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Add Warehouse
      </button>

      <br />
      <br />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Warehouse..."
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>Code</th>
            <th>Contact</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7">No Warehouse Found</td>
            </tr>
          ) : (
            filtered.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.code}</td>
                <td>{item.contactPerson}</td>
                <td>{item.phone}</td>
                <td>{item.status}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editWarehouse(item)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeWarehouse(item.id)}
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
          title={editing ? "Edit Warehouse" : "Add Warehouse"}
          onSave={saveWarehouse}
          onClose={resetForm}
          saveText={editing ? "Update" : "Save"}
        >
          <input
            className="form-control"
            placeholder="Warehouse Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Warehouse Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Contact Person"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

export default Warehouses;
