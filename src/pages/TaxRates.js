import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "taxRates";

function TaxRates() {
  const [taxRates, setTaxRates] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [taxType, setTaxType] = useState("VAT");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    loadTaxRates();
  }, []);

  const loadTaxRates = () => {
    setTaxRates(getData(STORAGE_KEY));
  };

  const resetForm = () => {
    setName("");
    setPercentage("");
    setTaxType("VAT");
    setStatus("Active");
    setEditing(false);
    setSelectedId(null);
    setShowModal(false);
  };

  const saveTaxRate = () => {
    if (!name.trim()) {
      alert("Tax Name is required.");
      return;
    }

    const item = {
      id: selectedId,
      name,
      percentage,
      taxType,
      status,
    };

    if (editing) {
      updateData(STORAGE_KEY, item);
    } else {
      delete item.id;
      addData(STORAGE_KEY, item);
    }

    loadTaxRates();
    resetForm();
  };

  const editTaxRate = (item) => {
    setEditing(true);
    setSelectedId(item.id);
    setName(item.name);
    setPercentage(item.percentage);
    setTaxType(item.taxType);
    setStatus(item.status);
    setShowModal(true);
  };

  const removeTaxRate = (id) => {
    if (window.confirm("Delete this tax rate?")) {
      deleteData(STORAGE_KEY, id);
      loadTaxRates();
    }
  };

  const filtered = taxRates.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Tax Rates</h1>

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Add Tax Rate
      </button>

      <br />
      <br />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Tax..."
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>Percentage</th>
            <th>Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6">No Tax Rates Found</td>
            </tr>
          ) : (
            filtered.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.percentage}%</td>
                <td>{item.taxType}</td>
                <td>{item.status}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editTaxRate(item)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeTaxRate(item.id)}
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
          title={editing ? "Edit Tax Rate" : "Add Tax Rate"}
          onSave={saveTaxRate}
          onClose={resetForm}
        >
          <input
            className="form-control"
            placeholder="Tax Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control"
            type="number"
            placeholder="Tax Percentage"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />

          <select
            className="form-control"
            value={taxType}
            onChange={(e) => setTaxType(e.target.value)}
          >
            <option>VAT</option>
            <option>GST</option>
            <option>Sales Tax</option>
            <option>Exempt</option>
          </select>

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

export default TaxRates;
