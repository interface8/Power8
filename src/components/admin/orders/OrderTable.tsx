"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { Order } from "@/types/order";

interface OrdersTableProps {
  orders: Order[];
}

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function OrdersTable({
  orders,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Order ID
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Customer
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Amount
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Payment Type
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Payment Status
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Order Status
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Fulfillment
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Created At
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {order.id}
                </td>

                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {order.customerEmail}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {currencyFormatter.format(order.totalAmount)}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.paymentType}
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {order.paymentStatus}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    {order.orderStatus}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {order.fulfillmentStatus}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-700" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
