"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers3,
  Users,
  MessageSquareQuote,
  BookOpen,
  Image,
  Settings,
  X,
  Sun,
  ShieldCheck,
  CreditCard,
  ChevronLeft,
  HomeIcon,
} from "lucide-react";

const sections = [
  {
    title: "OVERVIEW",
    links: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "COMMERCE",
    links: [
      { name: "Blog", href: "/admin/blog", icon: BookOpen },
      { name: "Categories", href: "/admin/categories", icon: Layers3 },
      { name: "Carousel", href: "/admin/carousel", icon: Image },
      {
        name: "Credit Accounts",
        href: "/admin/credit-accounts",
        icon: CreditCard,
      },
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      {
        name: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquareQuote,
      },
    ],
  },
  {
    title: "PEOPLE",
    links: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "System Control", href: "/admin/system-control", icon: Settings },
      { name: "Roles & Permissions", href: "/admin/roles", icon: ShieldCheck },
    ],
  },
];

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AdminSidebar({ open, setOpen }: Props) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentYear] = useState(new Date().getFullYear());

  // Check screen size on mount and resize
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

  // Update body attribute for layout spacing
  useEffect(() => {
    document.body.setAttribute("data-sidebar-expanded", String(isExpanded));
  }, [isExpanded]);

  const sidebarWidth = isExpanded ? "w-56" : "w-16";

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen
          bg-linear-to-b from-green-900/95 via-green-800/90 to-green-900/95
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
        {/* Glass overlay effect */}
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />

        {/* Header */}
        <div className="relative h-14 border-b border-white/10 flex items-center justify-between px-3">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-2 transition-all duration-300 ${!isExpanded ? "justify-center w-full" : ""}`}
          >
            <div className="bg-linear-to-br from-orange-500 to-orange-600 p-1 rounded-lg shadow-lg shadow-orange-500/20">
              <Sun className="w-4 h-4 text-white" />
            </div>
            {isExpanded && (
              <span className="font-bold text-base text-white">Power-8</span>
            )}
          </Link>

          <Link href="/dashboard">
            <HomeIcon className="text-white" size={22} />
          </Link>

          {/* Chevron Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:scale-110 transition-all duration-200 z-50 ${
              isExpanded ? "rotate-0" : "rotate-180"
            }`}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto custom-scrollbar">
          <div className="px-2 space-y-4">
            {sections.map((section) => (
              <div key={section.title}>
                {/* Section Title */}
                {isExpanded && (
                  <p className="px-2 mb-1.5 text-[9px] font-semibold tracking-wider text-green-300 uppercase">
                    {section.title}
                  </p>
                )}
                {!isExpanded && <div className="h-2" />}

                {/* Section Links */}
                <div className="space-y-0.5">
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
                          group relative flex items-center gap-2 px-2 py-1.5 rounded-lg
                          transition-all duration-200
                         ${
                           active
                             ? "bg-orange-600/70 text-orange-400 shadow-lg backdrop-blur-sm"
                             : "text-white/70 hover:bg-white/10 hover:text-white"
                         }

                          ${!isExpanded ? "justify-center" : ""}
                        `}
                        title={!isExpanded ? link.name : undefined}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                            active
                              ? "text-white"
                              : "text-white/60 group-hover:text-white"
                          }`}
                        />

                        {isExpanded && (
                          <span
                            className={`text-xs font-medium ${
                              active
                                ? "text-white"
                                : "text-white/80 group-hover:text-white"
                            }`}
                          >
                            {link.name}
                          </span>
                        )}

                        {/* Active indicator bar */}
                        {active && isExpanded && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-400 rounded-r-full shadow-sm" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer with Year */}
        <div
          className={`border-t border-white/10 py-2 ${isExpanded ? "px-3" : "px-2"}`}
        >
          <div className="text-center">
            {isExpanded ? (
              <>
                <p className="text-[9px] text-white/40">
                  © {currentYear} Power-8
                </p>
                <p className="text-[8px] text-white/30 mt-0.5">
                  Admin Dashboard
                </p>
              </>
            ) : (
              <p className="text-[8px] text-white/40">© {currentYear}</p>
            )}
          </div>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
}
