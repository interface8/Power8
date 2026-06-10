"use client";

interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export function TitleField({ value, onChange, autoFocus }: TitleFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        placeholder="Enter blog title"
        autoFocus={autoFocus}
      />
    </div>
  );
}