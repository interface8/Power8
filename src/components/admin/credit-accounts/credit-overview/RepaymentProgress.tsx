interface Props {
  percentage: number;
  status: "ACTIVE" | "COMPLETED" | "DEFAULTED";
}

export default function RepaymentProgress({ percentage, status }: Props) {
  const progressColor = {
    ACTIVE: "bg-orange-500",
    COMPLETED: "bg-green-500",
    DEFAULTED: "bg-red-500",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-full max-w-45 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${progressColor[status]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="min-w-10 text-sm font-medium text-gray-500">
        {percentage}%
      </span>
    </div>
  );
}
