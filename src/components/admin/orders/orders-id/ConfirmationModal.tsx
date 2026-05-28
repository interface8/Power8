"use client";

import { Loader2, TriangleAlert, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        p-4
        animate-in fade-in duration-200
      "
    >
      <div
        className="
          relative w-full max-w-md
          overflow-hidden rounded-3xl
          border border-white/20
          bg-white shadow-2xl
          animate-in zoom-in-95 fade-in
          duration-200
        "
      >
        <div
          className="
            absolute inset-x-0 top-0
            h-1 bg-linear-to-r
            from-green-400 via-green-500 to-orange-600
          "
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="
            absolute right-4 top-4
            flex h-9 w-9 items-center justify-center
            rounded-full
            text-gray-400
            transition-all duration-200
            hover:bg-gray-100
            hover:text-gray-700
            disabled:opacity-50
          "
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Icon */}
          <div
            className="
              mb-5 flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-orange-100
            "
          >
            <TriangleAlert className="h-7 w-7 text-orange-600" />
          </div>
          <h3
            className="
              text-xl font-bold
              tracking-tight text-gray-900
            "
          >
            {title}
          </h3>
          <p
            className="
              mt-3 text-sm leading-6
              text-gray-600
            "
          >
            {message}
          </p>

          {/* Buttons */}
          <div
            className="
              mt-8 flex flex-col-reverse gap-3
              sm:flex-row sm:justify-end
            "
          >
            <button
              onClick={onClose}
              disabled={isLoading}
              className="
                inline-flex items-center justify-center
                rounded-xl border border-gray-200
                bg-white px-5 py-3
                text-sm font-medium text-gray-700
                transition-all duration-200
                hover:bg-gray-50
                hover:border-gray-300
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                bg-orange-500 px-5 py-3
                text-sm font-semibold text-white
                shadow-lg shadow-orange-500/20
                transition-all duration-200
                hover:bg-orange-600
                hover:shadow-xl hover:shadow-orange-500/30
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}

              {isLoading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
