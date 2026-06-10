"use client";

import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  isEdit: boolean;
  onCancel: () => void;
}

export function FormActions({ isSubmitting, isEdit, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-orange-600 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {isEdit ? "Updating..." : "Creating..."}
          </span>
        ) : (
          isEdit ? "Update Blog" : "Create Blog"
        )}
      </button>
    </div>
  );
}