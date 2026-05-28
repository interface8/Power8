"use client";

import { Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  orderStatusOptions,
  paymentStatusOptions,
  paymentTypeOptions,
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
  placeholder: string;
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: FilterSelectProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="
            flex h-12 w-full min-w-45
            items-center justify-between gap-3
            rounded-2xl border border-gray-200
            bg-white px-4
            text-sm font-medium text-gray-700
            shadow-sm transition-all duration-200
            hover:border-orange-300
            hover:bg-orange-50/40
            focus:outline-none
            focus:ring-4
            focus:ring-orange-100
            active:scale-[0.99]
          "
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate">
              {selectedOption?.label || placeholder}
            </span>
          </div>

          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="
          z-50 w-55
          rounded-2xl border border-gray-200
          bg-white p-2 shadow-2xl
        "
      >
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                flex cursor-pointer
                items-center justify-between
                rounded-xl px-3 py-3
                text-sm font-medium
                transition-all duration-150

                ${
                  isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }
              `}
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
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search customer or order ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              h-12 w-full rounded-2xl border border-gray-200
              bg-white pl-11 pr-4 text-sm text-gray-700
              placeholder:text-gray-400
              outline-none transition-all duration-200
              hover:border-gray-300
              focus:border-orange-400
              focus:ring-4 focus:ring-orange-100
            "
          />
        </div>

        {/* Filters */}
        <div
          className="
    grid w-full grid-cols-1 gap-3
    sm:grid-cols-2
    lg:grid-cols-4
    xl:w-auto
  "
        >
          <div
            className="
              flex h-12 items-center gap-2
              rounded-2xl border border-gray-200
              bg-gray-50 px-4
              text-sm font-medium text-gray-600
            "
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>

          <FilterSelect
            value={status}
            onChange={onStatusChange}
            options={orderStatusOptions}
            placeholder="Order Status"
          />

          <FilterSelect
            value={paymentType}
            onChange={onPaymentTypeChange}
            options={paymentTypeOptions}
            placeholder="Payment Type"
          />

          <FilterSelect
            value={paymentStatus}
            onChange={onPaymentStatusChange}
            options={paymentStatusOptions}
            placeholder="Payment Status"
          />
        </div>
      </div>
    </div>
  );
}
