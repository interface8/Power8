interface Props {
  percentage: number;
}

export default function RepaymentProgressCard({
  percentage,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          Repayment Progress
        </h3>

        <span className="text-sm font-medium">
          {percentage}%
        </span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-orange-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}