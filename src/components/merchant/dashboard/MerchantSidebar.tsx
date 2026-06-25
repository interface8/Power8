"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Layers3,
  ShoppingCart,
  UserCircle2,
  X,
  ChevronLeft,
  Store,
} from "lucide-react";

const sections = [
  {
    title: "MAIN",
    links: [
      { name: "Dashboard", href: "/merchant/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "MANAGE",
    links: [
      { name: "My Products", href: "/merchant/products", icon: Package },
      { name: "My Bundles", href: "/merchant/bundles", icon: Layers3 },
      { name: "Orders", href: "/merchant/orders", icon: ShoppingCart },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      {
        name: "Account & Profile",
        href: "/merchant/profile",
        icon: UserCircle2,
      },
    ],
  },
];

interface MerchantSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MerchantSidebar({ open, setOpen }: MerchantSidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const checkScreen = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-sidebar-expanded", String(isExpanded));
  }, [isExpanded]);

  const sidebarWidth = isExpanded ? "w-64" : "w-20";

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen bg-linear-to-b from-green-900/95 via-green-800/90 to-green-900/95
          backdrop-blur-xl
          border-r border-white/20
          shadow-2xl
          transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />

        {/* Header */}
        <div className="relative h-16 border-b border-white/10 flex items-center justify-between px-4">
          <Link
            href="/"
            className={`flex items-center gap-2 transition-all duration-300 ${!isExpanded ? "justify-center w-full" : ""}`}
          >
            <div className="bg-linear-to-br from-orange-500 to-orange-600 p-1.5 rounded-lg shadow-lg shadow-orange-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            {isExpanded && (
              <span className="font-bold text-lg text-white">Power-8</span>
            )}
          </Link>

          <button
            onClick={toggleSidebar}
            className={`absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:scale-110 transition-all duration-200 z-50 ${
              isExpanded ? "rotate-0" : "rotate-180"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="px-3 space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                {isExpanded && (
                  <p className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-green-300 uppercase">
                    {section.title}
                  </p>
                )}
                {!isExpanded && <div className="h-4" />}

                <div className="space-y-1">
                  {section.links.map((link) => {
                    const active =
                      pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`
                           flex items-center gap-3 px-3 py-2.5 rounded-xl
    transition-all duration-200 group
    text-sm sm:text-base md:text-md lg:text-lg tracking-tight
                          ${
                            active
                              ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }
                          ${!isExpanded ? "justify-center" : ""}
                        `}
                        title={!isExpanded ? link.name : undefined}
                      >
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-all duration-200 ${
                            active
                              ? "text-white"
                              : "text-white/60 group-hover:text-white"
                          }`}
                        />

                        {isExpanded && (
                          <span
                            className={`text-sm font-medium ${
                              active
                                ? "text-white"
                                : "text-white/80 group-hover:text-white"
                            }`}
                          >
                            {link.name}
                          </span>
                        )}

                        {active && isExpanded && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-400 rounded-r-full shadow-sm" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div
          className={`border-t border-white/10 py-3 ${isExpanded ? "px-4" : "px-2"}`}
        >
          <div className="text-center">
            {isExpanded ? (
              <>
                <p className="text-[10px] text-white/40">
                  © {currentYear} Power-8
                </p>
                <p className="text-[9px] text-white/30 mt-0.5">
                  Merchant Dashboard
                </p>
              </>
            ) : (
              <p className="text-[9px] text-white/40">© {currentYear}</p>
            )}
          </div>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
}
