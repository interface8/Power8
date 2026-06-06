"use client";

import { Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  search: string;
  category: string;
  status: string;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function BlogFilters({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: Props) {
  return (
    <div
      className="
        rounded-[28px]
        border
        bg-white
        p-5
        shadow-sm
      "
    >
      <div className="flex flex-col gap-4 xl:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="
              absolute
              left-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-muted-foreground
            "
          />

          <Input
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search blog title..."
            className="h-12 pl-11"
          />
        </div>

        {/* Category */}
        <Select
          value={category}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="h-12 w-full xl:w-55">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Categories
            </SelectItem>

            <SelectItem value="Education">
              Education
            </SelectItem>

            <SelectItem value="Guides">
              Guides
            </SelectItem>

            <SelectItem value="News">
              News
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className="h-12 w-full xl:w-55">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Statuses
            </SelectItem>

            <SelectItem value="published">
              Published
            </SelectItem>

            <SelectItem value="draft">
              Draft
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Button */}
        <button
          className="
            flex h-12 items-center justify-center gap-2
            rounded-xl
            bg-orange-500
            px-5
            font-medium
            text-white
            transition-colors
            hover:bg-orange-600
          "
        >
          <Plus className="h-4 w-4" />
          New Blog
        </button>
      </div>
    </div>
  );
}