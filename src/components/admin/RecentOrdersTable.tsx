import { RecentOrder } from "@/types/admin";

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

const currencyFormatter = new Intl.NumberFormat(
  "en-NG",
  {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }
);

export default function RecentOrdersTable({
  orders,
}: RecentOrdersTableProps) {
  if (!orders.length) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500 text-sm">
          No recent orders found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-175">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 text-sm font-semibold text-gray-600">
              Customer
            </th>

            <th className="text-left py-3 text-sm font-semibold text-gray-600">
              Amount
            </th>

            <th className="text-left py-3 text-sm font-semibold text-gray-600">
              Payment Type
            </th>

            <th className="text-left py-3 text-sm font-semibold text-gray-600">
              Status
            </th>

            <th className="text-left py-3 text-sm font-semibold text-gray-600">
              Date
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-100"
            >
              <td className="py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.customerName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {order.customerEmail}
                  </p>
                </div>
              </td>

              <td className="py-4 text-sm text-gray-700">
                {currencyFormatter.format(
                  order.totalAmount
                )}
              </td>

              <td className="py-4 text-sm text-gray-700 capitalize">
                {order.paymentType
                  .toLowerCase()
                  .replace("_", " ")}
              </td>

              <td className="py-4">
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${
                      order.orderStatus ===
                      "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus ===
                          "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.orderStatus ===
                          "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  `}
                >
                  {order.orderStatus.toLowerCase()}
                </span>
              </td>

              <td className="py-4 text-sm text-gray-500 whitespace-nowrap">
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}