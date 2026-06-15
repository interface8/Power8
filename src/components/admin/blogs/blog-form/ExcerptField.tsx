"use client";

interface ExcerptFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExcerptField({ value, onChange }: ExcerptFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        placeholder="Short summary of the blog post (optional)"
      />
    </div>
  );
}