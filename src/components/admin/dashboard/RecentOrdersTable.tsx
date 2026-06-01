import { RecentOrder } from "@/types/admin";

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (!orders.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-500">No recent orders found.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 border-separate border-spacing-0">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 sm:px-4">
                Customer
              </th>

              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 sm:px-4">
                Order ID
              </th>

              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 sm:px-4">
                Amount
              </th>

              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 sm:px-4">
                Payment
              </th>

              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 sm:px-4">
                Status
              </th>

              <th className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 sm:px-4">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const formattedOrderId = `ORD-${order.id
                .slice(-3)
                .toUpperCase()}`;

              return (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 transition-all duration-200  hover:bg-gray-50"
                >
                  {/* Customer */}
                  <td className="px-3 py-4 sm:px-4 sm:py-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 sm:text-[15px]">
                        {order.customerName}
                      </p>
                    </div>
                  </td>

                  {/* Order ID */}
                  <td className="whitespace-nowrap px-3 py-4 sm:px-4 sm:py-5">
                    <span className="rounded-lg text-sm sm:text-[12px] font-medium tracking-wide text-gray-700">
                      {formattedOrderId}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-800 sm:px-4 sm:py-5">
                    {currencyFormatter.format(order.totalAmount)}
                  </td>

                  {/* Payment */}
                  <td className="px-3 py-4 sm:px-4 sm:py-5">
                    <span className="inline-flex whitespace-nowrap rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                      {order.paymentType.toLowerCase().replace("_", " ")}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-4 sm:px-4 sm:py-5">
                    <span
                      className={`
                        inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize
                        ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.orderStatus === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {order.orderStatus.toLowerCase()}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-500 sm:px-4 sm:py-5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
