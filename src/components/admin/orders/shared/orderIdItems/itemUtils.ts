export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getItemTypeLabel = (itemType: string) => {
  switch (itemType) {
    case "PRODUCT":
      return "Product Item";
    case "BUNDLE":
      return "Bundle Package";
    default:
      return "Item";
  }
};