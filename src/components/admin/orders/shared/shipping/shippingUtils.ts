import { ShippingStatus } from "@/types/order";

export const shippingStatuses: ShippingStatus[] = [
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export const shippingProviders = [
  { value: "DHL", label: "DHL Express" },
  { value: "FedEx", label: "FedEx" },
  { value: "UPS", label: "UPS" },
  { value: "USPS", label: "USPS" },
  { value: "Aramex", label: "Aramex" },
  { value: "Other", label: "Other" },
];

export const getStatusIcon = (status: ShippingStatus) => {
  switch (status) {
    case "DELIVERED":
      return "CheckCircle2";
    case "SHIPPED":
      return "PackageCheck";
    default:
      return "PackageCheck";
  }
};

export const getStatusColor = (status: ShippingStatus, isActive: boolean) => {
  if (isActive) {
    switch (status) {
      case "PROCESSING":
        return "border-blue-500 bg-blue-500 text-white shadow-blue-100";
      case "SHIPPED":
        return "border-orange-500 bg-orange-500 text-white shadow-orange-100";
      case "DELIVERED":
        return "border-green-500 bg-green-500 text-white shadow-green-100";
      default:
        return "border-orange-500 bg-orange-500 text-white shadow-orange-100";
    }
  }
  return "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700";
};
