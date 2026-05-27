// import {
//   DollarSign,
//   Users,
//   ShoppingCart,
//   AlertTriangle,
//   Package,
//   Boxes,
//   CreditCard,
// } from "lucide-react";

// import { AdminStats } from "@/types/admin";

// import StatCard from "./StatCard";

// interface DashboardStatsProps {
//   stats: AdminStats;
// }

// const currencyFormatter = new Intl.NumberFormat("en-NG", {
//   style: "currency",
//   currency: "NGN",
//   maximumFractionDigits: 0,
// });

// export default function DashboardStats({ stats }: DashboardStatsProps) {
//   const cards = [
//     {
//       title: "Total Revenue",
//       value: currencyFormatter.format(stats.totalRevenue),
//       icon: DollarSign,
//       iconColor: "text-green-600",
//       iconBg: "bg-green-100",
//     },

//     {
//       title: "Registered Users",
//       value: stats.totalRegisteredUsers,
//       icon: Users,
//       iconColor: "text-purple-600",
//       iconBg: "bg-purple-100",
//     },

//     {
//       title: "Total Orders",
//       value: stats.totalOrders,
//       icon: ShoppingCart,
//       iconColor: "text-orange-600",
//       iconBg: "bg-orange-100",
//     },

//     {
//       title: "Active Credit Accounts",
//       value: stats.activeCreditAccounts,
//       icon: CreditCard,
//       iconColor: "text-blue-600",
//       iconBg: "bg-blue-100",
//     },

//     {
//       title: "Overdue Payments",
//       value: stats.overduePaymentSchedules,
//       icon: AlertTriangle,
//       iconColor:
//         stats.overduePaymentSchedules > 0 ? "text-red-600" : "text-green-600",
//       iconBg: stats.overduePaymentSchedules > 0 ? "bg-red-100" : "bg-green-100",
//       warning: stats.overduePaymentSchedules > 0,
//     },

//     {
//       title: "In Stock Products",
//       value: stats.products.inStock,
//       icon: Boxes,
//       iconColor: "text-emerald-600",
//       iconBg: "bg-emerald-100",
//     },

//     {
//       title: "Out Of Stock",
//       value: stats.products.outOfStock,
//       icon: Package,
//       iconColor: "text-red-600",
//       iconBg: "bg-red-100",
//       warning: stats.products.outOfStock > 0,
//     },

//     {
//       title: "Low Stock Products",
//       value: stats.products.lowStock,
//       icon: Package,
//       iconColor:
//         stats.products.lowStock > 0 ? "text-yellow-600" : "text-green-600",
//       iconBg: stats.products.lowStock > 0 ? "bg-yellow-100" : "bg-green-100",
//       warning: stats.products.lowStock > 0,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5">
//       {cards.map((card) => (
//         <StatCard
//           key={card.title}
//           title={card.title}
//           value={card.value}
//           icon={card.icon}
//           iconColor={card.iconColor}
//           iconBg={card.iconBg}
//           warning={card.warning}
//         />
//       ))}
//     </div>
//   );
// }


import {
  DollarSign,
  Users,
  ShoppingCart,
  AlertTriangle,
  Package,
  Boxes,
  CreditCard,
} from "lucide-react";

import { AdminStats } from "@/types/admin";

import StatCard from "./StatCard";

interface DashboardStatsProps {
  stats: AdminStats;
}

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: currencyFormatter.format(stats.totalRevenue),
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      trend: "+12%",
    },

    {
      title: "Registered Users",
      value: stats.totalRegisteredUsers,
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      trend: "+8%",
    },

    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      trend: "+6%",
    },

    {
      title: "Active Credits",
      value: stats.activeCreditAccounts,
      icon: CreditCard,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      trend: "+5%",
    },

    {
      title: "Overdue Payments",
      value: stats.overduePaymentSchedules,
      icon: AlertTriangle,
      iconColor:
        stats.overduePaymentSchedules > 0
          ? "text-red-600"
          : "text-green-600",
      iconBg:
        stats.overduePaymentSchedules > 0
          ? "bg-red-100"
          : "bg-green-100",
      warning: stats.overduePaymentSchedules > 0,
      trend: "-3%",
    },

    {
      title: "In Stock",
      value: stats.products.inStock,
      icon: Boxes,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      trend: "+2%",
    },

    {
      title: "Out Of Stock",
      value: stats.products.outOfStock,
      icon: Package,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      warning: stats.products.outOfStock > 0,
      trend: "-1%",
    },

    {
      title: "Low Stock",
      value: stats.products.lowStock,
      icon: Package,
      iconColor:
        stats.products.lowStock > 0
          ? "text-yellow-600"
          : "text-green-600",
      iconBg:
        stats.products.lowStock > 0
          ? "bg-yellow-100"
          : "bg-green-100",
      warning: stats.products.lowStock > 0,
      trend: "+4%",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconColor={card.iconColor}
          iconBg={card.iconBg}
          warning={card.warning}
          trend={card.trend}
        />
      ))}
    </div>
  );
}