"use client";
import { ControlLog } from "@/types/admin-solar-system";
import { formatDate, actionConfig } from "./systemUtils";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useState } from "react";

interface ControlLogsProps {
  logs: ControlLog[];
}

export function ControlLogs({ logs }: ControlLogsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!logs || logs.length === 0) {
    return null;
  }

  const displayLogs = isExpanded ? logs : logs.slice(0, 1);

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Control Log Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
      >
        <Clock className="h-4 w-4" />
        <span>Control Log ({logs.length} entries)</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Log Entries */}
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {displayLogs.map((log, index) => {
            const config = actionConfig[log.action];
            const Icon = config.icon;
            return (
              <div key={log.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-700">{config.label}</span>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <div className="font-medium text-gray-600">{log.actorName || "System"}</div>
                    <div>{formatDate(log.createdAt)}</div>
                  </div>
                </div>
                {index < displayLogs.length - 1 && (
                  <hr className="my-3 border-gray-100" />
                )}
              </div>
            );
          })}
          {logs.length > 1 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium mt-2"
            >
              View all {logs.length} entries
            </button>
          )}
        </div>
      )}
    </div>
  );
}