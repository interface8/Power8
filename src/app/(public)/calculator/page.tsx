"use client";

import { useState, useMemo } from "react";
import { Sun, Zap, Camera, ArrowDown, Save, Loader2, Download } from "lucide-react";
import ApplianceScanner from "@/components/calculator/ApplianceScanner";
import ApplianceList from "@/components/calculator/ApplianceList";
import SystemConfig from "@/components/calculator/SystemConfig";
import SolarResultsDisplay from "@/components/calculator/SolarResultsDisplay";
import { calculateSolar } from "@/lib/solar-calculator";
import { Button } from "@/components/ui/button";
import { useSaveSolarCalculation } from "@/hooks/use-solar-calculations";
import { useAuth } from "@/components/providers/auth-provider";
import type { Appliance, SolarConfig } from "@/types/solar";

export default function CalculatorPage() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [config, setConfig] = useState<SolarConfig>({
    peakSunHours: 4,
    daysOfAutonomy: 1,
    systemVoltage: 24,
    batteryType: "lithium",
    safetyFactor: 1.25,
    efficiencyLoss: 1.3,
    panelRating: 550,
    batteryUnitAh: 200,
    electricityRate: 70,
    location: "",
    usageProfile: "home",
  });

  const results = useMemo(
    () => (appliances.length > 0 ? calculateSolar(appliances, config) : null),
    [appliances, config],
  );

  const addAppliance = (appliance: Appliance) => {
    setAppliances((prev) => [...prev, appliance]);
  };

  const removeAppliance = (id: string) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  };

  const user = useAuth();
  const { save, loading: saving } = useSaveSolarCalculation();
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSave = async () => {
    const result = await save({ appliances, config });
    if (result.data) {
      const data = result.data as { data: { id: string } };
      setSavedId(data.data.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50/30 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 text-white py-10 sm:py-14 md:py-16 px-4 sm:px-6">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5 shadow-lg">
            <Sun size={28} className="sm:hidden" />
            <Sun size={36} className="hidden sm:block" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Solar Setup Calculator
          </h1>
          <p className="mt-2 sm:mt-3 text-white/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Snap your appliance labels or enter details manually to size the
            perfect solar panel, inverter &amp; battery system.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-5 sm:mt-6">
            {[
              { icon: Camera, text: "OCR Scanning" },
              { icon: Zap, text: "Instant Results" },
              { icon: ArrowDown, text: "Auto-Calculate" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/95 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-white/20"
              >
                <Icon size={14} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-5 sm:-mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left column: Scanner + Config */}
          <div className="space-y-4 sm:space-y-6">
            <ApplianceScanner onAdd={addAppliance} />
            <SystemConfig config={config} onChange={setConfig} />
          </div>

          {/* Right column: Appliance list */}
          <div>
            <ApplianceList
              appliances={appliances}
              onRemove={removeAppliance}
            />
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="mt-6 sm:mt-8">
            <SolarResultsDisplay results={results} config={config} />

            {/* Save & Download buttons — only for authenticated users */}
            {user && (
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving || !!savedId}
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                >
                  {saving ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    <Save className="mr-2" size={16} />
                  )}
                  {savedId ? "Saved!" : saving ? "Saving..." : "Save Calculation"}
                </Button>

                {savedId && (
                  <Button
                    variant="outline"
                    className="border-orange-300 hover:bg-orange-50"
                    asChild
                  >
                    <a
                      href={`/api/solar-calculations/${savedId}/pdf`}
                      download
                    >
                      <Download className="mr-2" size={16} />
                      Download PDF
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
