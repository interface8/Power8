import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentData {
  status?: string;
  monthlyPayment?: string;
  nextDueDate?: string;
}

interface PaymentStatusCardProps {
  paymentData?: PaymentData;
  systemStatus?: "ACTIVE" | "LIMITED" | "DISABLED";
  isLoading?: boolean;
}

export function PaymentStatusCard({
  paymentData,
  systemStatus = "DISABLED", // default fallback
  isLoading,
}: PaymentStatusCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="text-lg font-semibold text-green-950">
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 px-8 pb-8">
          <div className="flex justify-center">
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const monthlyPayment = paymentData?.monthlyPayment ?? 0;
  const nextDueDate = paymentData?.nextDueDate;

  const formattedDate = nextDueDate
    ? new Date(nextDueDate).toLocaleDateString()
    : "N/A";

  // Determine badge color based on real status
  const getStatusBadge = () => {
    switch (systemStatus) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-500 text-white font-semibold text-md px-5 py-3 rounded-lg">
            ACTIVE
          </Badge>
        );
      case "LIMITED":
        return (
          <Badge className="bg-yellow-600 text-white font-semibold text-md px-5 py-3 rounded-lg">
            LIMITED
          </Badge>
        );
      case "DISABLED":
        return (
          <Badge className="bg-red-600 text-white font-semibold text-md px-5 py-3 rounded-lg">
            INACTIVE
          </Badge>
        );
      default:
        return (
          <Badge className="bg-red-600 text-white font-semibold text-md px-5 py-3 rounded-lg">
            INACTIVE
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-10">
        <CardTitle className="text-lg font-semibold text-green-950">
          Payment Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 px-8 pb-6">
        <div className="flex justify-center">{getStatusBadge()}</div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-base font-semibold text-green-950"> ₦{monthlyPayment.toLocaleString()}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Next Due Date</p>
            <p className="text-sm font-medium text-green-950">
              {formattedDate}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
