"use client";

import { useEffect } from "react";
import { X, AlertTriangle, Zap, Power, AlertCircle } from "lucide-react";
import { System, ControlAction } from "@/types/admin-system";
import { actionConfig, statusConfig } from "./systemUtils";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  system: System | null;
  action: ControlAction | null;
  isLoading: boolean;
}

const actionIcons = {
  ENABLE: Zap,
  DISABLE: Power,
  LIMIT: AlertCircle,
};

export function ActionModal({
  isOpen,
  onClose,
  onConfirm,
  system,
  action,
  isLoading,
}: ActionModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !system || !action) return null;

  const config = actionConfig[action];
  const status = statusConfig[system.status];
  const StatusIcon = status.icon;
  const ActionIcon = actionIcons[action];
  const isDisable = action === "DISABLE";

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Figma style */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isDisable ? "bg-red-100" : "bg-orange-100"
                }`}
              >
                {isDisable ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : (
                  <ActionIcon className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {config.label}
                </h2>
                <p className="text-sm text-gray-500">
                  {system.customerName} — {system.bundleName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content - Figma style */}
          <div className="p-6">
            {/* Current Status - Figma shows this */}
            <div className="flex items-center gap-2 mb-4">
              <StatusIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Current Status:</span>
              <span className={`text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{config.description}</p>

            {/* Warning for Disable - Figma red alert box */}
            {isDisable && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-600">{config.warning}</p>
                </div>
              </div>
            )}

            {/* Buttons - Figma Cancel + Confirm */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all ${
                  isDisable
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-orange-500 hover:bg-orange-600"
                } disabled:opacity-50`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  `Confirm — ${action === "ENABLE" ? "Enable" : action === "DISABLE" ? "Disable" : "Limit"}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}