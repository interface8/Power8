"use client";

import {
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  loading?: boolean;
  title: string;
  description: string;
}

export function CheckoutModal({
  open,
  loading,
  title,
  description,
}: CheckoutModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-100
        flex items-center justify-center
        bg-black/50 px-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-3xl bg-white
          p-8 shadow-2xl
        "
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex h-20 w-20
              items-center justify-center
              rounded-full bg-green-100
            "
          >
            {loading ? (
              <Loader2
                className="
                  h-10 w-10
                  animate-spin text-green-700
                "
              />
            ) : (
              <CheckCircle2
                className="
                  h-10 w-10
                  text-green-700
                "
              />
            )}
          </div>

          <h2
            className="
              mt-6 text-2xl
              font-bold text-gray-900
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-3 text-sm leading-6
              text-gray-500
            "
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}