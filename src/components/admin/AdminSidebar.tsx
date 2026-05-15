// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   ShoppingCart,
//   Users,
//   Package,
//   Layers3,
//   Boxes,
//   Image,
//   BookOpen,
//   MessageSquareQuote,
//   Settings,
//   X,
//   Sun,
// } from "lucide-react";

// const navItems = [
//   {
//     label: "Dashboard",
//     href: "/admin/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Orders",
//     href: "/admin/orders",
//     icon: ShoppingCart,
//   },
//   {
//     label: "Users",
//     href: "/admin/users",
//     icon: Users,
//   },
//   {
//     label: "Products",
//     href: "/admin/products",
//     icon: Package,
//   },
//   {
//     label: "Categories",
//     href: "/admin/categories",
//     icon: Layers3,
//   },
//   {
//     label: "Bundles",
//     href: "/admin/bundles",
//     icon: Boxes,
//   },
//   {
//     label: "Carousel",
//     href: "/admin/carousel",
//     icon: Image,
//   },
//   {
//     label: "Blog",
//     href: "/admin/blog",
//     icon: BookOpen,
//   },
//   {
//     label: "Testimonials",
//     href: "/admin/testimonials",
//     icon: MessageSquareQuote,
//   },
//   {
//     label: "System Control",
//     href: "/admin/system-control",
//     icon: Settings,
//   },
// ];

// interface Props {
//   open: boolean;
//   setOpen: (open: boolean) => void;
// }

// export default function AdminSidebar({ open, setOpen }: Props) {
//   const pathname = usePathname();

//   return (
//     <>
//       {/* Overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       <aside
//         className={`
//           fixed lg:static top-0 left-0 z-50
//           h-screen w-72 bg-green-950 text-white
//           transform transition-transform duration-300
//           ${open ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0
//         `}
//       >
//         {/* Logo */}
//         <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
//           <Link href="/admin/dashboard" className="flex items-center gap-2">
//             <div className="bg-orange-500 p-2 rounded-lg">
//               <Sun className="w-5 h-5 text-white" />
//             </div>

//             <span className="font-bold text-lg">Power-8 Admin</span>
//           </Link>

//           <button onClick={() => setOpen(false)} className="lg:hidden">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 space-y-2">
//           {navItems.map(({ label, href, icon: Icon }) => {
//             const active = pathname.startsWith(href);

//             return (
//               <Link
//                 key={label}
//                 href={href}
//                 className={`
//                   flex items-center gap-3 px-4 py-3 rounded-xl
//                   transition-all duration-200
//                   ${
//                     active
//                       ? "bg-orange-500 text-white shadow-lg"
//                       : "hover:bg-white/10 text-gray-200"
//                   }
//                 `}
//               >
//                 <Icon className="w-5 h-5" />

//                 <span className="text-sm font-medium">{label}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>
//     </>
//   );
// }

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
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Layers3,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: BookOpen,
  },
  {
    name: "Carousel",
    href: "/admin/carousel",
    icon: Image,
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "System Control",
    href: "/admin/system-control",
    icon: Settings,
  },
];

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  open,
  setOpen,
}: Props) {
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
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2"
          >
            <div className="bg-orange-500 p-2 rounded-lg">
              <Sun className="w-5 h-5 text-white" />
            </div>

            <span className="font-bold text-lg">
              Power-8
            </span>
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  flex items-center gap-3
                  px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    active
                      ? "bg-orange-500 text-white"
                      : "text-white hover:bg-green-950"
                  }
                `}
              >
                <link.icon className="w-5 h-5" />

                <span className="text-sm font-medium">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}