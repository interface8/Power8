"use client";

import { X } from "lucide-react";

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trackingNumber: string;
  shippingProvider: string;
  isLoading: boolean;
  onTrackingChange: (value: string) => void;
  onProviderChange: (value: string) => void;
}

const shippingProviders = [
  { value: "DHL", label: "DHL Express" },
  { value: "FedEx", label: "FedEx" },
  { value: "UPS", label: "UPS" },
  { value: "USPS", label: "USPS" },
  { value: "Aramex", label: "Aramex" },
];

export function ShippingModal({
  isOpen,
  onClose,
  onConfirm,
  trackingNumber,
  shippingProvider,
  isLoading,
  onTrackingChange,
  onProviderChange,
}: ShippingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="border-b border-gray-100 bg-linear-to-r from-orange-50/50 to-white px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Shipping Details</h3>
              <p className="mt-0.5 text-xs sm:text-sm text-gray-500">Add delivery tracking information</p>
            </div>
            <button 
              onClick={onClose} 
              className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 p-4 sm:p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Tracking Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => onTrackingChange(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Shipping Provider (Optional)</label>
            <select
              value={shippingProvider}
              onChange={(e) => onProviderChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all hover:bg-orange-50 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            >
              <option value="">Select provider</option>
              {shippingProviders.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!trackingNumber || isLoading}
              className="rounded-xl bg-orange-500 px-4 py-2.5 font-medium text-white transition-all hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Mark as Shipped"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}