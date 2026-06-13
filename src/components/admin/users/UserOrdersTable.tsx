import { OrderType, formatCurrency, formatDateForDisplay } from "./utils";

interface UserOrdersTableProps {
  orders: OrderType[];
}

export function UserOrdersTable({ orders }: UserOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No orders found
      </div>
    );
  }

  return (
    <div className="w-full min-w-137.5">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">ORDER ID</th>
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">AMOUNT</th>
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">PAYMENT TYPE</th>
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">STATUS</th>
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">DATE</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-50">
              <td className="py-3 text-xs sm:text-sm text-gray-600 truncate">{order.id}</td>
              <td className="py-3 text-xs sm:text-sm text-gray-600">{formatCurrency(order.totalAmount)}</td>
              <td className="py-3 text-xs sm:text-sm text-gray-600">{order.paymentType}</td>
              <td className="py-3">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs sm:text-sm">
                  {order.status}
                </span>
              </td>
              <td className="py-3 text-xs sm:text-sm text-gray-600">{formatDateForDisplay(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}