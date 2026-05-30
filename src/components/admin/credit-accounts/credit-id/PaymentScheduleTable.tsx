import { PaymentSchedule } from "@/types/credit-account-detail";

import PaymentStatusBadge from "./PaymentStatusBadge";

interface Props {
  payments: PaymentSchedule[];
}

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function PaymentScheduleTable({ payments }: Props) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-5">
        <h2 className="text-lg font-semibold">Payment Schedule</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-162.5">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-5 py-4 text-left">Due Date</th>

              <th className="px-5 py-4 text-left">Amount Due</th>

              <th className="px-5 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className={
                  payment.status === "OVERDUE"
                    ? "border-b bg-red-50"
                    : "border-b"
                }
              >
                <td className="px-5 py-4">{payment.dueDate}</td>

                <td className="px-5 py-4">
                  {currency.format(payment.amountDue)}
                </td>

                <td className="px-5 py-4">
                  <PaymentStatusBadge status={payment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
