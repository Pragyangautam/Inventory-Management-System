import { useState, useEffect } from "react";

function ProductForm({ onSave, onCancel, editingProduct = null }) {
  const [formData, setFormData] = useState({
    articleNo: "",
    hsCode: "",
    particular: "",
    category: "",
    brand: "",
    unit: "",
    warehouse: "",
    costPrice: "",
    wholesalePrice: "",
    mrp: "",
    openingStock: "",
    minimumStock: "",
    status: "Active",
    remarks: "",
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.articleNo.trim() === "" || formData.particular.trim() === "") {
      alert("Article No and Particular are required.");
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <input
          className="form-control"
          name="articleNo"
          placeholder="Article No"
          value={formData.articleNo}
          onChange={handleChange}
        />

        <input
          className="form-control"
          name="hsCode"
          placeholder="HS Code"
          value={formData.hsCode}
          onChange={handleChange}
        />

        <input
          className="form-control"
          name="particular"
          placeholder="Particular"
          value={formData.particular}
          onChange={handleChange}
        />

        <input
          className="form-control"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          className="form-control"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
        />

        <input
          className="form-control"
          name="unit"
          placeholder="Unit"
          value={formData.unit}
          onChange={handleChange}
        />

        <input
          className="form-control"
          name="warehouse"
          placeholder="Warehouse"
          value={formData.warehouse}
          onChange={handleChange}
        />

        <input
          className="form-control"
          type="number"
          name="costPrice"
          placeholder="Cost Price"
          value={formData.costPrice}
          onChange={handleChange}
        />

        <input
          className="form-control"
          type="number"
          name="wholesalePrice"
          placeholder="Wholesale Price"
          value={formData.wholesalePrice}
          onChange={handleChange}
        />

        <input
          className="form-control"
          type="number"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
        />

        <input
          className="form-control"
          type="number"
          name="openingStock"
          placeholder="Opening Stock"
          value={formData.openingStock}
          onChange={handleChange}
        />

        <input
          className="form-control"
          type="number"
          name="minimumStock"
          placeholder="Minimum Stock"
          value={formData.minimumStock}
          onChange={handleChange}
        />

        <select
          className="form-control"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <textarea
        className="form-control"
        rows="4"
        name="remarks"
        placeholder="Remarks"
        value={formData.remarks}
        onChange={handleChange}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" className="btn btn-primary">
          Save Product
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
