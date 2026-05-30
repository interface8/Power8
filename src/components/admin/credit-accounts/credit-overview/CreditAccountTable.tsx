import { CreditAccount } from "@/types/credit-account";

import CreditAccountRow from "./CreditAccountRow";

interface Props {
  accounts: CreditAccount[];
}

export default function CreditAccountsTable({ accounts }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-237.5">
        <div className="grid grid-cols-6 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          <div>Customer</div>
          <div>Total Amount</div>
          <div>Balance Remaining</div>
          <div>Duration</div>
          <div>Status</div>
          <div>Repayment</div>
        </div>

        <div>
          {accounts.map((account) => (
            <CreditAccountRow key={account.id} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
}
