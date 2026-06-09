"use client";

import { InputHTMLAttributes } from "react";

import { sanitizeInput } from "../checkoutUtils";

interface CheckoutInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function CheckoutInput({
  label,
  error,
  value,
  onChange,
  className,
  ...props
}: CheckoutInputProps) {
  return (
    <div>
      <label
        className="
          text-sm font-medium
          text-gray-700
        "
      >
        {label}
      </label>

      <input
        {...props}
        value={value}
        onChange={(e) => {
          const cleanValue = sanitizeInput(
            e.target.value,
          );

          if (onChange) {
            e.target.value = cleanValue;
            onChange(e);
          }
        }}
        className={`
          mt-2 h-12 w-full rounded-2xl
          border border-gray-200
          bg-gray-50 px-4
          text-sm text-gray-800
          transition-all duration-200
          outline-none

          placeholder:text-gray-400

          hover:border-gray-300

          focus:border-green-500
          focus:bg-white
          focus:ring-4
          focus:ring-green-100

          ${error ? "border-red-400" : ""}
          ${className ?? ""}
        `}
      />

      {error && (
        <p
          className="
            mt-2 text-xs
            font-medium text-red-500
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}