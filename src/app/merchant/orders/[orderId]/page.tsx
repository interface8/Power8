"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Layers3,
  ShoppingCart,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED";

interface OrderItem {
  id: string;
  itemType: "PRODUCT" | "BUNDLE";
  name: string;
  quantity: number;
  unitPrice: number;
}

interface MerchantOrderDetail {
  orderId: string;
  customer: { firstName: string; lastName: string };
  orderDate: string;
  orderStatus: OrderStatus;
  items: OrderItem[];
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { color: string; icon: React.ReactNode }> = {
    PENDING: { color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> },
    CONFIRMED: { color: "bg-blue-100 text-blue-700", icon: <CheckCircle2 className="w-3 h-3" /> },
    PROCESSING: { color: "bg-indigo-100 text-indigo-700", icon: <AlertCircle className="w-3 h-3" /> },
    SHIPPED: { color: "bg-purple-100 text-purple-700", icon: <Truck className="w-3 h-3" /> },
    DELIVERED: { color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
    COMPLETED: { color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
    CANCELLED: { color: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
  };
  const { color, icon } = map[status] ?? map.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {icon}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default function MerchantOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<MerchantOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/merchant/orders/${orderId}`);
      if (!res.ok) {
        toast.error("Order not found");
        router.push("/merchant/orders");
        return;
      }
      const json = await res.json();
      setOrder(json.data);
    } catch {
      toast.error("Failed to load order");
      router.push("/merchant/orders");
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32" />
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!order) return null;

  const myTotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => router.push("/merchant/orders")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Order ID</p>
            <p className="font-mono text-sm text-gray-700">{order.orderId}</p>
          </div>
          <StatusBadge status={order.orderStatus} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4 text-gray-400" />
            <span>{order.customer.firstName} {order.customer.lastName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(order.orderDate).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
          You are viewing only the items from your store. Payment and full customer contact details are managed by Power-8 admin.
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <ShoppingCart className="w-4 h-4" />
          Your Items in This Order
        </h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.itemType === "BUNDLE" ? "bg-purple-100" : "bg-blue-100"}`}>
                  {item.itemType === "BUNDLE"
                    ? <Layers3 className="w-4 h-4 text-purple-600" />
                    : <Package className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.itemType === "BUNDLE" ? "Bundle" : "Product"} · Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ₦{(item.unitPrice * item.quantity).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">₦{item.unitPrice.toLocaleString()} each</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <p className="font-semibold text-gray-900">Your Total</p>
          <p className="text-xl font-bold text-gray-900">₦{myTotal.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
