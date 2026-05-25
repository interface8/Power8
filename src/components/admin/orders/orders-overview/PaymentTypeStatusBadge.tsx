interface Props {
  status: string;
}

export default function PaymentTypeStatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    FULL: "bg-emerald-100 text-emerald-700",

    CREDIT: "bg-orange-100 text-amber-700",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-semibold
        ${styles[status] || "bg-gray-100 text-gray-700"}
      `}
    >
      {status}
    </span>
  );
}
