export const calculateAvailableStock = (product) => {
  return Number(product.openingStock || 0);
};

export const isLowStock = (product) => {
  return (
    calculateAvailableStock(product) <=
    Number(product.minimumStock || 0)
  );
};

export const stockStatus = (product) => {
  if (calculateAvailableStock(product) <= 0) {
    return "Out of Stock";
  }

  if (isLowStock(product)) {
    return "Low Stock";
  }

  return "In Stock";
};

export const stockColor = (product) => {
  const status = stockStatus(product);

  if (status === "Out of Stock") return "red";

  if (status === "Low Stock") return "orange";

  return "green";
};

export const totalStockValue = (products) => {
  return products.reduce(
    (total, item) =>
      total +
      Number(item.costPrice || 0) *
        Number(item.openingStock || 0),
    0
  );
};

export const totalMRPValue = (products) => {
  return products.reduce(
    (total, item) =>
      total +
      Number(item.mrp || 0) *
        Number(item.openingStock || 0),
    0
  );
};