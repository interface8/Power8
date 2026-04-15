
"use client";

import { useState } from "react";
import ProductDescription from "./ProductDescription";
import ProductSpecification from "./ProductSpecification";
import ProductSupportWarranty from "./ProductSupportWarranty";

interface ProductTabsProps {
  description: string;
  keyFeatures: string[];
  specifications: { label: string; value: string }[];
  warrantyCoverage: string[];
  extendedWarranty?: string;
}

export default function ProductTabs({
  description,
  keyFeatures,
  specifications,
  warrantyCoverage,
  extendedWarranty,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-20 md:ml-8 bg-white rounded-3xl overflow-hidden px-4 sm:px-10 py-6 sm:py-12">
      {/* Tab Headers */}
      <div className="flex gap-4 sm:gap-8 bg-white rounded-3xl border-b border-gray-200 overflow-x-auto whitespace-nowrap pb-0">
        <button
          onClick={() => setActiveTab("description")}
          className="px-6 text-[16px] font-medium transition"
        >
          <span className={`inline-block pb-3 border-b-2 ${
            activeTab === "description" 
              ? "border-orange-500 text-orange-500 " 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
            Description
          </span>
        </button>
        <button
          onClick={() => setActiveTab("specifications")}
          className="px-6 text-[16px] font-medium transition"
        >
          <span className={`inline-block pb-3 border-b-2 ${
            activeTab === "specifications" 
              ? "border-orange-500 text-orange-500" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
            Specifications
          </span>
        </button>
        <button
          onClick={() => setActiveTab("warranty")}
          className="px-6 text-[16px] font-medium transition"
        >
          <span className={`inline-block pb-3 border-b-2 ${
            activeTab === "warranty" 
              ? "border-orange-500 text-orange-500" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
            Warranty & Support
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <ProductDescription
            description={description}
            keyFeatures={keyFeatures}
          />
        )}
        {activeTab === "specifications" && (
          <ProductSpecification specifications={specifications} />
        )}
        {activeTab === "warranty" && (
          <ProductSupportWarranty
            warrantyCoverage={warrantyCoverage}
            extendedWarranty={extendedWarranty}
          />
        )}
      </div>
    </div>
  );
}