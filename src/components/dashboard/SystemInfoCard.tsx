import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, Zap, Calendar, Package, Home } from "lucide-react";

interface SystemInfoCardProps {
  systemId: string;
  installDate: string;
  address: string;
  products: Array<{ name: string; qty: number }>;
}

export function SystemInfoCard({
  systemId,
  installDate,
  address,
  products,
}: SystemInfoCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* System Status Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-6 px-8">
        <CardTitle className="text-lg sm:text-2xl font-bold text-green-950">
          System Status
        </CardTitle>
        <div className="flex items-center gap-2 text-green-600">
          <Power size={25} />
          <span className="font-medium text-base sm:text-xl">Active</span>
        </div>
      </CardHeader>

      {/* System ID & Install Date */}
      <CardContent className="px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-blue-50 rounded-2xl p-5 md:p-6">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Zap size={20} className="text-blue-600" /> System ID
            </p>
            <p className="font-bold font-mono text-xl sm:text-2xl text-green-950 mt-2">
              {systemId}
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-5 md:p-6">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar size={20} className="text-green-500" /> Install Date
            </p>
            <p className="font-bold text-xl sm:text-2xl font-mono text-green-950 mt-2">
              {installDate}
            </p>
          </div>
        </div>
      </CardContent>

      <div className="h-px bg-gray-200 mx-8" />

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
                <p className="font-medium text-base sm:text-lg text-green-950 truncate">
                  {product.name}
                </p>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="text-sm sm:text-base px-4 py-0.5"
            >
              Qty: {product.qty}
            </Badge>
          </div>
        ))}
      </CardContent>

      <div className="h-px bg-gray-200 mx-8" />

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
