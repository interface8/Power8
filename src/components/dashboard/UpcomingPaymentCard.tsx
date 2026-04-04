import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const upcomingPayments = [
  { id: 4, date: "3/15/2026", amount: "₦35,000", isDueSoon: true },
  { id: 5, date: "4/15/2026", amount: "₦35,000", isDueSoon: false },
  { id: 6, date: "5/15/2026", amount: "₦35,000", isDueSoon: false },
];

export function UpcomingPaymentsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-950">
          Upcoming Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pb-8 space-y-3">
        {upcomingPayments.map((payment) => (
          <div
            key={payment.id}
            className={`flex items-center justify-between p-5 rounded-2xl border ${
              payment.isDueSoon
                ? "border-orange-200 bg-orange-50"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div>
                {" "}
                <Calendar
                  size={20}
                  className={`${
                    payment.isDueSoon ? "text-orange-500" : " text-gray-500"
                  }`}
                />
              </div>
              <div>
                <p className="font-medium text-green-950">
                  Payment #{payment.id}
                </p>
                <p className="text-sm text-muted-foreground">{payment.date}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-lg">{payment.amount}</p>
              {payment.isDueSoon && (
                <Badge className="bg-orange-500 text-white text-xs mt-1">
                  Due Soon
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
