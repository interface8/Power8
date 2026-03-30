"use client";

import {
  Sun,
  Battery,
  Zap,
  PlugZap,
  TrendingUp,
  AlertTriangle,
  CircleDollarSign,
  BarChart3,
  Layers,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { SolarResults, SolarConfig } from "@/types/solar";

interface SolarResultsDisplayProps {
  results: SolarResults;
  config: SolarConfig;
}

export default function SolarResultsDisplay({
  results,
  config,
}: SolarResultsDisplayProps) {
  return (
    <div className="space-y-4">
      <Card className="p-5 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded-lg">
              <TrendingUp className="text-green-600" size={18} />
            </div>
            Solar System Recommendation
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Based on your {results.totalDailyWh.toLocaleString()} Wh daily load
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Solar Panels */}
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Sun className="text-yellow-500" size={16} />
                <h3 className="font-semibold text-xs sm:text-sm">Solar Panels</h3>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {results.numberOfPanels} panels
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                {results.solarPanelWatts.toLocaleString()}W total ({config.panelRating}W each)
              </p>
            </div>

            {/* Inverter */}
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <PlugZap className="text-blue-500" size={16} />
                <h3 className="font-semibold text-xs sm:text-sm">Inverter</h3>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {results.inverterSize.toLocaleString()} W
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Run: {results.totalRunningWatts}W | Surge:{" "}
                {results.totalSurgeWatts}W
              </p>
            </div>

            {/* Battery Bank */}
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Battery className="text-green-500" size={16} />
                <h3 className="font-semibold text-xs sm:text-sm">Battery Bank</h3>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {results.numberOfBatteries} units
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                {results.batteryCapacityAh}Ah total ({config.batteryUnitAh}Ah each)
              </p>
            </div>

            {/* Daily Consumption */}
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Zap className="text-orange-500" size={16} />
                <h3 className="font-semibold text-xs sm:text-sm">Daily Usage</h3>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">
                {(results.totalDailyWh / 1000).toFixed(1)} kWh
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                {results.totalDailyWh.toLocaleString()} Wh per day
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production & Savings */}
      <Card className="p-5 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-md">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <div className="bg-purple-100 p-1.5 rounded-lg">
              <BarChart3 className="text-purple-600" size={18} />
            </div>
            Production &amp; Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-purple-200 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Layers className="text-purple-500" size={14} />
                <h3 className="font-semibold text-xs sm:text-sm">Monthly</h3>
              </div>
              <p className="text-lg sm:text-xl font-bold text-purple-600">
                {(results.monthlyProductionWh / 1000).toFixed(0)} kWh
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-purple-200 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Layers className="text-purple-500" size={14} />
                <h3 className="font-semibold text-xs sm:text-sm">Annual</h3>
              </div>
              <p className="text-lg sm:text-xl font-bold text-purple-600">
                {(results.annualProductionWh / 1000).toFixed(0)} kWh
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <CircleDollarSign className="text-emerald-500" size={14} />
                <h3 className="font-semibold text-xs sm:text-sm">Annual Savings</h3>
              </div>
              <p className="text-lg sm:text-xl font-bold text-emerald-600">
                ₦{results.annualSavingsNGN.toLocaleString()}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <CircleDollarSign className="text-emerald-500" size={14} />
                <h3 className="font-semibold text-xs sm:text-sm">System Cost</h3>
              </div>
              <p className="text-lg sm:text-xl font-bold text-emerald-600">
                ₦{results.estimatedSystemCost.toLocaleString()}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Estimated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="p-5 border-amber-200 bg-amber-50/50">
        <CardContent className="py-3 sm:py-4">
          <div className="flex gap-2 items-start">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />
            <div className="space-y-1">
              <p className="font-medium text-amber-800 text-xs sm:text-sm">
                Tips for Accuracy
              </p>
              <ul className="text-amber-700 space-y-0.5 list-disc list-inside text-[10px] sm:text-xs">
                <li>
                  Fridges cycle on/off — assume 12-16h runtime, not 24h
                </li>
                <li>
                  Use pure sine wave inverters for sensitive electronics
                </li>
                <li>
                  {config.safetyFactor}× safety factor prevents system crashes
                </li>
                <li>
                  {((config.efficiencyLoss - 1) * 100).toFixed(0)}% buffer for
                  dust, heat &amp; wire losses included
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
