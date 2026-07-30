import { addData, getData } from "../storage/storageService";

const KEY = "cashBook";

export const getCashBook = () => getData(KEY);

export const addCashTransaction = (entry) => {
  addData(KEY, entry);
};
