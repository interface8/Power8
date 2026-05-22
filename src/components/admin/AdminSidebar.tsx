"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  HomeIcon,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

const sections = [
  {
    title: "OVERVIEW",

    links: [
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "COMMERCE",

    links: [
      {
        name: "Blog",
        href: "/admin/blog",
        icon: BookOpen,
      },

      {
        name: "Categories",
        href: "/admin/categories",
        icon: Layers3,
      },

      {
        name: "Carousel",
        href: "/admin/carousel",
        icon: Image,
      },

      {
        name: "Products",
        href: "/admin/products",
        icon: Package,
      },

      {
        name: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
      },

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
      {
        name: "Users",
        href: "/admin/users",
        icon: Users,
      },

      {
        name: "Roles",
        href: "/admin/roles",
        icon: ShieldCheck,
      },

      {
        name: "Permissions",
        href: "/admin/permissions",
        icon: KeyRound,
      },

      {
        name: "System Control",
        href: "/admin/system-control",
        icon: Settings,
      },
    ],
  },
];

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AdminSidebar({ open, setOpen }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50
          w-72 h-screen
          bg-green-900 text-white
          border-r border-zinc-800
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 border-b border-white px-6 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Sun className="w-5 h-5 text-white" />
            </div>

            <span className="font-bold text-lg">Power-8</span>
          </Link>

          <Link href="/">
            {" "}
            <HomeIcon className="w-5 h-5" />
          </Link>

          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
          {sections.map((section) => (
            <div key={section.title}>
              {/* Section Title */}
              <p className="px-4 mb-2 text-[11px] font-semibold tracking-widest text-green-300 uppercase">
                {section.title}
              </p>

              {/* Section Links */}
              <div className="space-y-1">
                {section.links.map((link) => {
                  const active =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`
                flex items-center gap-3
                px-4 py-3 rounded-xl
                transition-all duration-200
                group
                ${
                  active
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-white hover:bg-green-950"
                }
              `}
                    >
                      <link.icon className="w-5 h-5 shrink-0" />

                      <span className="text-sm font-medium">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
