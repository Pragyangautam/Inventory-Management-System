import { useEffect, useState } from "react";

import SearchBar from "../components/common/search/SearchBar";
import FormModal from "../components/common/modal/FormModal";

import PurchaseForm from "../components/purchase/PurchaseForm";
import PurchaseTable from "../components/purchase/PurchaseTable";

import {
  getPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
} from "../services/purchase/purchaseService";

function Purchase() {
  const [purchases, setPurchases] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingPurchase, setEditingPurchase] = useState(null);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = () => {
    setPurchases(getPurchases());
  };

  const savePurchase = (purchase) => {
    if (editingPurchase) {
      updatePurchase({
        ...editingPurchase,

        ...purchase,
      });
    } else {
      addPurchase(purchase);
    }

    loadPurchases();

    setEditingPurchase(null);

    setShowModal(false);
  };

  const editPurchase = (purchase) => {
    setEditingPurchase(purchase);

    setShowModal(true);
  };

  const removePurchase = (id) => {
    if (window.confirm("Delete Purchase?")) {
      deletePurchase(id);

      loadPurchases();
    }
  };

  const filtered = purchases.filter(
    (item) =>
      item.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase()),
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
        <h1>Purchase Entry</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingPurchase(null);

            setShowModal(true);
          }}
        >
          + New Purchase
        </button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search Purchase..."
      />

      <br />

      <PurchaseTable
        purchases={filtered}
        onEdit={editPurchase}
        onDelete={removePurchase}
      />

      {showModal && (
        <FormModal
          title={editingPurchase ? "Edit Purchase" : "New Purchase"}
          onClose={() => {
            setShowModal(false);

            setEditingPurchase(null);
          }}
          onSave={() => {}}
        >
          <PurchaseForm
            editingPurchase={editingPurchase}
            onSave={savePurchase}
            onCancel={() => {
              setShowModal(false);

              setEditingPurchase(null);
            }}
          />
        </FormModal>
      )}
    </div>
  );
}

export default Purchase;
