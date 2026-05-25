interface Props {
  status: string;
}

export default function PaymentStatusBadge({
  status,
}: Props) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",

    PARTIALLY_PAID:
      "bg-orange-100 text-orange-700",

    PAID: "bg-green-100 text-green-700",

    FAILED: "bg-red-100 text-red-700",

    REFUNDED: "bg-gray-200 text-gray-700",
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