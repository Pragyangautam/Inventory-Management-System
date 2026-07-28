import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "brands";

function Brands() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = () => {
    setBrands(getData(STORAGE_KEY));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditing(false);
    setSelectedId(null);
    setShowModal(false);
  };

  const saveBrand = () => {
    if (!name.trim()) {
      alert("Brand Name is required.");
      return;
    }

    if (editing) {
      updateData(STORAGE_KEY, {
        id: selectedId,
        name,
        description,
      });
    } else {
      addData(STORAGE_KEY, {
        name,
        description,
      });
    }

    loadBrands();
    resetForm();
  };

  const editBrand = (item) => {
    setEditing(true);
    setSelectedId(item.id);
    setName(item.name);
    setDescription(item.description);
    setShowModal(true);
  };

  const removeBrand = (id) => {
    if (window.confirm("Delete this brand?")) {
      deleteData(STORAGE_KEY, id);
      loadBrands();
    }
  };

  const filtered = brands.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Brands</h1>

      <br />

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Add Brand
      </button>

      <br />
      <br />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Brand..."
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Brand</th>
            <th>Description</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="4">No Brands Found</td>
            </tr>
          ) : (
            filtered.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editBrand(item)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeBrand(item.id)}
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
          title={editing ? "Edit Brand" : "Add Brand"}
          onSave={saveBrand}
          onClose={resetForm}
          saveText={editing ? "Update" : "Save"}
        >
          <input
            className="form-control"
            placeholder="Brand Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="form-control"
            placeholder="Description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormModal>
      )}
    </div>
  );
}

export default Brands;
