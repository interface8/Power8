"use client";

import {
  Landmark,
  CreditCard,
  Wallet,
} from "lucide-react";

type PaymentChannel =
  | "bank_transfer"
  | "paystack"
  | "card";

interface PaymentChannelSectionProps {
  paymentChannel: PaymentChannel;
  onChange: (value: PaymentChannel) => void;
}

const channels = [
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    icon: Landmark,
  },
  {
    value: "paystack",
    label: "Paystack",
    icon: Wallet,
  },
  {
    value: "card",
    label: "Debit Card",
    icon: CreditCard,
  },
] as const;

export function PaymentChannelSection({
  paymentChannel,
  onChange,
}: PaymentChannelSectionProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Payment Option
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select preferred payment method
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {channels.map((channel) => {
          const Icon = channel.icon;

          const active =
            paymentChannel === channel.value;

          return (
            <button
              key={channel.value}
              type="button"
              onClick={() =>
                onChange(channel.value)
              }
              className={`
                flex flex-col items-center
                justify-center gap-3 rounded-2xl
                border p-5 transition-all
                duration-200

                ${
                  active
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/40"
                }
              `}
            >
              <div
                className={`
                  flex h-12 w-12 items-center
                  justify-center rounded-2xl

                  ${
                    active
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span className="text-sm font-medium text-gray-800">
                {channel.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}