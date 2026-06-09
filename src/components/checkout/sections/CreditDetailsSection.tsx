"use client";

import { CreditCard } from "lucide-react";

import {
  CreditDetails,
  calculateCreditBreakdown,
  formatCurrency,
} from "../checkoutUtils";

interface CreditDetailsSectionProps {
  totalAmount: number;

  values: CreditDetails;

  onChange: (
    field: keyof CreditDetails,
    value: number,
  ) => void;
}

export function CreditDetailsSection({
  totalAmount,
  values,
  onChange,
}: CreditDetailsSectionProps) {
  const breakdown =
    calculateCreditBreakdown(
      totalAmount,
      values.depositAmount,
      values.durationAmount,
    );

  return (
    <section
      className="
        rounded-3xl border border-gray-200
        bg-white p-5 shadow-sm
        sm:p-6
      "
    >
      <div
        className="
          mb-6 flex items-center gap-3
        "
      >
        <div
          className="
            flex h-11 w-11 items-center
            justify-center rounded-2xl
            bg-orange-100
          "
        >
          <CreditCard
            className="
              h-5 w-5 text-orange-600
            "
          />
        </div>

        <div>
          <h2
            className="
              text-lg font-semibold
              text-gray-900
            "
          >
            Credit Details
          </h2>

          <p className="text-sm text-gray-500">
            Configure your installment
            payment plan
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Deposit */}
        <div>
          <label
            className="
              text-sm font-medium
              text-gray-700
            "
          >
            Deposit Amount
          </label>

          <input
            type="number"
            min={0}
            value={values.depositAmount}
            onChange={(event) =>
              onChange(
                "depositAmount",
                Number(event.target.value),
              )
            }
            className="
              mt-2 h-12 w-full rounded-2xl
              border border-gray-200
              bg-gray-50 px-4 text-sm
              outline-none transition-all
              duration-200
              focus:border-orange-400
              focus:bg-white
              focus:ring-4
              focus:ring-orange-100
            "
          />
        </div>

        {/* Duration */}
        <div>
          <label
            className="
              text-sm font-medium
              text-gray-700
            "
          >
            Duration (Months)
          </label>

          <select
            value={values.durationAmount}
            onChange={(event) =>
              onChange(
                "durationAmount",
                Number(event.target.value),
              )
            }
            className="
              mt-2 h-12 w-full rounded-2xl
              border border-gray-200
              bg-gray-50 px-4 text-sm
              outline-none transition-all
              duration-200
              focus:border-orange-400
              focus:bg-white
              focus:ring-4
              focus:ring-orange-100
            "
          >
            <option value={3}>
              3 Months
            </option>

            <option value={6}>
              6 Months
            </option>

            <option value={12}>
              12 Months
            </option>
          </select>
        </div>

        {/* Breakdown */}
        <div
          className="
            rounded-2xl border border-orange-100
            bg-orange-50/60 p-4
          "
        >
          <div className="space-y-3">
            <div
              className="
                flex items-center
                justify-between
              "
            >
              <span
                className="
                  text-sm text-gray-600
                "
              >
                Monthly Payment
              </span>

              <span
                className="
                  text-sm font-semibold
                  text-gray-900
                "
              >
                {formatCurrency(
                  breakdown.monthlyPayment,
                )}
              </span>
            </div>

            <div
              className="
                flex items-center
                justify-between
              "
            >
              <span
                className="
                  text-sm text-gray-600
                "
              >
                Total Payable
              </span>

              <span
                className="
                  text-sm font-semibold
                  text-orange-600
                "
              >
                {formatCurrency(
                  breakdown.totalPayable,
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}