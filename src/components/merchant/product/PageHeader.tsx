"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  onAdd: () => void;
}

export function PageHeader({ onAdd }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <h1 className="text-lg text-gray-500 font-normal">
        Manage and track all your listed solar products
      </h1>
      <Button
        onClick={onAdd}
        className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-6 text-base font-medium w-full sm:w-auto"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add new product
      </Button>
    </div>
  );
}