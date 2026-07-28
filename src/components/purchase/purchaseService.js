import {
  getData,
  addData,
  updateData,
  deleteData,
  findById,
} from "../storage/storageService";

const STORAGE_KEY = "purchases";

export const getPurchases = () => {
  return getData(STORAGE_KEY);
};

export const getPurchase = (id) => {
  return findById(STORAGE_KEY, id);
};

export const addPurchase = (purchase) => {
  return addData(STORAGE_KEY, {
    invoiceNo: "",
    purchaseDate: "",
    supplier: "",
    warehouse: "",
    paymentMethod: "Cash",
    dueDate: "",

    articleNo: "",
    product: "",
    hsCode: "",

    qty: 0,
    rate: 0,
    discount: 0,
    tax: 0,

    subtotal: 0,
    grandTotal: 0,

    remarks: "",

    ...purchase,
  });
};

export const updatePurchase = (purchase) => {
  updateData(STORAGE_KEY, purchase);
};

export const deletePurchase = (id) => {
  deleteData(STORAGE_KEY, id);
};

export const searchPurchases = (keyword) => {
  const purchases = getPurchases();

  return purchases.filter(
    (item) =>
      item.invoiceNo.toLowerCase().includes(keyword.toLowerCase()) ||
      item.supplier.toLowerCase().includes(keyword.toLowerCase()) ||
      item.product.toLowerCase().includes(keyword.toLowerCase()),
  );
};

export const totalPurchases = () => {
  return getPurchases().length;
};

export const totalPurchaseAmount = () => {
  return getPurchases().reduce(
    (total, item) => total + Number(item.grandTotal || 0),
    0,
  );
};

export const purchasesBySupplier = (supplier) => {
  return getPurchases().filter((item) => item.supplier === supplier);
};

export const purchasesByDate = (date) => {
  return getPurchases().filter((item) => item.purchaseDate === date);
};

export const purchasesBetweenDates = (startDate, endDate) => {
  return getPurchases().filter(
    (item) => item.purchaseDate >= startDate && item.purchaseDate <= endDate,
  );
};

export const supplierBalance = (supplier) => {
  return purchasesBySupplier(supplier).reduce(
    (total, item) => total + Number(item.grandTotal || 0),
    0,
  );
};

export const clearPurchases = () => {
  localStorage.removeItem(STORAGE_KEY);
};
