import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "suppliers";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingSupplier, setEditingSupplier] = useState(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pan, setPan] = useState("");

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = () => {
    setSuppliers(getData(STORAGE_KEY));
  };

  const clearForm = () => {
    setName("");
    setCompany("");
    setPhone("");
    setEmail("");
    setAddress("");
    setPan("");

    setEditingSupplier(null);
  };

  const editSupplier = (supplier) => {
    setEditingSupplier(supplier);

    setName(supplier.name);
    setCompany(supplier.company);
    setPhone(supplier.phone);
    setEmail(supplier.email);
    setAddress(supplier.address);
    setPan(supplier.pan);

    setShowModal(true);
  };

  const saveSupplier = () => {
    if (!name.trim()) {
      alert("Supplier Name Required");

      return;
    }

    const supplier = {
      name,
      company,
      phone,
      email,
      address,
      pan,
    };

    if (editingSupplier) {
      updateData(STORAGE_KEY, {
        ...editingSupplier,

        ...supplier,
      });
    } else {
      addData(STORAGE_KEY, supplier);
    }

    loadSuppliers();

    clearForm();

    setShowModal(false);
  };

  const removeSupplier = (id) => {
    if (window.confirm("Delete Supplier?")) {
      deleteData(STORAGE_KEY, id);

      loadSuppliers();
    }
  };

  const filtered = suppliers.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.toLowerCase().includes(search.toLowerCase()),
  );

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
        <h1>Suppliers</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            clearForm();
            setShowModal(true);
          }}
        >
          + Add Supplier
        </button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Supplier..."
      />

      <br />

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>

            <th>Name</th>

            <th>Company</th>

            <th>Phone</th>

            <th>Email</th>

            <th>PAN</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7">No Suppliers Found</td>
            </tr>
          ) : (
            filtered.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.id}</td>

                <td>{supplier.name}</td>

                <td>{supplier.company}</td>

                <td>{supplier.phone}</td>

                <td>{supplier.email}</td>

                <td>{supplier.pan}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editSupplier(supplier)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeSupplier(supplier.id)}
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
          title={editingSupplier ? "Edit Supplier" : "Add Supplier"}
          onSave={saveSupplier}
          onClose={() => setShowModal(false)}
        >
          <input
            className="form-control"
            placeholder="Supplier Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            className="form-control"
            rows="3"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="PAN Number"
            value={pan}
            onChange={(e) => setPan(e.target.value)}
          />
        </FormModal>
      )}
    </div>
  );
}

export default Suppliers;
