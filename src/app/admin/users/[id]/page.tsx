"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminUser, useUpdateUserStatus } from "@/hooks/use-admin-users";
import {
  useUserRoles,
  useAvailableRolesForUser,
  useAssignRoleToUser,
  useRemoveRoleFromUser,
} from "@/hooks/use-admin-user-roles";
import { UserRolesSection } from "@/components/admin/roles/user-role-assign/UserRolesSection";
import { UserProfileCard } from "@/components/admin/users/UserProfileCard";
import { UserTabs } from "@/components/admin/users/UsersTabs";
import { UserOrdersTable } from "@/components/admin/users/UserOrdersTable";
import { UserSolarSystemsTable } from "@/components/admin/users/UserSolarSystemTable";
import { UserCreditAccountsTable } from "@/components/admin/users/UserCreditAccountsTable";
import { UserSavingsTable } from "@/components/admin/users/UserSavingsTable";
import { UserDetailSkeleton } from "@/components/admin/users/UserDetailSkeleton";
import {
  placeholderOrders,
  placeholderSolarSystems,
  placeholderCreditAccounts,
  placeholderSavings,
} from "@/components/admin/users/utils";

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const [activeTab, setActiveTab] = useState<string>("orders");
  const [localIsActive, setLocalIsActive] = useState<boolean>(true);

  // User roles hooks
  const { data: userRolesData } = useUserRoles(userId);
  const { data: availableRolesData } = useAvailableRolesForUser(userId);
  const assignRole = useAssignRoleToUser();
  const removeRole = useRemoveRoleFromUser();

  const userRoles = userRolesData?.data || [];
  const availableRoles = availableRolesData?.data || [];

  // User data hooks
  const { data: userData, loading: isLoading } = useAdminUser(userId);
  const { updateStatus, loading: isUpdating } = useUpdateUserStatus();

  const user = userData?.user;
  const hasError = userData === undefined && !isLoading; 

  // When the user data first loads, update local active status
  useEffect(() => {
    if (user) {
      setLocalIsActive(user.isActive);
    }
  }, [user]);

  // Use real data or placeholders
  const orders = userData?.orders?.length ? userData.orders : placeholderOrders;
  const solarSystems = userData?.solarSystems?.length ? userData.solarSystems : placeholderSolarSystems;
  const creditAccounts = userData?.creditAccounts?.length ? userData.creditAccounts : placeholderCreditAccounts;
  const savings = userData?.savings?.length ? userData.savings : placeholderSavings;

const handleToggleUserStatus = async () => {
  if (!user) return;
  const newStatus = !localIsActive;
  setLocalIsActive(newStatus);
  try {
    await updateStatus(userId, newStatus);
  } catch (error) {
    console.error("Failed to update user status:", error);
    setLocalIsActive(!newStatus);
  }
};

  if (isLoading) return <UserDetailSkeleton />;

  if (hasError || !userData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          Failed to load user details. Please try again.
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-base">User not found</p>
          <Link href="/admin/users" className="text-orange-600 hover:text-orange-700 mt-2 inline-block">
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <UserProfileCard
        user={user}
        localIsActive={localIsActive}
        isUpdating={isUpdating}
        onToggleStatus={handleToggleUserStatus}
      />

      <div className="bg-white p-4 sm:p-6 rounded-lg">
        <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <UserRolesSection
          userRoles={userRoles}
          availableRoles={availableRoles}
          onRemoveRole={async (roleId) => {
            await removeRole.mutateAsync({ userId, roleId });
          }}
          onAssignRole={async (roleId) => {
            await assignRole.mutateAsync({ userId, roleId });
          }}
          isLoading={assignRole.isPending || removeRole.isPending}
        />

        <div className="mt-6 overflow-x-auto overflow-y-hidden">
          {activeTab === "orders" && <UserOrdersTable orders={orders} />}
          {activeTab === "solarSystems" && <UserSolarSystemsTable solarSystems={solarSystems} />}
          {activeTab === "creditAccounts" && <UserCreditAccountsTable creditAccounts={creditAccounts} />}
          {activeTab === "savings" && <UserSavingsTable savings={savings} />}
        </div>
      </div>
    </div>
  );
}