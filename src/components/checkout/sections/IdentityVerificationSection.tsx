"use client";

import {
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

import { IdentityData } from "../checkoutUtils";

interface IdentityVerificationSectionProps {
  values: IdentityData;

  onChange: (
    field: keyof IdentityData,
    value: string,
  ) => void;

  isBVNValid: boolean;

  isNINValid: boolean;
}

export function IdentityVerificationSection({
  values,
  onChange,
  isBVNValid,
  isNINValid,
}: IdentityVerificationSectionProps) {
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
            bg-green-100
          "
        >
          <ShieldCheck
            className="
              h-5 w-5 text-green-700
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
            Identity Verification
          </h2>

          <p className="text-sm text-gray-500">
            BVN and NIN must be valid
            before application submission
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* BVN */}
        <div>
          <label
            className="
              text-sm font-medium
              text-gray-700
            "
          >
            BVN
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={11}
            value={values.bvn}
            onChange={(event) =>
              onChange(
                "bvn",
                event.target.value,
              )
            }
            placeholder="Enter 11-digit BVN"
            className="
              mt-2 h-12 w-full rounded-2xl
              border border-gray-200
              bg-gray-50 px-4 text-sm
              outline-none transition-all
              duration-200
              focus:border-green-500
              focus:bg-white
              focus:ring-4
              focus:ring-green-100
            "
          />

          <div className="mt-2">
            {isBVNValid ? (
              <span
                className="
                  inline-flex items-center
                  gap-1 rounded-full
                  bg-green-100 px-2.5 py-1
                  text-xs font-medium
                  text-green-700
                "
              >
                <BadgeCheck className="h-3 w-3" />
                BVN Verified
              </span>
            ) : (
              <span
                className="
                  text-xs text-red-500
                "
              >
                BVN must contain exactly
                11 digits
              </span>
            )}
          </div>
        </div>

        {/* NIN */}
        <div>
          <label
            className="
              text-sm font-medium
              text-gray-700
            "
          >
            NIN
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={11}
            value={values.nin}
            onChange={(event) =>
              onChange(
                "nin",
                event.target.value,
              )
            }
            placeholder="Enter 11-digit NIN"
            className="
              mt-2 h-12 w-full rounded-2xl
              border border-gray-200
              bg-gray-50 px-4 text-sm
              outline-none transition-all
              duration-200
              focus:border-green-500
              focus:bg-white
              focus:ring-4
              focus:ring-green-100
            "
          />

          <div className="mt-2">
            {isNINValid ? (
              <span
                className="
                  inline-flex items-center
                  gap-1 rounded-full
                  bg-green-100 px-2.5 py-1
                  text-xs font-medium
                  text-green-700
                "
              >
                <BadgeCheck className="h-3 w-3" />
                NIN Verified
              </span>
            ) : (
              <span
                className="
                  text-xs text-red-500
                "
              >
                NIN must contain exactly
                11 digits
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}