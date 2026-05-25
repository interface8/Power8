"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { usePathname } from "next/navigation";

export function HeaderBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  return (
    <div className="min-w-0">
      <p
        className="
          hidden text-xs
          font-medium uppercase
          tracking-[0.2em]
          text-gray-400
          sm:block
        "
      >
        Admin Panel
      </p>

      <div
        className="
          mt-0.5 flex
          min-w-0 items-center
          gap-1 overflow-x-auto
          whitespace-nowrap
          scrollbar-hide
        "
      >
        {pathname === "/admin/dashboard" ? (
          <h1
            className="
              text-lg font-semibold
              text-gray-900
            "
          >
            Dashboard
          </h1>
        ) : (
          <>
            <Link
              href="/admin/dashboard"
              className="
                text-sm font-medium
                text-gray-500
                transition-colors
                hover:text-orange-600
              "
            >
              Dashboard
            </Link>

            {segments
              .slice(1)
              .map((segment, index) => {
                const href =
                  "/" +
                  segments
                    .slice(0, index + 2)
                    .join("/");

                const isLast =
                  index ===
                  segments.slice(1).length - 1;

                return (
                  <div
                    key={segment}
                    className="
                      flex items-center gap-1
                    "
                  >
                    <ChevronRight
                      className="
                        h-4 w-4 text-gray-300
                      "
                    />

                    <Link
                      href={href}
                      className={`
                        capitalize text-sm
                        transition-colors
                        ${
                          isLast
                            ? `
                              font-semibold
                              text-gray-900
                            `
                            : `
                              font-medium
                              text-gray-500
                              hover:text-orange-600
                            `
                        }
                      `}
                    >
                      {segment.replace(
                        /-/g,
                        " ",
                      )}
                    </Link>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}