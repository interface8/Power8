"use client";

import { Loader2 } from "lucide-react";

import { formatCurrency } from "../checkoutUtils";

interface OrderSummarySectionProps {
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }[];

  subtotal: number;
  vat: number;
  total: number;

  paymentMethod: "full" | "installment";

  creditBreakdown?: {
    monthlyPayment: number;
  };

  loading: boolean;
  canSubmit: boolean;

  onSubmit: () => void;
}

export function OrderSummarySection({
  items,
  subtotal,
  vat,
  total,
  paymentMethod,
  creditBreakdown,
  loading,
  canSubmit,
  onSubmit,
}: OrderSummarySectionProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {item.productName}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <p className="shrink-0 text-sm font-semibold text-gray-900">
              {formatCurrency(
                item.price * item.quantity,
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="my-5 border-t border-dashed border-gray-200" />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Subtotal
          </span>

          <span className="font-medium text-gray-800">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            VAT
          </span>

          <span className="font-medium text-gray-800">
            {formatCurrency(vat)}
          </span>
        </div>

        {paymentMethod === "installment" &&
          creditBreakdown && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Monthly Payment
              </span>

              <span className="font-semibold text-orange-600">
                {formatCurrency(
                  creditBreakdown.monthlyPayment,
                )}
              </span>
            </div>
          )}

        <div className="border-t border-dashed border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">
              Total
            </span>

            <span className="text-xl font-bold text-orange-500">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || loading}
        className="
          mt-6 flex h-12 w-full items-center
          justify-center rounded-2xl
          bg-orange-500 px-4 text-sm
          font-semibold text-white
          transition-all duration-200

          hover:bg-orange-600
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : paymentMethod === "full" ? (
          "Pay Now"
        ) : (
          "Submit Credit Application"
        )}
      </button>
    </div>
  );
}