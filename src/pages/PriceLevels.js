import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "priceLevels";

function PriceLevels() {
  const [priceLevels, setPriceLevels] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    loadPriceLevels();
  }, []);

  const loadPriceLevels = () => {
    setPriceLevels(getData(STORAGE_KEY));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDiscount("");
    setStatus("Active");

    setEditing(false);
    setSelectedId(null);
    setShowModal(false);
  };

  const savePriceLevel = () => {
    if (!name.trim()) {
      alert("Price Level Name is required.");
      return;
    }

    const item = {
      id: selectedId,
      name,
      description,
      discount,
      status,
    };

    if (editing) {
      updateData(STORAGE_KEY, item);
    } else {
      delete item.id;
      addData(STORAGE_KEY, item);
    }

    loadPriceLevels();
    resetForm();
  };

  const editPriceLevel = (item) => {
    setEditing(true);

    setSelectedId(item.id);
    setName(item.name);
    setDescription(item.description);
    setDiscount(item.discount);
    setStatus(item.status);

    setShowModal(true);
  };

  const removePriceLevel = (id) => {
    if (window.confirm("Delete this Price Level?")) {
      deleteData(STORAGE_KEY, id);
      loadPriceLevels();
    }
  };

  const filtered = priceLevels.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Price Levels</h1>

      <br />

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Add Price Level
      </button>

      <br />
      <br />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Price Level..."
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>Description</th>
            <th>Default Discount (%)</th>
            <th>Status</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6">No Price Levels Found</td>
            </tr>
          ) : (
            filtered.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.discount}%</td>
                <td>{item.status}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editPriceLevel(item)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removePriceLevel(item.id)}
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
          title={editing ? "Edit Price Level" : "Add Price Level"}
          onSave={savePriceLevel}
          onClose={resetForm}
          saveText={editing ? "Update" : "Save"}
        >
          <input
            className="form-control"
            placeholder="Price Level Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="form-control"
            rows="3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="form-control"
            type="number"
            placeholder="Default Discount (%)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
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

export default PriceLevels;
