import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const paymentData = {
  status: "ACTIVE",
  monthlyPayment: "₦35,000",
  nextDueDate: "2026-03-15",
};

export function PaymentStatusCard() {
  return (
    <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-lg font-semibold text-green-950">
                Payment Status
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-4">
              <div className="flex justify-center">
                <Badge className="bg-green-500 text-white font-bold text-lg px-5 py-2.5 rounded-xl">
                  {paymentData.status}
                </Badge>
              </div>

              {/* Payment Details */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Monthly Payment:
                  </p>
                  <p className="text-base font-bold text-green-950">
                    {paymentData.monthlyPayment}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Next Due Date:
                  </p>
                  <p className="text-base">{paymentData.nextDueDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
  );
}
