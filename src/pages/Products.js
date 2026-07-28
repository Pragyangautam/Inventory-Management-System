import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import ProductForm from "../components/inventory/ProductForm";
import ProductTable from "../components/inventory/ProductTable";
import ProductDetails from "../components/inventory/ProductDetails";
import StockSummary from "../components/inventory/StockSummary";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/inventory/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const saveProduct = (product) => {
    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...product,
      });
    } else {
      addProduct(product);
    }

    loadProducts();
    setShowModal(false);
    setEditingProduct(null);
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const removeProduct = (id) => {
    if (window.confirm("Delete Product?")) {
      deleteProduct(id);
      loadProducts();

      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
    }
  };

  const filteredProducts = products.filter((item) =>
    item.particular.toLowerCase().includes(search.toLowerCase()),
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
        <h1>Product Master</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
        >
          + Add Product
        </button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Product..."
      />

      <br />

      <ProductTable
        products={filteredProducts}
        onView={(product) => setSelectedProduct(product)}
        onEdit={editProduct}
        onDelete={removeProduct}
      />

      <br />

      {selectedProduct && (
        <>
          <ProductDetails product={selectedProduct} />

          <br />

          <StockSummary product={selectedProduct} />
        </>
      )}

      {showModal && (
        <FormModal
          title={editingProduct ? "Edit Product" : "Add Product"}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={() => {}}
        >
          <ProductForm
            editingProduct={editingProduct}
            onSave={saveProduct}
            onCancel={() => {
              setShowModal(false);
              setEditingProduct(null);
            }}
          />
        </FormModal>
      )}
    </div>
  );
}

export default Products;
