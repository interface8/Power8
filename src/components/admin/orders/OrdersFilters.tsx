interface OrdersFiltersProps {
  search: string;
  setSearch: (value: string) => void;

  orderStatus: string;
  setOrderStatus: (value: string) => void;

  paymentType: string;
  setPaymentType: (value: string) => void;

  paymentStatus: string;
  setPaymentStatus: (value: string) => void;
}

export default function OrdersFilters({
  search,
  setSearch,
  orderStatus,
  setOrderStatus,
  paymentType,
  setPaymentType,
  paymentStatus,
  setPaymentStatus,
}: OrdersFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by customer or order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        />

        <select
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="ALL">All Order Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="ALL">All Payment Types</option>
          <option value="FULL">Full</option>
          <option value="CREDIT">Credit</option>
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="ALL">All Payment Status</option>
          <option value="PENDING">Pending</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>
    </div>
  );
}
