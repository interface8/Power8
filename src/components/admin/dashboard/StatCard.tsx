import { ArrowUpRight, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: string;
  trendPositive?: boolean;
  warning?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendPositive = true,
  warning,
}: StatCardProps) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-3xl border p-5 md:p-6
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        ${
          warning
            ? "border-red-100 bg-linear-to-br from-red-50 to-white"
            : "border-gray-200 bg-white"
        }
      `}
    >
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gray-100/40 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={`
              text-sm font-semibold tracking-wide
              ${warning ? "text-red-600" : "text-gray-500"}
            `}
          >
            {title}
          </p>

          <h3 className="mt-4 wrap-break-word text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>

          {trend && (
            <div
              className={`
    mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold
    ${trendPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
  `}
            >
              <ArrowUpRight
                className={`h-3.5 w-3.5 ${!trendPositive ? "rotate-180" : ""}`}
              />
              {trend} vs last month
            </div>
          )}
        </div>

        <div
          className={`
            flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
            shadow-sm
            ${iconBg}
          `}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
