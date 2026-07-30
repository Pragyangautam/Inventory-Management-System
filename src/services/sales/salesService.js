import { getProducts, updateProduct } from "../inventory/productService";

import { addPaymentIn } from "../payments/paymentInService";

import { addCashTransaction } from "../accounting/cashBookService";

import { addJournalEntry } from "../accounting/journalService";
import {
  getData,
  addData,
  updateData,
  deleteData,
} from "../storage/storageService";

const STORAGE_KEY = "sales";

export const getSales = () => {
  return getData(STORAGE_KEY);
};

export const addSale = (sale) => {
  addData(STORAGE_KEY, {
    ...sale,

    createdAt: new Date().toISOString(),
  });
};

export const updateSale = (sale) => {
  updateData(STORAGE_KEY, sale);
};

export const deleteSale = (id) => {
  deleteData(STORAGE_KEY, id);
};

export const getNextInvoiceNo = () => {
  const sales = getData(STORAGE_KEY);

  if (sales.length === 0) {
    return "INV-00001";
  }

  const last = sales[sales.length - 1].invoiceNo;

  const number = parseInt(last.replace("INV-", ""), 10) + 1;

  return `INV-${String(number).padStart(5, "0")}`;
};

export const calculateTotals = (items, invoiceDiscount = 0) => {
  const subTotal = items.reduce(
    (sum, item) => sum + Number(item.total || 0),

    0,
  );

  const grandTotal = subTotal - Number(invoiceDiscount);

  return {
    subTotal,

    grandTotal,
  };
};
export const saveInvoice = (invoice) => {
  const {
    subTotal,

    grandTotal,
  } = calculateTotals(
    invoice.items,

    invoice.discount,
  );

  const sale = {
    ...invoice,

    subTotal,

    grandTotal,

    due: grandTotal - Number(invoice.received),

    id: Date.now(),
  };

  addSale(sale);

  invoice.items.forEach((item) => {
    const products = getProducts();

    const product = products.find((p) => p.name === item.product);

    if (product) {
      updateProduct({
        ...product,

        quantity: Number(product.quantity) - Number(item.qty),
      });
    }
  });

  if (Number(invoice.received) > 0) {
    addPaymentIn({
      id: Date.now() + 1,

      date: invoice.date,

      customer: invoice.customer,

      amount: invoice.received,

      method: invoice.paymentMethod,

      reference: invoice.invoiceNo,
    });
  }

  addCashTransaction({
    id: Date.now() + 2,

    date: invoice.date,

    type: "IN",

    particulars: "Sales " + invoice.invoiceNo,

    amount: invoice.received,
  });

  addJournalEntry({
    id: Date.now() + 3,

    date: invoice.date,

    voucher: invoice.invoiceNo,

    debit: "Cash / Bank",

    credit: "Sales",

    amount: grandTotal,
  });

  return sale;
};

export const searchSales = (keyword = "") => {
  const sales = getSales();

  return sales.filter(
    (sale) =>
      sale.customer

        .toLowerCase()

        .includes(keyword.toLowerCase()) ||
      sale.invoiceNo

        .toLowerCase()

        .includes(keyword.toLowerCase()),
  );
};

export const getTodaySales = () => {
  const today = new Date().toISOString().split("T")[0];

  return getSales().filter((sale) => sale.date === today);
};

export const getTodaySalesAmount = () => {
  return getTodaySales().reduce(
    (sum, sale) => sum + Number(sale.grandTotal || 0),

    0,
  );
};

export const getTotalSalesAmount = () => {
  return getSales().reduce(
    (sum, sale) => sum + Number(sale.grandTotal || 0),

    0,
  );
};
