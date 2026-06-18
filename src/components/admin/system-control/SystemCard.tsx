"use client";

import { System, ControlAction, ControlLog } from "@/types/admin-system";
import { statusConfig, getSystemLogs } from "./systemUtils";
import { ControlLogs } from "./ControlLogs";
import { Zap, Power, AlertCircle } from "lucide-react";

interface SystemCardProps {
  system: System;
  logs: ControlLog[];
  onAction: (system: System, action: ControlAction) => void;
}

export function SystemCard({ system, logs, onAction }: SystemCardProps) {
  const status = statusConfig[system.status];
  const systemLogs = getSystemLogs(system.id, logs);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow relative">
      {/* Status Label - Top Right with background color */}
      <div className="absolute top-4 right-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${status.bgColor} ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      {/* Customer Info - Top Left with dot */}
      <div className="flex flex-col gap-0.5 pr-24">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${status.dotColor} shrink-0`}
          />
          <h3 className="text-base font-semibold text-gray-900">
            {system.customerName}
          </h3>
        </div>
        <p className="text-sm text-gray-500">{system.bundleName}</p>
        <p className="text-xs text-gray-400 font-mono">{system.deviceId}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-5">
        <div className="grid grid-cols-3 gap-2  bg-white p-2">
          {/* Enable */}
          <button
            onClick={() => onAction(system, "ENABLE")}
            disabled={system.status === "ENABLED"}
            className={`
        flex h-10 items-center justify-center gap-2 rounded-lg
        border text-sm font-medium transition-all
        ${
          system.status === "ENABLED"
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-green-200 text-green-600 hover:bg-green-100"
        }
      `}
          >
            <Zap className="h-4 w-4" />
            Enable
          </button>

          {/* Limit */}
          <button
            onClick={() => onAction(system, "LIMIT")}
            disabled={
              system.status === "LIMITED" || system.status === "DISABLED"
            }
            className={`
        flex h-10 items-center justify-center gap-2 rounded-lg
        border text-sm font-medium transition-all
        ${
          system.status === "LIMITED" || system.status === "DISABLED"
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-amber-200  text-amber-600 hover:bg-amber-100"
        }
      `}
          >
            <AlertCircle className="h-4 w-4" />
            Limit
          </button>

          {/* Disable */}
          <button
            onClick={() => onAction(system, "DISABLE")}
            disabled={system.status === "DISABLED"}
            className={`
        flex h-10 items-center justify-center gap-2 rounded-lg
        border text-sm font-medium transition-all
        ${
          system.status === "DISABLED"
            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
            : "border-red-200  text-red-600 hover:bg-red-100"
        }
      `}
          >
            <Power className="h-4 w-4" />
            Disable
          </button>
        </div>
      </div>

      {/* Control Logs */}
      <ControlLogs logs={systemLogs} />
    </div>
  );
}
