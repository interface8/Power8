"use client";

import { Package, ChevronRight } from "lucide-react";
import { OrderStatus } from "@/types/order";

interface OrderStatusControlProps {
  currentStatus: OrderStatus;
  onUpdateStatus: (status: OrderStatus) => void;
  isLoading: boolean;
}

// Define allowed transitions based on your backend service.ts
const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const statusColors: Record<OrderStatus, { bg: string; active: string; text: string }> = {
  PENDING: { bg: "bg-yellow-50 hover:bg-yellow-100", active: "bg-yellow-500", text: "text-yellow-700" },
  CONFIRMED: { bg: "bg-blue-50 hover:bg-blue-100", active: "bg-blue-500", text: "text-blue-700" },
  PROCESSING: { bg: "bg-purple-50 hover:bg-purple-100", active: "bg-purple-500", text: "text-purple-700" },
  SHIPPED: { bg: "bg-indigo-50 hover:bg-indigo-100", active: "bg-indigo-500", text: "text-indigo-700" },
  DELIVERED: { bg: "bg-green-50 hover:bg-green-100", active: "bg-green-500", text: "text-green-700" },
  COMPLETED: { bg: "bg-emerald-50 hover:bg-emerald-100", active: "bg-emerald-500", text: "text-emerald-700" },
  CANCELLED: { bg: "bg-red-50 hover:bg-red-100", active: "bg-red-500", text: "text-red-700" },
};

export function OrderStatusControl({ currentStatus, onUpdateStatus, isLoading }: OrderStatusControlProps) {
  const availableStatuses = allowedTransitions[currentStatus] || [];
  const isLocked = availableStatuses.length === 0 && currentStatus !== "PENDING";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 bg-linear-to-r from-orange-50/50 to-white px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-100">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Order Status</h2>
            <p className="text-xs sm:text-sm text-gray-500">Track and update order progress</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Current Status */}
        <div className="mb-5 sm:mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Current Status:</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                statusColors[currentStatus]?.bg
              } ${statusColors[currentStatus]?.text}`}
            >
              {currentStatus.replace("_", " ")}
            </span>
          </div>
          {isLocked && (
            <span className="text-xs text-gray-400">⚡ Final state - no further changes</span>
          )}
        </div>

        {/* Available Actions */}
        {availableStatuses.length > 0 ? (
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Available Actions:</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(status)}
                  disabled={isLoading}
                  className={`
                    inline-flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5
                    text-xs sm:text-sm font-medium transition-all duration-200
                    ${statusColors[status]?.bg}
                    ${statusColors[status]?.text}
                    hover:shadow-md active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <span>→ {status.replace("_", " ")}</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          currentStatus !== "CANCELLED" && currentStatus !== "COMPLETED" && (
            <div className="mb-6 rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">No further status changes available</p>
            </div>
          )
        )}

        {/* Timeline Visual */}
        <div className="mt-4 pt-2">
          <div className="flex items-center justify-between">
            {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].map((step, idx, arr) => {
              const stepIndex = arr.indexOf(step as OrderStatus);
              const currentIndex = arr.indexOf(currentStatus);
              const isCompleted = stepIndex <= currentIndex;
              const isCurrent = step === currentStatus;

              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`h-2 w-full rounded-full transition-all ${
                        isCompleted ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                    <div
                      className={`mt-2 text-[10px] sm:text-xs font-medium text-center ${
                        isCurrent ? "text-orange-600" : isCompleted ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {step.replace("_", "").substring(0, 3)}
                    </div>
                  </div>
                  {idx < arr.length - 1 && <div className="w-1" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}