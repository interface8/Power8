import { CreditStatus } from "@/types/credit-account-detail";

interface Props {
  status: CreditStatus;
}

export default function CreditStatusBadge({
  status,
}: Props) {
  const styles = {
    ACTIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    DEFAULTED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}