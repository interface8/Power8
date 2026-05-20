// "use client";

// import { useAdminStats } from "@/hooks/use-admin-stats";

// const currencyFormatter = new Intl.NumberFormat(
//   "en-NG",
//   {
//     style: "currency",
//     currency: "NGN",
//     maximumFractionDigits: 0,
//   }
// );

// export default function RecentOrdersTable() {
//   const { data, loading, error } =
//     useAdminStats();

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         {Array.from({ length: 5 }).map(
//           (_, index) => (
//             <div
//               key={index}
//               className="h-16 bg-gray-100 rounded-xl animate-pulse"
//             />
//           )
//         )}
//       </div>
//     );
//   }

//   if (error || !data) {
//     return (
//       <p className="text-sm text-red-500">
//         Failed to load recent orders.
//       </p>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full min-w-[700px]">
//         <thead>
//           <tr className="border-b border-gray-200">
//             <th className="text-left py-3 text-sm font-semibold text-gray-600">
//               Customer
//             </th>

//             <th className="text-left py-3 text-sm font-semibold text-gray-600">
//               Amount
//             </th>

//             <th className="text-left py-3 text-sm font-semibold text-gray-600">
//               Payment Type
//             </th>

//             <th className="text-left py-3 text-sm font-semibold text-gray-600">
//               Status
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.recentOrders
//             ?.slice(0, 10)
//             .map((order) => (
//               <tr
//                 key={order.id}
//                 className="border-b border-gray-100"
//               >
//                 <td className="py-4 text-sm font-medium text-gray-800">
//                   {order.customerName}
//                 </td>

//                 <td className="py-4 text-sm text-gray-700">
//                   {currencyFormatter.format(
//                     order.amount
//                   )}
//                 </td>

//                 <td className="py-4 text-sm text-gray-700">
//                   {order.paymentType}
//                 </td>

//                 <td className="py-4">
//                   <span
//                     className={`
//                     px-3 py-1 rounded-full text-xs font-medium
//                     ${
//                       order.status === "paid"
//                         ? "bg-green-100 text-green-700"
//                         : order.status ===
//                           "pending"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : "bg-red-100 text-red-700"
//                     }
//                   `}
//                   >
//                     {order.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }