"use client";

import { InputHTMLAttributes, useId } from "react";
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
  id,
  name,
  required,
  ...props
}: CheckoutInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-gray-700"
      >
        {label}

        {required && (
          <span
            className="ml-1 text-red-500"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <input
        {...props}
        id={inputId}
        name={name}
        value={value}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
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
          bg-gray-50 px-4
          text-sm text-gray-800
          outline-none
          transition-all duration-200

          placeholder:text-gray-400
          hover:border-gray-300

          ${
            error
              ? `
                border border-red-400
                focus:border-red-500
                focus:bg-white
                focus:ring-4
                focus:ring-red-100
              `
              : `
                border border-gray-200
                focus:border-green-500
                focus:bg-white
                focus:ring-4
                focus:ring-green-100
              `
          }

          ${className ?? ""}
        `}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-xs font-medium text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}