import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../storage/storageService";

const STORAGE_KEY = "products";

export const getProducts = () => {
  return getData(STORAGE_KEY);
};

export const addProduct = (product) => {
  return addData(STORAGE_KEY, product);
};

export const updateProduct = (product) => {
  return updateData(STORAGE_KEY, product);
};

export const deleteProduct = (id) => {
  return deleteData(STORAGE_KEY, id);
};

export const getProductById = (id) => {
  return getProducts().find((product) => product.id === id);
};
