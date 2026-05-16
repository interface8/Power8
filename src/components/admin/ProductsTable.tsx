"use client";

import {
  Pencil,
  Trash2,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "550W Solar Panel",
    category: "Solar Panels",
    price: "₦180,000",
    stock: 25,
    status: "Active",
  },
  {
    id: 2,
    name: "5KVA Inverter",
    category: "Inverters",
    price: "₦450,000",
    stock: 8,
    status: "Low Stock",
  },
];

export default function ProductsTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Top */}
      <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search products..."
          className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-orange-500"
        />

        <select className="h-11 px-4 rounded-xl border border-gray-200 outline-none">
          <option>All Categories</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-175">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Product
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Category
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Price
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Stock
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-gray-100"
              >
                <td className="px-6 py-5 font-medium text-gray-800">
                  {product.name}
                </td>

                <td className="px-6 py-5 text-gray-600">
                  {product.category}
                </td>

                <td className="px-6 py-5 font-semibold text-gray-900">
                  {product.price}
                </td>

                <td className="px-6 py-5 text-gray-700">
                  {product.stock}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}