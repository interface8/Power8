"use client";

import { useState } from "react";

interface ProductTabsProps {
  description: string | null;
  capacity: number;
  warranty: number;
  brand: string;
}

export default function ProductTabs({ description, capacity, warranty, brand }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-6 md:mt-8">
      {/* Tab Headers - Scrollable on mobile if needed */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("description")}
          className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium whitespace-nowrap transition ${
            activeTab === "description"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("specifications")}
          className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium whitespace-nowrap transition ${
            activeTab === "specifications"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Specifications
        </button>
        <button
          onClick={() => setActiveTab("warranty")}
          className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium whitespace-nowrap transition ${
            activeTab === "warranty"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Warranty & Support
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6 bg-gray-50 rounded-b-lg">
        {activeTab === "description" && (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Product Description</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">{description || "No description available"}</p>
          </div>
        )}

        {activeTab === "specifications" && (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Technical Specifications</h3>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                <span className="text-gray-500 text-sm md:text-base">Power Output</span>
                <span className="font-medium text-sm md:text-base">{capacity}W</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                <span className="text-gray-500 text-sm md:text-base">Brand</span>
                <span className="font-medium text-sm md:text-base">{brand}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b">
                <span className="text-gray-500 text-sm md:text-base">Warranty</span>
                <span className="font-medium text-sm md:text-base">{warranty} years</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "warranty" && (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Warranty & Support</h3>
            <div className="space-y-2 md:space-y-3">
              <p className="text-sm md:text-base text-gray-600">
                <span className="font-medium">✓ {warranty} years warranty</span> on product defects
              </p>
              <p className="text-sm md:text-base text-gray-600">
                <span className="font-medium">✓ Free technical support</span> for the lifetime of the product
              </p>
              <p className="text-sm md:text-base text-gray-600">
                <span className="font-medium">✓ 30-day money-back guarantee</span>
              </p>
              <p className="text-sm md:text-base text-gray-600">
                <span className="font-medium">✓ Free installation</span> within Lagos
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}