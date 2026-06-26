"use client";

import { useState, useEffect } from "react";
import { MerchantSidebar } from "@/components/merchant/dashboard/MerchantSidebar";
import { MerchantHeader } from "@/components/merchant/dashboard/MerchantHeader";

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsExpanded(
        document.body.getAttribute("data-sidebar-expanded") === "true",
      );
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const marginWidth = isExpanded ? "lg:ml-64" : "lg:ml-20";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MerchantSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${marginWidth}`}
      >
        <MerchantHeader setOpen={setSidebarOpen} />

        <main className="flex-1 overflow-x-hidden">
          <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="w-full max-w-400 mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
