"use client";

import Image from "next/image";
import { Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Appliance } from "@/types/solar";

interface ApplianceListProps {
  appliances: Appliance[];
  onRemove: (id: string) => void;
}

export default function ApplianceList({
  appliances,
  onRemove,
}: ApplianceListProps) {
  if (appliances.length === 0) {
    return (
      <Card className="border-dashed border-gray-300 shadow-sm">
        <CardContent className="py-8 sm:py-12 text-center text-muted-foreground">
          <div className="bg-orange-50 rounded-full p-4 w-fit mx-auto mb-3">
            <Zap className="text-orange-300" size={28} />
          </div>
          <p className="font-medium text-sm sm:text-base">No appliances added yet</p>
          <p className="text-xs sm:text-sm mt-1">
            Scan or enter appliance details to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalDailyWh = appliances.reduce(
    (sum, a) => sum + a.watts * a.hoursPerDay * a.quantity,
    0,
  );

  return (
    <Card className="shadow-md pb-4 mt-10">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <div className="bg-orange-100 p-1.5 rounded-lg">
            <Zap className="text-orange-500" size={18} />
          </div>
          Your Appliances ({appliances.length})
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Total daily consumption:{" "}
          <strong className="text-foreground">
            {totalDailyWh.toLocaleString()} Wh
          </strong>{" "}
          ({(totalDailyWh / 1000).toFixed(1)} kWh)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {appliances.map((a) => {
            const dailyWh = a.watts * a.hoursPerDay * a.quantity;
            return (
              <div
                key={a.id}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border bg-white hover:bg-gray-50 hover:shadow-sm transition-all"
              >
                {a.imageUrl && (
                  <Image
                    src={a.imageUrl}
                    alt={a.name}
                    width={40}
                    height={40}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border"
                    unoptimized
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm truncate">{a.name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {a.watts}W × {a.hoursPerDay}h × {a.quantity} ={" "}
                    <strong>{dailyWh.toLocaleString()} Wh/day</strong>
                    {a.surgeMultiplier > 1 && (
                      <span className="ml-1 sm:ml-2 text-amber-600">
                        ⚡ {a.surgeMultiplier}×
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => onRemove(a.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
