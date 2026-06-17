"use client";

import Link from "next/link";
import {
  CheckCircle2,
  MapPin,
  Package,
  ChevronLeft,
  CreditCard,
  Calendar,
  ArrowRight,
  ShoppingBag,
  LayoutDashboard,
  Truck,
} from "lucide-react";
import { useOrder } from "@/hooks/use-order";
import type { OrderDto, OrderItemDto } from "@/modules/orders/types";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-teal-100 text-teal-700",
  DELIVERED: "bg-teal-100 text-teal-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const NEXT_STEPS = [
  {
    icon: CheckCircle2,
    title: "Order Confirmed",
    description: "Your order has been received and is being processed.",
    done: true,
  },
  {
    icon: Package,
    title: "Equipment Prepared",
    description: "Your solar equipment is being packaged for delivery.",
    done: false,
  },
  {
    icon: Truck,
    title: "Out for Delivery",
    description: "Equipment dispatched to your delivery address.",
    done: false,
  },
  {
    icon: MapPin,
    title: "Installation",
    description: "Our team will install the system at your location.",
    done: false,
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function OrderItemRow({ item }: { item: OrderItemDto }) {
  const name = item.productName ?? item.bundleName ?? "Unknown item";
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
          <Package className="h-4 w-4 text-green-700" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-400">
            {item.itemType === "BUNDLE" ? "Bundle" : "Product"} · Qty:{" "}
            {item.quantity}
          </p>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-900">
        {formatCurrency(item.totalPrice)}
      </p>
    </div>
  );
}

function OrderDetail({ order }: { order: OrderDto }) {
  const subtotal = order.totalAmount / 1.075;
  const vat = order.totalAmount - subtotal;

  return (
    <div className="space-y-6">
      {/* CONFIRMATION BANNER */}
      <div className="flex items-center gap-3 rounded-2xl bg-green-50 px-5 py-4">
        <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
        <div>
          <p className="text-sm font-semibold text-green-800">
            Order placed successfully!
          </p>
          <p className="text-xs text-green-600">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`ml-auto shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT — ORDER DETAILS */}
        <div className="space-y-4 lg:col-span-2">
          {/* ITEMS */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              Items Ordered
            </h2>
            <div className="mt-2 divide-y divide-gray-100">
              {order.items.map((item) => (
                <OrderItemRow key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-dashed border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>VAT (7.5%)</span>
                <span>{formatCurrency(vat)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-orange-500">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* ADDRESSES */}
          <div className="grid gap-4 sm:grid-cols-2">
            {order.installationAddress && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <MapPin className="h-4 w-4 text-green-700" />
                  Installation Address
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {order.installationAddress}
                  {order.city ? `, ${order.city}` : ""}
                  {order.state ? `, ${order.state}` : ""}
                </p>
              </div>
            )}

            {order.deliveryAddress && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Truck className="h-4 w-4 text-green-700" />
                  Delivery Address
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {order.deliveryAddress}
                  {order.deliveryCity ? `, ${order.deliveryCity}` : ""}
                  {order.deliveryState ? `, ${order.deliveryState}` : ""}
                </p>
              </div>
            )}
          </div>

          {/* PAYMENT INFO */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <CreditCard className="h-4 w-4 text-green-700" />
                Payment Type
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {order.paymentType === "FULL"
                  ? "Full Payment"
                  : "Installment (Credit)"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Calendar className="h-4 w-4 text-green-700" />
                Order Date
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — NEXT STEPS + CTAs */}
        <div className="space-y-4">
          {/* WHAT HAPPENS NEXT */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">
              What Happens Next
            </h2>
            <div className="mt-4 space-y-4">
              {NEXT_STEPS.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${step.done ? "text-green-800" : "text-gray-600"}`}
                    >
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              What would you like to do?
            </h2>
            <div className="space-y-2">
              <Link
                href="/products"
                className="flex items-center justify-between rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center justify-between rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 transition"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/orders"
                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  View All Orders
                </div>
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data, isLoading, isError } = useOrder(id);
  const order: OrderDto | null = (data as OrderDto) ?? null;

  return (
    <div className="space-y-6 px-4 md:px-0">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Orders
        </Link>
        <span className="text-gray-300">/</span>
        <p className="text-sm text-gray-400 truncate max-w-[200px]">{id}</p>
      </div>

      <h1 className="text-2xl font-bold text-green-950">Order Details</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : isError || !order ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">Order not found</p>
          <Link
            href="/dashboard/orders"
            className="mt-3 inline-block text-sm text-green-700 underline"
          >
            Back to orders
          </Link>
        </div>
      ) : (
        <OrderDetail order={order} />
      )}
    </div>
  );
}