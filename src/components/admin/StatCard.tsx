import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;

  iconColor: string;
  iconBg: string;

  warning?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  warning,
}: StatCardProps) {
  return (
    <div
      className={`bg-white border rounded-2xl p-5 transition-all ${warning ? "border-red-200 bg-red-50/40" : "border-gray-200"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p
            className={`text-sm font-medium ${warning ? "text-red-600" : "text-gray-500"}`}
          >
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2 wrap-break-word">
            {value}
          </h3>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
