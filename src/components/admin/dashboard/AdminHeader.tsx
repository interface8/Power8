"use client";

import { useAuth } from "../../providers/auth-provider";

import { HeaderBreadcrumb } from "./shared/HeaderBreadcrumb";

import { HeaderProfile } from "./shared/HeaderProfile";

import { HeaderRoleBadge } from "./shared/HeaderRoleBadge";

import { HeaderStoreButton } from "./shared/HeaderStoreButton";

import { MobileMenuButton } from "./shared/MobileMenuButton";

interface Props {
  setOpen: (open: boolean) => void;
}

export default function AdminHeader({
  setOpen,
}: Props) {
  const { user } = useAuth();

  return (
    <header
      className="
        sticky top-0 z-30
        border-b border-gray-200/80
        bg-white/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex h-18 items-center
          justify-between
          px-4 sm:px-6 lg:px-8
        "
      >
        {/* LEFT */}
        <div
          className="
            flex min-w-0
            items-center gap-3 lg:gap-5
          "
        >
          <MobileMenuButton
            setOpen={setOpen}
          />

          <div className="hidden h-8 w-px bg-gray-200 lg:block" />

          <HeaderBreadcrumb />
        </div>

        {/* RIGHT */}
        <div
          className="
            flex shrink-0
            items-center gap-2
            sm:gap-3 lg:gap-4
          "
        >
          <HeaderStoreButton />

          <HeaderRoleBadge
            role={user?.roles?.[0]}
          />

          <HeaderProfile
            name={user?.name}
          />
        </div>
      </div>
    </header>
  );
}