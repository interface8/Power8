import Link from "next/link";
import { ChevronLeft, Mail, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitialsFromName, formatDateForDisplay } from "./utils";

interface UserProfileCardProps {
  user: {
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    createdAt: string;
  };
  localIsActive: boolean;
  isUpdating: boolean;
  onToggleStatus: () => void;
}

export function UserProfileCard({
  user,
  localIsActive,
  isUpdating,
  onToggleStatus,
}: UserProfileCardProps) {
  return (
    <>
      {/* Back Button */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Users</span>
      </Link>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Left side - Avatar and user details */}
          <div className="flex gap-4">
            <div className="flex items-center">
              <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                <AvatarFallback className="bg-orange-50 text-orange-500 text-lg sm:text-xl font-bold">
                  {getInitialsFromName(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.name}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-500 text-sm sm:text-base">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate max-w-45 sm:max-w-none">
                    {user.email}
                  </span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span>{user.phone}</span>
              </div>

              <Badge
                className={`${
                  localIsActive
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-red-600 text-white hover:bg-red-600"
                }`}
              >
                {localIsActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* Right side - Toggle Status Button */}
          <Button
            onClick={onToggleStatus}
            disabled={isUpdating}
            className={`flex items-center justify-center gap-2 w-full sm:w-auto ${
              localIsActive
                ? "bg-white text-red-600 border border-red-600 hover:bg-red-50"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <Shield className="h-4 w-4" />
            {isUpdating
              ? "Updating..."
              : localIsActive
                ? "Deactivate Account"
                : "Activate Account"}
          </Button>
        </div>

        <hr className="my-4 border-t border-gray-200" />

        <p className="text-xs sm:text-sm text-gray-400">
          Member since {formatDateForDisplay(user.createdAt)}
        </p>
      </div>
    </>
  );
}
