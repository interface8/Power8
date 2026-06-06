"use client";

export function TableHeader() {
  const headers = ["Title", "Category", "Author", "Status", "Date", "Actions"];

  return (
    <thead className="border-b border-gray-200 bg-gray-50">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="px-4 py-3 text-left text-xs font-semibold text-gray-600"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
