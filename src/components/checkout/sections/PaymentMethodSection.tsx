"use client";

import {
  BadgeCheck,
  CreditCard,
} from "lucide-react";

type PaymentMethod =
  | "full"
  | "installment";

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;

  onChange: (
    method: PaymentMethod,
  ) => void;
}

export function PaymentMethodSection({
  paymentMethod,
  onChange,
}: PaymentMethodSectionProps) {
  return (
    <section
      className="
        rounded-3xl border border-gray-200
        bg-white p-5 shadow-sm
        sm:p-6
      "
    >
      <div className="mb-5">
        <h2
          className="
            text-lg font-semibold
            text-green-950
            sm:text-xl
          "
        >
          Payment Method
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose how you want to pay
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Payment */}
        <button
          type="button"
          onClick={() => onChange("full")}
          className={`
            w-full rounded-2xl border
            p-4 text-left transition-all
            duration-200

            ${
              paymentMethod === "full"
                ? `
                  border-green-600
                  bg-green-50
                  shadow-sm
                `
                : `
                  border-gray-200
                  hover:border-green-300
                  hover:bg-green-50/40
                `
            }
          `}
        >
          <div
            className="
              flex flex-col gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-2xl bg-green-100
                "
              >
                <BadgeCheck
                  className="
                    h-5 w-5 text-green-700
                  "
                />
              </div>

              <div>
                <div
                  className="
                    flex flex-wrap items-center
                    gap-2
                  "
                >
                  <h3
                    className="
                      text-sm font-semibold
                      text-gray-900
                      sm:text-base
                    "
                  >
                    Full Payment
                  </h3>

                  <span
                    className="
                      rounded-full bg-green-600
                      px-2.5 py-1 text-xs
                      font-medium text-white
                    "
                  >
                    Recommended
                  </span>
                </div>

                <p
                  className="
                    mt-1 text-sm text-gray-500
                  "
                >
                  Pay the full amount now
                  and activate installation
                  immediately.
                </p>
              </div>
            </div>
          </div>
        </button>

        {/* Installment */}
        <button
          type="button"
          onClick={() =>
            onChange("installment")
          }
          className={`
            w-full rounded-2xl border
            p-4 text-left transition-all
            duration-200

            ${
              paymentMethod ===
              "installment"
                ? `
                  border-orange-500
                  bg-orange-50
                  shadow-sm
                `
                : `
                  border-gray-200
                  hover:border-orange-300
                  hover:bg-orange-50/40
                `
            }
          `}
        >
          <div
            className="
              flex flex-col gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-2xl bg-orange-100
                "
              >
                <CreditCard
                  className="
                    h-5 w-5 text-orange-600
                  "
                />
              </div>

              <div>
                <div
                  className="
                    flex flex-wrap items-center
                    gap-2
                  "
                >
                  <h3
                    className="
                      text-sm font-semibold
                      text-gray-900
                      sm:text-base
                    "
                  >
                    Pay Small Small
                  </h3>

                  <span
                    className="
                      rounded-full bg-orange-500
                      px-2.5 py-1 text-xs
                      font-medium text-white
                    "
                  >
                    Flexible
                  </span>
                </div>

                <p
                  className="
                    mt-1 text-sm text-gray-500
                  "
                >
                  Make a deposit and spread
                  the remaining payment across
                  monthly installments.
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}