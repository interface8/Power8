"use client";

interface SlugFieldProps {
  value: string;
  onChange: (value: string) => void;
  onEdit: () => void;
}

export function SlugField({ value, onChange, onEdit }: SlugFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Slug <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">/blog/</span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onEdit();
          }}
          className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
          placeholder="blog-slug"
        />
      </div>
      <p className="mt-1 text-xs text-gray-400">Auto-generated from title, can be edited</p>
    </div>
  );
}