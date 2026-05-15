import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Revenue",
    value: "₦450,000",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Orders",
    value: "1,245",
    icon: ShoppingCart,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    title: "Products",
    value: "320",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Users",
    value: "2,430",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white border border-gray-200 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </h3>
            </div>

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}