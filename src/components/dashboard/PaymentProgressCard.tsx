import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const paymentProgress = {
  monthsPaid: 3,
  totalMonths: 12,
  percentage: 25,
  totalPaid: "₦195,000",
  remainingBalance: "₦255,000",
  totalSystemCost: "₦450,000",
};

export function PaymentProgressCard() {
  return (
    <Card>
      <CardHeader className="pb-10">
        <CardTitle className="text-lg sm:text-2xl font-semibold text-green-950">
          Payment progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-8">
        <div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted-foreground">
              {paymentProgress.monthsPaid} of {paymentProgress.totalMonths}{" "}
              months paid
            </span>
            <span className="font-medium">{paymentProgress.percentage}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-3 bg-green-900 rounded-full"
              style={{ width: `${paymentProgress.percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 pt-8 gap-4 md:gap-6">
          <div className="bg-green-50 rounded-2xl p-6 md:p-7 flex flex-col">
            <p className="text-sm text-muted-foreground">Total Paid</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-auto">
              {paymentProgress.totalPaid}
            </p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-6 md:p-7 flex flex-col">
            <p className="text-sm text-muted-foreground">Remaining Balance</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-auto">
              {paymentProgress.remainingBalance}
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 md:p-7 flex flex-col">
            <p className="text-sm text-muted-foreground">Total System Cost</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-auto">
              {paymentProgress.totalSystemCost}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
