"use client";

import { Search, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MerchantOrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  paymentType: string;
  onPaymentTypeChange: (value: string) => void;
  paymentStatus: string;
  onPaymentStatusChange: (value: string) => void;
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

// const paymentTypeOptions = [
//   { value: "", label: "All Payment Types" },
//   { value: "FULL", label: "Full Payment" },
//   { value: "CREDIT", label: "Credit" },
// ];

// const paymentStatusOptions = [
//   { value: "", label: "All Payment Status" },
//   { value: "PENDING", label: "Pending" },
//   { value: "PARTIALLY_PAID", label: "Partially Paid" },
//   { value: "PAID", label: "Paid" },
//   { value: "FAILED", label: "Failed" },
//   { value: "REFUNDED", label: "Refunded" },
// ];

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

function FilterSelect({ value, onChange, options, placeholder }: FilterSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-11 min-w-40 items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:border-orange-300 hover:bg-orange-50/40 focus:outline-none focus:ring-4 focus:ring-orange-100">
          <span className="truncate">{selectedOption?.label || placeholder}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="z-50 min-w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <span>{option.label}</span>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MerchantOrderFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  // paymentType,
  // onPaymentTypeChange,
  // paymentStatus,
  // onPaymentStatusChange,
}: MerchantOrderFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer name or order ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-11 rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Status Filter */}
      <FilterSelect
        value={status}
        onChange={onStatusChange}
        options={statusOptions}
        placeholder="All Statuses"
      />
    </div>
  );
}