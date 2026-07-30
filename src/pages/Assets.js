import { useEffect, useState } from "react";
import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";
import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../services/storage/storageService";

const STORAGE_KEY = "assets";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [assetCode, setAssetCode] = useState("");
  const [assetName, setAssetName] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [salvageValue, setSalvageValue] = useState("");
  const [life, setLife] = useState("");
  const [method, setMethod] = useState("Straight Line");

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setAssets(getData(STORAGE_KEY));
  };

  const clear = () => {
    setEditing(null);

    setAssetCode("");
    setAssetName("");
    setCategory("");
    setPurchaseDate("");
    setPurchaseCost("");
    setSalvageValue("");
    setLife("");
    setMethod("Straight Line");
  };

  const save = () => {
    const obj = {
      assetCode,
      assetName,
      category,
      purchaseDate,

      purchaseCost: Number(purchaseCost),

      salvageValue: Number(salvageValue),

      life: Number(life),

      method,
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

  const edit = (asset) => {
    setEditing(asset);

    setAssetCode(asset.assetCode);
    setAssetName(asset.assetName);
    setCategory(asset.category);
    setPurchaseDate(asset.purchaseDate);
    setPurchaseCost(asset.purchaseCost);
    setSalvageValue(asset.salvageValue);
    setLife(asset.life);
    setMethod(asset.method);

    setShowModal(true);
  };

  const remove = (id) => {
    if (window.confirm("Delete Asset?")) {
      deleteData(STORAGE_KEY, id);

      load();
    }
  };

  const filtered = assets.filter(
    (item) =>
      item.assetName.toLowerCase().includes(search.toLowerCase()) ||
      item.assetCode.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
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
        <h1>Assets Register</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            clear();
            setShowModal(true);
          }}
        >
          + Add Asset
        </button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Asset..."
      />

      <br />

      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Purchase Date</th>
            <th>Cost</th>
            <th>Life</th>
            <th>Method</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="8">No Assets Found</td>
            </tr>
          ) : (
            filtered.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.assetCode}</td>

                <td>{asset.assetName}</td>

                <td>{asset.category}</td>

                <td>{asset.purchaseDate}</td>

                <td>{asset.purchaseCost}</td>

                <td>{asset.life} Years</td>

                <td>{asset.method}</td>

                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => edit(asset)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger"
                    onClick={() => remove(asset.id)}
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
          title={editing ? "Edit Asset" : "Add Asset"}
          onSave={save}
          onClose={() => setShowModal(false)}
        >
          <input
            className="form-control"
            placeholder="Asset Code"
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Asset Name"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            className="form-control"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />

          <input
            className="form-control"
            type="number"
            placeholder="Purchase Cost"
            value={purchaseCost}
            onChange={(e) => setPurchaseCost(e.target.value)}
          />

          <input
            className="form-control"
            type="number"
            placeholder="Salvage Value"
            value={salvageValue}
            onChange={(e) => setSalvageValue(e.target.value)}
          />

          <input
            className="form-control"
            type="number"
            placeholder="Useful Life (Years)"
            value={life}
            onChange={(e) => setLife(e.target.value)}
          />

          <select
            className="form-control"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option>Straight Line</option>

            <option>Written Down Value</option>
          </select>
        </FormModal>
      )}
    </div>
  );
}

export default Assets;
