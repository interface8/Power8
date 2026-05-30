import CreditStatusBadge from "./CreditStatusBadge";

interface Props {
  totalAmount: number;
  balanceRemaining: number;
  creditStatus: "ACTIVE" | "COMPLETED" | "DEFAULTED";
}

const currency = new Intl.NumberFormat(
  "en-NG",
  {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }
);

export default function CreditSummaryCards({
  totalAmount,
  balanceRemaining,
  creditStatus,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Total Amount
        </p>

        <h3 className="mt-2 text-2xl font-bold">
          {currency.format(totalAmount)}
        </h3>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Balance Remaining
        </p>

        <h3 className="mt-2 text-2xl font-bold">
          {currency.format(
            balanceRemaining
          )}
        </h3>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Credit Status
        </p>

        <div className="mt-3">
          <CreditStatusBadge
            status={creditStatus}
          />
        </div>
      </div>
    </div>
  );
}