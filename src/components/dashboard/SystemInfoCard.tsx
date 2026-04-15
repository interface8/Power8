import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Power,
  Zap,
  Calendar,
  Package,
  Home,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SystemInfoCardProps {
  systemId: string;
  installDate: string;
  address: string;
  products: Array<{ name: string; qty: number }>;
  systemStatus?: "ACTIVE" | "LIMITED" | "DISABLED" | null;
  isLoading?: boolean;
}

export function SystemInfoCard({
  systemId,
  installDate,
  address,
  products,
  systemStatus,
  isLoading,
}: SystemInfoCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Determine status display
  const currentStatus = systemStatus || "DISABLED";

  const statusConfig = {
    ACTIVE: {
      color: "text-green-600",
      icon: Power,
      label: "Active",
    },
    LIMITED: {
      color: "text-yellow-600",
      icon: AlertTriangle,
      label: "Limited",
    },
    DISABLED: {
      color: "text-red-600",
      icon: XCircle,
      label: "Inactive",
    },
  };

  const config = statusConfig[currentStatus as keyof typeof statusConfig];
  const StatusIcon = config.icon;
  return (
    <Card className="overflow-hidden">
      {/* System Status Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-6 px-6 md:px-8">
        <CardTitle className="text-lg sm:text-2xl font-bold text-green-950">
          System Status
        </CardTitle>

        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl font-medium text-sm sm:text-base ${config.color}`}
        >
          <StatusIcon size={22} />
          <span>{config.label}</span>
        </div>
      </CardHeader>

      {/* System ID + Install Date */}
      <CardContent className="px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-blue-50 rounded-2xl p-5 md:p-6">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Zap size={20} className="text-blue-600" /> System ID
            </p>
            <p className="font-semibold text-lg sm:text-1xl text-green-950 mt-2">
              {systemId}
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-5 md:p-6">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar size={20} className="text-green-500" /> Install Date
            </p>
            <p className="font-semibold text-lg sm:text-1xl text-green-950 mt-2">
              {installDate}
            </p>
          </div>
        </div>
      </CardContent>
      <div className="h-px bg-gray-200 mx-6 md:mx-8" />

      {/* Installed Products */}
      <CardHeader className="px-5 sm:px-6 md:px-8 pt-8 pb-4">
        <CardTitle className="text-green-950 font-semibold text-lg sm:text-2xl ">
          Installed Products
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 sm:px-6 md:px-8 pb-8 space-y-3">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-4 px-5 bg-gray-50 rounded-xl min-h-17"
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-1  min-w-0">
              <Package size={20} className="text-orange-600" />

              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-md md:text-lg text-green-950 truncate">
                  {product.name}
                </p>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="text-xs sm:text-sm md:text-base px-2 py-0.5"
            >
              Qty: {product.qty}
            </Badge>
          </div>
        ))}
      </CardContent>

      <div className="h-px bg-gray-200 mx-6 md:mx-8" />

      {/* Installation Address */}
      <CardContent className="px-8 pb-10">
        <div className="bg-gray-50 rounded-lg p-6 space-y-1">
          <p className="text-sm flex items-center gap-3 text-muted-foreground">
            <Home size={16} className="text-green-950" /> Installation Addresss
          </p>
          <p className="text-base font-medium text-green-950">{address}</p>
        </div>
      </CardContent>
    </Card>
  );
}
