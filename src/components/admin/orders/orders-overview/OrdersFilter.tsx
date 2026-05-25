"use client";

import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import {
  orderStatusOptions,
  paymentTypeOptions,
  paymentStatusOptions,
} from "./ordersUtils";

interface FilterOption {
  value: string;
  label: string;
}

interface OrdersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  paymentType: string;
  onPaymentTypeChange: (value: string) => void;
  paymentStatus: string;
  onPaymentStatusChange: (value: string) => void;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  icon?: React.ComponentType<{ className?: string }>;
}

function FilterSelect({
  value,
  onChange,
  options,
  icon: Icon,
}: FilterSelectProps) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 sm:h-12 w-full sm:w-auto min-w-35 appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-8 text-sm text-gray-700 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-gray-300`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function OrdersFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  paymentType,
  onPaymentTypeChange,
  paymentStatus,
  onPaymentStatusChange,
}: OrdersFiltersProps) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 sm:h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <FilterSelect
            value={status}
            onChange={onStatusChange}
            options={orderStatusOptions}
            icon={SlidersHorizontal}
          />
          <FilterSelect
            value={paymentType}
            onChange={onPaymentTypeChange}
            options={paymentTypeOptions}
            icon={ChevronDown}
          />
          <FilterSelect
            value={paymentStatus}
            onChange={onPaymentStatusChange}
            options={paymentStatusOptions}
            icon={ChevronDown}
          />
        </div>
      </div>
    </div>
  );
}
