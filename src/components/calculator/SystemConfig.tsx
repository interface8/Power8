"use client";

import { Settings, MapPin } from "lucide-react";
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
import type { SolarConfig, UsageProfile } from "@/types/solar";
import { getAllRegions, getSunHours } from "@/lib/solar-regions";

interface SystemConfigProps {
  config: SolarConfig;
  onChange: (config: SolarConfig) => void;
}

const regions = getAllRegions();

export default function SystemConfig({ config, onChange }: SystemConfigProps) {
  const handleCityChange = (city: string) => {
    const sunHours = getSunHours(city);
    onChange({
      ...config,
      location: city,
      ...(sunHours != null ? { peakSunHours: sunHours } : {}),
    });
  };

  return (
    <Card className="shadow-md pb-4">
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
          {/* City / Location */}
          <div>
            <Label className="flex items-center gap-1">
              <MapPin size={12} /> City
            </Label>
            <Select
              value={config.location || ""}
              onValueChange={handleCityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r.city} value={r.city}>
                    {r.city} ({r.peakSunHours}h)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Peak Sun Hours (auto-filled from city, still editable) */}
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

          {/* Usage Profile */}
          <div>
            <Label>Usage Profile</Label>
            <Select
              value={config.usageProfile}
              onValueChange={(v) =>
                onChange({ ...config, usageProfile: v as UsageProfile })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home (1.0×)</SelectItem>
                <SelectItem value="business">Business (1.3×)</SelectItem>
                <SelectItem value="school">School (0.5×)</SelectItem>
                <SelectItem value="restaurant">Restaurant (1.5×)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Days of Autonomy */}
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

          {/* System Voltage */}
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

          {/* Battery Type */}
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

          {/* Panel Rating */}
          <div>
            <Label htmlFor="panelRating">Panel Rating (W)</Label>
            <Input
              id="panelRating"
              type="number"
              min="100"
              max="1000"
              step="50"
              value={config.panelRating}
              onChange={(e) =>
                onChange({
                  ...config,
                  panelRating: parseInt(e.target.value, 10) || 550,
                })
              }
            />
          </div>

          {/* Battery Unit Ah */}
          <div>
            <Label htmlFor="batteryUnit">Battery Unit (Ah)</Label>
            <Input
              id="batteryUnit"
              type="number"
              min="50"
              max="500"
              step="50"
              value={config.batteryUnitAh}
              onChange={(e) =>
                onChange({
                  ...config,
                  batteryUnitAh: parseInt(e.target.value, 10) || 200,
                })
              }
            />
          </div>

          {/* Electricity Rate */}
          <div className="sm:col-span-2">
            <Label htmlFor="electricityRate">Electricity Rate (₦/kWh)</Label>
            <Input
              id="electricityRate"
              type="number"
              min="10"
              max="500"
              step="5"
              value={config.electricityRate}
              onChange={(e) =>
                onChange({
                  ...config,
                  electricityRate: parseFloat(e.target.value) || 70,
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
