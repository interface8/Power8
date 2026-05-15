"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
} from "lucide-react";

const orders = [
  {
    id: "ORD-202605-0001",
    customer: "John Doe",
    email: "john@example.com",
    amount: 850000,
    paymentType: "FULL",
    paymentStatus: "PAID",
    orderStatus: "DELIVERED",
    shippingStatus: "DELIVERED",
    date: "12 May 2026",
  },
  {
    id: "ORD-202605-0002",
    customer: "Michael James",
    email: "michael@example.com",
    amount: 420000,
    paymentType: "CREDIT",
    paymentStatus: "PARTIALLY_PAID",
    orderStatus: "PROCESSING",
    shippingStatus: "PROCESSING",
    date: "11 May 2026",
  },
  {
    id: "ORD-202605-0003",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    amount: 1200000,
    paymentType: "FULL",
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    shippingStatus: "PENDING",
    date: "10 May 2026",
  },
  {
    id: "ORD-202605-0004",
    customer: "Daniel Peters",
    email: "daniel@example.com",
    amount: 620000,
    paymentType: "FULL",
    paymentStatus: "FAILED",
    orderStatus: "CANCELLED",
    shippingStatus: "CANCELLED",
    date: "09 May 2026",
  },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()),
  );

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "PARTIALLY_PAID":
        return "bg-orange-100 text-orange-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getOrderBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "PROCESSING":
        return "bg-purple-100 text-purple-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Order Management
        </h1>

        <p className="text-gray-500 mt-1">
          View and manage customer orders, payments and deliveries
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>

              <h2 className="text-3xl font-bold mt-1">24</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>

              <h2 className="text-3xl font-bold mt-1">5</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock3 className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Processing</p>

              <h2 className="text-3xl font-bold mt-1">8</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Truck className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivered</p>

              <h2 className="text-3xl font-bold mt-1">11</h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search by customer or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Order Status */}
          <select className="h-12 px-4 rounded-xl border border-gray-200 text-sm outline-none">
            <option>Order Status</option>
            <option>PENDING</option>
            <option>PROCESSING</option>
            <option>DELIVERED</option>
            <option>CANCELLED</option>
          </select>

          {/* Payment Type */}
          <select className="h-12 px-4 rounded-xl border border-gray-200 text-sm outline-none">
            <option>Payment Type</option>
            <option>FULL</option>
            <option>CREDIT</option>
          </select>

          {/* Payment Status */}
          <select className="h-12 px-4 rounded-xl border border-gray-200 text-sm outline-none">
            <option>Payment Status</option>
            <option>PAID</option>
            <option>PENDING</option>
            <option>FAILED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment Type</th>
                <th className="px-6 py-4 font-medium">Payment Status</th>
                <th className="px-6 py-4 font-medium">Order Status</th>
                <th className="px-6 py-4 font-medium">Shipping</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-orange-50/40 transition"
                >
                  <td className="px-6 py-5 font-medium text-gray-900">
                    {order.id}
                  </td>

                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.customer}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-semibold text-gray-900">
                    ₦{order.amount.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {order.paymentType}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(
                        order.paymentStatus,
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderBadge(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">
                      {order.shippingStatus}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-600">
                    {order.date}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-orange-50 flex items-center justify-center transition">
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>

                      <button className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-blue-50 flex items-center justify-center transition">
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>

                      <button className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-red-50 flex items-center justify-center transition">
                        <XCircle className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing 1 to 4 of 24 orders
          </p>

          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
              Previous
            </button>

            <button className="w-10 h-10 rounded-lg bg-orange-500 text-white text-sm font-medium">
              1
            </button>

            <button className="w-10 h-10 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
              2
            </button>

            <button className="h-10 px-4 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}