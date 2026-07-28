export const calculateAvailableStock = (product) => {
  const opening = Number(product.openingStock || 0);
  const purchased = Number(product.purchaseQty || 0);
  const sold = Number(product.salesQty || 0);
  const returned = Number(product.returnQty || 0);
  const adjusted = Number(product.adjustmentQty || 0);
  const transferred = Number(product.transferQty || 0);

  return opening + purchased + returned + adjusted - sold - transferred;
};
