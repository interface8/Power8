import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface Schedule {
  id: string;
  dueDate: string; 
  amount: number;
  status: "PENDING" | "PAID" | "OVERDUE";
}

interface Props {
  schedules?: Schedule[];
  isLoading?: boolean;
}

export function UpcomingPaymentsCard({
  schedules = [],
  isLoading = false,
}: Props) {
  if (isLoading) {
    return <div>Loading upcoming payments...</div>;
  }

  //Only show upcoming (not paid)
  const upcoming = schedules.filter(
    (s) => s.status === "PENDING" || s.status === "OVERDUE"
  );

  //Sort by nearest date
  const sorted = upcoming.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <Card>
      <CardHeader className="p-8">
        <CardTitle className="text-xl sm:text-2xl font-bold text-green-950">
          Upcoming Payments
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 sm:px-6 md:px-8 pb-8 space-y-3">
        {sorted.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming payments</p>
        ) : (
          sorted.map((payment, index) => {
            const dueDate = new Date(payment.dueDate);

            // ✅ Due soon logic (within 3 days)
            const isDueSoon =
              dueDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

            return (
              <div
                key={payment.id}
                className={`flex items-center justify-between p-5 sm:p-6 rounded-2xl border ${
                  isDueSoon
                    ? "border-2 border-orange-400 bg-orange-50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <Calendar
                    size={20}
                    className={
                      isDueSoon ? "text-orange-500" : "text-gray-500"
                    }
                  />

                  <div>
                    <p className="font-medium text-md sm:text-xl text-green-950">
                      Payment #{index + 1}
                    </p>
                    <p className="text-sm text-gray-900">
                      {dueDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-base sm:text-lg">
                    ₦{payment.amount.toLocaleString()}
                  </p>

                  {isDueSoon && (
                    <Badge className="bg-orange-500 text-white text-xs mt-1">
                      Due Soon
                    </Badge>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}