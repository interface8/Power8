import { SavingType, formatCurrency, formatDateForDisplay } from "./utils";

interface UserSavingsTableProps {
  savings: SavingType[];
}

export function UserSavingsTable({ savings }: UserSavingsTableProps) {
  if (savings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No savings account data available
      </div>
    );
  }

  return (
    <div className="w-full min-w-125">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">SYSTEM ID</th>
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">ESTIMATED ANNUAL SAVINGS</th>
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">DATE</th>
          </tr>
        </thead>
        <tbody>
          {savings.map((saving) => (
            <tr key={saving.id} className="border-b border-gray-50">
              <td className="py-3 text-xs sm:text-sm text-gray-600 truncate">{saving.systemId}</td>
              <td className="py-3 text-xs sm:text-sm text-gray-600">{formatCurrency(saving.estimatedAnnualSavings || 0)}</td>
              <td className="py-3 text-xs sm:text-sm text-gray-600">{formatDateForDisplay(saving.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}