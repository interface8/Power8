import { formatOrderId } from "@/utils/formatId";

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const truncateOrderId = (orderId: string, maxLength: number = 24) => {
  if (orderId.length <= maxLength) return orderId;
  return formatOrderId(orderId);
};
