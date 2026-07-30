import { addData, getData } from "../storage/storageService";

const KEY = "payment_in";

export const getPaymentIn = () => getData(KEY);

export const addPaymentIn = (payment) => {
  addData(KEY, payment);
};
