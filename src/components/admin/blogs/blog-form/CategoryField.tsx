"use client";

import { ChevronDown, Check } from "lucide-react";
import { BlogCategory } from "@/types/admin-blog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryFieldProps {
  categories: BlogCategory[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoryField({
  categories,
  value,
  onChange,
}: CategoryFieldProps) {
  const selectedCategory = categories.find((cat) => cat.id === value);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category <span className="text-red-500">*</span>
      </label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="
              flex h-11 w-full
              items-center justify-between gap-3
              rounded-xl border border-gray-200
              bg-white px-4
              text-sm font-medium text-gray-700
              shadow-sm transition-all duration-200
              hover:border-orange-300
              hover:bg-orange-50/40
              focus:outline-none
              focus:ring-4
              focus:ring-orange-100
              active:scale-[0.98]
            "
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate">
                {selectedCategory?.name || "Select a category"}
              </span>
            </div>

            <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="
            z-50 min-w-56
            rounded-xl border border-gray-200
            bg-white p-1.5 shadow-lg
            max-h-80 overflow-y-auto
          "
        >
          {categories.map((category) => {
            const isActive = value === category.id;

            return (
              <DropdownMenuItem
                key={category.id}
                onClick={() => onChange(category.id)}
                className={`
                  flex cursor-pointer
                  items-center justify-between
                  rounded-lg px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-150

                  ${
                    isActive
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }
                `}
              >
                <div className="flex flex-col items-start">
                  <span>{category.name}</span>
                  {category.description && (
                    <span className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {category.description}
                    </span>
                  )}
                </div>

                {isActive && <Check className="h-4 w-4 shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
