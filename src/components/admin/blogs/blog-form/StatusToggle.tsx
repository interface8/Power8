"use client";

interface StatusToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function StatusToggle({ value, onChange }: StatusToggleProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Status
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
            !value
              ? "border-orange-500 bg-orange-50 text-orange-600"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
            value
              ? "border-orange-500 bg-orange-50 text-orange-600"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
