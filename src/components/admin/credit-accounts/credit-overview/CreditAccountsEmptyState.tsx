import { CreditCard } from "lucide-react";

interface Props {
  status?: string;
}

export default function CreditAccountsEmptyState({
  status,
}: Props) {
  return (
    <div className="flex min-h-112.5 flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 rounded-full bg-orange-50 p-5">
        <CreditCard className="h-10 w-10 text-orange-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        No Credit Accounts Found
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        {status
          ? `No credit accounts found for ${status.toLowerCase()} status.`
          : "No credit accounts available at the moment."}
      </p>
    </div>
  );
}