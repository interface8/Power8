import { ReactNode } from "react";

interface StateCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function StateCard({
  icon,
  title,
  description,
  action,
}: StateCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-orange-100 blur-xl opacity-60" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50">
            {icon}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 max-w-md text-sm text-slate-500">
          {description}
        </p>

        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}