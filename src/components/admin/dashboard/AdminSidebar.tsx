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
  KeyRound,
  CreditCard,
  ChevronLeft,
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
      { name: "Roles", href: "/admin/roles", icon: ShieldCheck },
      { name: "Permissions", href: "/admin/permissions", icon: KeyRound },
      { name: "System Control", href: "/admin/system-control", icon: Settings },
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

  const sidebarWidth = isExpanded ? "w-64" : "w-20";

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen bg-linear-to-b from-green-900 to-green-950
          text-white shadow-xl
          transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="relative h-16 border-b border-white/10 flex items-center justify-between px-4">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-2 transition-all duration-300 ${!isExpanded ? "justify-center w-full" : ""}`}
          >
            <div className="bg-orange-500 p-1.5 rounded-lg shrink-0">
              <Sun className="w-5 h-5 text-white" />
            </div>
            {isExpanded && (
              <span className="font-bold text-lg whitespace-nowrap">
                Power-8
              </span>
            )}
          </Link>

          {/* Chevron Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-all duration-200 z-50 ${
              isExpanded ? "rotate-0" : "rotate-180"
            }`}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Mobile close button */}
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                {/* Section Title */}
                {isExpanded && (
                  <p className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-green-300 uppercase whitespace-nowrap">
                    {section.title}
                  </p>
                )}
                {!isExpanded && <div className="h-5" />}

                {/* Section Links */}
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
                          ${
                            active
                              ? "bg-orange-500 text-white shadow-md"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          }
                          ${!isExpanded ? "justify-center" : ""}
                        `}
                        title={!isExpanded ? link.name : undefined}
                      >
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-all duration-200 ${active ? "scale-110" : "group-hover:scale-110"}`}
                        />

                        {isExpanded && (
                          <span className="text-sm font-medium whitespace-nowrap">
                            {link.name}
                          </span>
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
          className={`border-t border-white/10 py-3 ${isExpanded ? "px-4" : "px-2"}`}
        >
          <div className="text-center">
            {isExpanded ? (
              <>
                <p className="text-[10px] text-white/40">
                  © {currentYear} Power-8
                </p>
                <p className="text-[9px] text-white/30 mt-0.5">
                  Admin Dashboard
                </p>
              </>
            ) : (
              <p className="text-[9px] text-white/40">© {currentYear}</p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
