import {
  AdminOrderDetail,
  OrderFilters,
  OrdersResponse,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
} from "@/types/order";

const BASE_URL = "/api/admin/orders";

async function throwApiError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  throw new Error(body?.message ?? fallback);
}

function buildQuery(params: OrderFilters) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return query.toString();
}

export async function getOrders(filters: OrderFilters): Promise<OrdersResponse> {
  const query = buildQuery(filters);
  const response = await fetch(`${BASE_URL}?${query}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to fetch orders");
  }

  return response.json();
}

export async function getOrderById(id: string): Promise<{ data: AdminOrderDetail }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to fetch order");
  }

  return response.json();
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to update order status");
  }

  return response.json();
}

export async function updatePaymentStatus(id: string, status: PaymentStatus) {
  const response = await fetch(`${BASE_URL}/${id}/payment-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to update payment status");
  }

  return response.json();
}

export async function updateShippingStatus(
  id: string,
  payload: {
    status: ShippingStatus;
    trackingNumber?: string;
    shippingProvider?: string;
  }
) {
  const response = await fetch(`${BASE_URL}/${id}/shipping-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to update shipping status");
  }

  return response.json();
}
