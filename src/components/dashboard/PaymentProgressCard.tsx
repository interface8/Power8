import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

interface PaymentProgress {
  totalPaid: number;
  totalRemaining: number;
  totalCost: number;
  monthsPaid: number;
  totalMonths: number;
}

interface PaymentProgressCardProps {
  paymentProgress?: PaymentProgress;
  isLoading?: boolean;
}

export function PaymentProgressCard({
  paymentProgress,
  isLoading,
}: PaymentProgressCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-green-950">
            Payment Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 px-8 pb-8">
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    totalPaid = 0,
    totalRemaining = 0,
    totalCost = 0,
    monthsPaid = 0,
    totalMonths = 0,
  } = paymentProgress || {};

  const percentage =
    totalMonths > 0 ? Math.round((monthsPaid / totalMonths) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-10">
        <CardTitle className="text-lg sm:text-2xl font-semibold text-green-950">
          Payment Progress
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 px-8 pb-8">
        {/* Installment Progress */}
        <div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted-foreground">
              {monthsPaid} / {totalMonths} months paid
            </span>
            <span className="font-medium">{percentage}%</span>
          </div>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-3 bg-green-900 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 pt-8 gap-4 md:gap-6">
          <div className="bg-green-50 rounded-2xl p-6 flex flex-col">
            <p className="text-sm text-muted-foreground">Total Paid</p>
            <p className="text-2xl font-bold text-green-600 mt-auto">
              ₦{totalPaid.toLocaleString()}
            </p>
          </div>

          <div className="bg-orange-50 rounded-2xl p-6 flex flex-col">
            <p className="text-sm text-muted-foreground">Remaining Balance</p>
            <p className="text-2xl font-bold text-orange-600 mt-auto">
              ₦{totalRemaining.toLocaleString()}
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 flex flex-col">
            <p className="text-sm text-muted-foreground">Total System Cost</p>
            <p className="text-2xl font-bold text-blue-600 mt-auto">
              ₦{totalCost.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
