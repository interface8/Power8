"use client";

import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { SolarConfig } from "@/types/solar";

interface SystemConfigProps {
  config: SolarConfig;
  onChange: (config: SolarConfig) => void;
}

export default function SystemConfig({ config, onChange }: SystemConfigProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <div className="bg-gray-100 p-1.5 rounded-lg">
            <Settings className="text-gray-500" size={18} />
          </div>
          System Configuration
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Adjust parameters to match your location and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <Label htmlFor="sunHours">Peak Sun Hours</Label>
            <Input
              id="sunHours"
              type="number"
              min="1"
              max="12"
              step="0.5"
              value={config.peakSunHours}
              onChange={(e) =>
                onChange({
                  ...config,
                  peakSunHours: parseFloat(e.target.value) || 4,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="autonomy">Days of Autonomy</Label>
            <Input
              id="autonomy"
              type="number"
              min="1"
              max="7"
              value={config.daysOfAutonomy}
              onChange={(e) =>
                onChange({
                  ...config,
                  daysOfAutonomy: parseInt(e.target.value, 10) || 1,
                })
              }
            />
          </div>
          <div>
            <Label>System Voltage</Label>
            <Select
              value={String(config.systemVoltage)}
              onValueChange={(v) =>
                onChange({
                  ...config,
                  systemVoltage: parseInt(v, 10) as 12 | 24 | 48,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12V</SelectItem>
                <SelectItem value="24">24V</SelectItem>
                <SelectItem value="48">48V</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Battery Type</Label>
            <Select
              value={config.batteryType}
              onValueChange={(v) =>
                onChange({
                  ...config,
                  batteryType: v as "lead-acid" | "lithium",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lithium">Lithium (0.9 DoD)</SelectItem>
                <SelectItem value="lead-acid">
                  Lead-Acid (0.5 DoD)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
