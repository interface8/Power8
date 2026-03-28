"use client";

import { useRef, useState } from "react";
import { Camera, Upload, Loader2, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { extractApplianceData } from "@/lib/ocr";
import { detectCategory } from "@/lib/appliance-profiles";
import type { Appliance, OCRResult } from "@/types/solar";

interface ApplianceScannerProps {
  onAdd: (appliance: Appliance) => void;
}

export default function ApplianceScanner({ onAdd }: ApplianceScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form fields (editable after OCR)
  const [name, setName] = useState("");
  const [watts, setWatts] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [surgeMultiplier, setSurgeMultiplier] = useState("1");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setError(null);
    setScanning(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const result = await extractApplianceData(file);
      setOcrResult(result);

      if (result.extractedWatts) {
        setWatts(String(result.extractedWatts));
      }

      // Auto-fill from detected category
      if (result.detectedCategory) {
        const profile = detectCategory(result.detectedCategory);
        if (profile) {
          if (!name) setName(profile.category);
          setSurgeMultiplier(String(profile.defaultSurgeMultiplier));
          setHoursPerDay(String(profile.defaultHoursPerDay));
        }
      }
    } catch {
      setError("Failed to scan image. Please enter details manually.");
    } finally {
      setScanning(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleAddAppliance = () => {
    const wattsNum = parseFloat(watts);
    const hoursNum = parseFloat(hoursPerDay);
    const qtyNum = parseInt(quantity, 10);
    const surgeNum = parseFloat(surgeMultiplier);

    if (!name.trim()) {
      setError("Please enter an appliance name.");
      return;
    }
    if (!wattsNum || wattsNum <= 0) {
      setError("Please enter a valid wattage.");
      return;
    }
    if (!hoursNum || hoursNum <= 0 || hoursNum > 24) {
      setError("Please enter valid hours (1-24).");
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      watts: wattsNum,
      hoursPerDay: hoursNum,
      quantity: qtyNum || 1,
      surgeMultiplier: surgeNum || 1,
      imageUrl: previewUrl ?? undefined,
    });

    // Reset form
    setName("");
    setWatts("");
    setHoursPerDay("");
    setQuantity("1");
    setSurgeMultiplier("1");
    setOcrResult(null);
    setPreviewUrl(null);
    setError(null);
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setOcrResult(null);
  };

  return (
    <Card className="mt-10 pb-5 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <div className="bg-orange-100 p-1.5 rounded-lg">
            <Camera className="text-orange-500" size={18} />
          </div>
          Scan Appliance Label
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Take a photo or upload an image of the appliance label to
          auto-extract power details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Image upload buttons */}
        <div className="flex gap-2 sm:gap-3">
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleInputChange}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-orange-300 hover:bg-orange-50 text-xs sm:text-sm h-10 sm:h-11"
            onClick={() => cameraInputRef.current?.click()}
            disabled={scanning}
          >
            <Camera size={16} />
            <span className="hidden xs:inline">Use</span> Camera
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-orange-300 hover:bg-orange-50 text-xs sm:text-sm h-10 sm:h-11"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning}
          >
            <Upload size={16} />
            Upload <span className="hidden xs:inline">Image</span>
          </Button>
        </div>

        {/* Scanning indicator */}
        {scanning && (
          <div className="flex items-center justify-center gap-2 py-4 sm:py-6 text-orange-600 bg-orange-50 rounded-xl border border-orange-200">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-xs sm:text-sm font-medium">
              Scanning label with OCR...
            </span>
          </div>
        )}

        {/* Preview + OCR result */}
        {previewUrl && !scanning && (
          <div className="relative rounded-lg border border-orange-200 overflow-hidden">
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white"
            >
              <X size={14} />
            </button>
            <img
              src={previewUrl}
              alt="Appliance label"
              className="w-full max-h-48 object-contain bg-gray-50"
            />
            {ocrResult && (
              <div className="p-3 bg-orange-50 border-t border-orange-200 space-y-1">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  {ocrResult.extractedWatts ? (
                    <>
                      <Check size={14} className="text-green-600" />
                      <span>
                        Detected:{" "}
                        <strong>{ocrResult.extractedWatts}W</strong>
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="text-amber-600" />
                      <span>
                        Could not detect wattage. Please enter manually.
                      </span>
                    </>
                  )}
                  {/* Confidence tier badge */}
                  <Badge
                    variant="outline"
                    className={`ml-auto text-xs ${
                      ocrResult.adjustedConfidence >= 70
                        ? "border-green-400 text-green-700 bg-green-50"
                        : ocrResult.adjustedConfidence >= 40
                          ? "border-amber-400 text-amber-700 bg-amber-50"
                          : "border-red-400 text-red-700 bg-red-50"
                    }`}
                  >
                    {Math.round(ocrResult.adjustedConfidence)}% confidence
                  </Badge>
                </div>
                {/* Confidence warning messages */}
                {ocrResult.adjustedConfidence < 40 && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Low confidence — please verify values manually
                  </p>
                )}
                {ocrResult.adjustedConfidence >= 40 &&
                  ocrResult.adjustedConfidence < 70 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Moderate confidence — review values before adding
                    </p>
                  )}
                {/* Category badge */}
                {ocrResult.detectedCategory && (
                  <div className="flex items-center gap-1">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                      {ocrResult.detectedCategory}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      Auto-filled defaults
                    </span>
                  </div>
                )}
                {ocrResult.extractedAmps && ocrResult.extractedVolts && (
                  <p className="text-xs text-muted-foreground">
                    Also found: {ocrResult.extractedAmps}A ×{" "}
                    {ocrResult.extractedVolts}V ={" "}
                    {Math.round(
                      ocrResult.extractedAmps * ocrResult.extractedVolts,
                    )}
                    W
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual entry fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="sm:col-span-2">
            <Label htmlFor="name" className="text-xs sm:text-sm">Appliance Name</Label>
            <Input
              id="name"
              placeholder="e.g. LED Bulb, Fridge, TV"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="watts" className="text-xs sm:text-sm">Power (Watts)</Label>
            <Input
              id="watts"
              type="number"
              min="0"
              placeholder="e.g. 100"
              value={watts}
              onChange={(e) => setWatts(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hours" className="text-xs sm:text-sm">Hours / Day</Label>
            <Input
              id="hours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              placeholder="e.g. 5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="qty" className="text-xs sm:text-sm">Quantity</Label>
            <Input
              id="qty"
              type="number"
              min="1"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="surge" className="text-xs sm:text-sm">Surge Multiplier</Label>
            <Input
              id="surge"
              type="number"
              min="1"
              max="5"
              step="0.5"
              placeholder="1 (no motor) / 3-5"
              value={surgeMultiplier}
              onChange={(e) => setSurgeMultiplier(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}

        <Button
          onClick={handleAddAppliance}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10 sm:h-11 text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
          disabled={scanning}
        >
          Add Appliance
        </Button>
      </CardContent>
    </Card>
  );
}
