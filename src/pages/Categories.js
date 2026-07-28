import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  deleteData,
  updateData,
} from "../services/storage/storageService";

const STORAGE_KEY = "categories";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(getData(STORAGE_KEY));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditing(false);
    setSelectedId(null);
    setShowModal(false);
  };

  const saveCategory = () => {
    if (!name.trim()) {
      alert("Category Name is required.");
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

    loadCategories();
    resetForm();
  };

  const editCategory = (item) => {
    setEditing(true);
    setSelectedId(item.id);

    setName(item.name);
    setDescription(item.description);

    setShowModal(true);
  };

  const removeCategory = (id) => {
    if (window.confirm("Delete this category?")) {
      deleteData(STORAGE_KEY, id);
      loadCategories();
    }
  };

  const filtered = categories.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Categories</h1>

      <br />

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Add Category
      </button>

      <br />
      <br />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Category..."
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Description</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="4">No Categories Found</td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>{item.name}</td>

                <td>{item.description}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editCategory(item)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCategory(item.id)}
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
          title={editing ? "Edit Category" : "Add Category"}
          onSave={saveCategory}
          onClose={resetForm}
          saveText={editing ? "Update" : "Save"}
        >
          <input
            className="form-control"
            placeholder="Category Name"
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

export default Categories;
