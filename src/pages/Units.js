import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "units";

function Units() {
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");

  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = () => {
    setUnits(getData(STORAGE_KEY));
  };

  const resetForm = () => {
    setName("");
    setShortName("");
    setEditing(false);
    setSelectedId(null);
    setShowModal(false);
  };

  const saveUnit = () => {
    if (!name.trim()) {
      alert("Unit Name is required.");
      return;
    }

    if (editing) {
      updateData(STORAGE_KEY, {
        id: selectedId,
        name,
        shortName,
      });
    } else {
      addData(STORAGE_KEY, {
        name,
        shortName,
      });
    }

    loadUnits();
    resetForm();
  };

  const editUnit = (item) => {
    setEditing(true);
    setSelectedId(item.id);
    setName(item.name);
    setShortName(item.shortName);
    setShowModal(true);
  };

  const removeUnit = (id) => {
    if (window.confirm("Delete this unit?")) {
      deleteData(STORAGE_KEY, id);
      loadUnits();
    }
  };

  const filtered = units.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Units</h1>

      <br />

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Add Unit
      </button>

      <br />
      <br />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Unit..."
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Unit Name</th>
            <th>Short Name</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="4">No Units Found</td>
            </tr>
          ) : (
            filtered.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.shortName}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editUnit(item)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeUnit(item.id)}
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
          title={editing ? "Edit Unit" : "Add Unit"}
          onSave={saveUnit}
          onClose={resetForm}
          saveText={editing ? "Update" : "Save"}
        >
          <input
            className="form-control"
            placeholder="Unit Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Short Name (PCS, KG, BOX...)"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
          />
        </FormModal>
      )}
    </div>
  );
}

export default Units;
