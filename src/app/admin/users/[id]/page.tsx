"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminUser, useUpdateUserStatus } from "@/hooks/use-admin-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, Mail, Shield } from "lucide-react";

// Types for the placeholder/mock data
type OrderType = {
  id: string;
  totalAmount: number;
  paymentType: string;
  status: string;
  createdAt: string;
};

type SolarSystemType = {
  id: string;
  bundleName: string;
  status: string;
  createdAt: string;
};

type CreditAccountType = {
  id: string;
  totalAmount: number;
  balanceRemaining: number;
  status: string;
  createdAt: string;
};

type SavingType = {
  id: string;
  systemId: string;
  estimatedAnnualSavings: number | null;
  createdAt: string;
};

// Takes a full name like "Kwame Asante" and returns "KA"
function getInitialsFromName(fullName: string): string {
  return fullName
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Changes a database date like "2024-01-15T00:00:00.000Z" into "Jan 15, 2024"
function formatDateForDisplay(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Turns 18500 into "₦18,500" with proper Nigerian currency formatting
function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

// Mock data that shows up when there are no real orders in the database yet
const placeholderOrders: OrderType[] = [
  {
    id: "ORD-0001",
    totalAmount: 18500,
    paymentType: "Credit",
    status: "Active",
    createdAt: "2024-05-15T00:00:00.000Z",
  },
  {
    id: "ORD-0002",
    totalAmount: 9200,
    paymentType: "Bank Transfer",
    status: "Completed",
    createdAt: "2024-04-10T00:00:00.000Z",
  },
  {
    id: "ORD-0003",
    totalAmount: 4500,
    paymentType: "Cash",
    status: "Pending",
    createdAt: "2024-06-01T00:00:00.000Z",
  },
];

// Mock solar systems data for preview when database is empty
const placeholderSolarSystems: SolarSystemType[] = [
  {
    id: "PS8-001-GH",
    bundleName: "8KVA Hybrid Bundle",
    status: "Enabled",
    createdAt: "2024-05-15T00:00:00.000Z",
  },
  {
    id: "PS5-002-GH",
    bundleName: "5KVA Off-Grid Bundle",
    status: "Installed",
    createdAt: "2024-03-20T00:00:00.000Z",
  },
];

// Mock credit account data for preview when database is empty
const placeholderCreditAccounts: CreditAccountType[] = [
  {
    id: "CA-001",
    totalAmount: 18500,
    balanceRemaining: 14800,
    status: "Active",
    createdAt: "2024-05-15T00:00:00.000Z",
  },
  {
    id: "CA-002",
    totalAmount: 9200,
    balanceRemaining: 3200,
    status: "In Progress",
    createdAt: "2024-04-10T00:00:00.000Z",
  },
];

// Mock savings data for preview when database is empty
const placeholderSavings: SavingType[] = [
  {
    id: "SAV-001",
    systemId: "PS8-001-GH",
    estimatedAnnualSavings: 125000,
    createdAt: "2024-05-15T00:00:00.000Z",
  },
  {
    id: "SAV-002",
    systemId: "PS5-002-GH",
    estimatedAnnualSavings: 85000,
    createdAt: "2024-03-20T00:00:00.000Z",
  },
];

// Shows gray placeholder boxes while the real data is loading
function DetailPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-6" />
      
      <div className="bg-white rounded-lg border p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex items-center">
              <div className="h-14 w-14 sm:h-16 sm:w-16 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-6 sm:h-7 bg-gray-200 rounded w-32 sm:w-48 animate-pulse" />
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-48 sm:w-64 animate-pulse" />
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-16 sm:w-20 animate-pulse" />
            </div>
          </div>
          <div className="h-9 bg-gray-200 rounded w-36 animate-pulse sm:self-start" />
        </div>
        <div className="h-px bg-gray-200 w-full my-4" />
        <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-lg">
        <div className="overflow-x-auto overflow-y-hidden pb-3 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-4 sm:gap-8 border-b border-gray-200 min-w-max sm:min-w-0">
            <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        
        <div className="mt-6 overflow-x-auto overflow-y-hidden">
          <div className="w-full" style={{ minWidth: "550px" }}>
            <div className="flex w-full pb-3 border-b border-gray-200">
              <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
              <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
              <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
              <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
              <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex w-full py-3 border-b border-gray-50">
                <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
                <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
                <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
                <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
                <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse mx-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Get the user ID from the URL (e.g., /admin/users/123 -> "123")
  const userId = params.id;
  
  // Keeps track of which tab (Orders, Solar Systems, Credit, Savings) is currently open
  const [activeTab, setActiveTab] = useState<string>("orders");
  
  // Stores the user's active status locally so we can update the UI instantly without waiting for the server
  const [localIsActive, setLocalIsActive] = useState<boolean>(true);
  
  // Fetches all user data (profile, orders, solar systems, credit accounts, savings) from the API
  const { 
    data: userData, 
    loading: isLoading, 
    error: hasError 
  } = useAdminUser(userId);
  
  // Provides a function to call the API that updates the user's status (active/inactive)
  const { 
    updateStatus, 
    loading: isUpdating 
  } = useUpdateUserStatus();
  
  // Extract the user object from the API response
  const user = userData?.user;
  
  // When the user data first loads, update our local copy of their active status
  useEffect(() => {
    if (user) {
      setLocalIsActive(user.isActive);
    }
  }, [user]);
  
  // If real data exists from the API, use it. Otherwise show the mock preview data.
  const orders: OrderType[] = userData?.orders?.length ? userData.orders : placeholderOrders;
  const solarSystems: SolarSystemType[] = userData?.solarSystems?.length ? userData.solarSystems : placeholderSolarSystems;
  const creditAccounts: CreditAccountType[] = userData?.creditAccounts?.length ? userData.creditAccounts : placeholderCreditAccounts;
  const savings: SavingType[] = userData?.savings?.length ? userData.savings : placeholderSavings;
  
  // Called when the user clicks "Deactivate Account" or "Activate Account"
  async function handleToggleUserStatus() {
    if (!user) return;
    
    // Flip the status: if currently active, change to inactive. If inactive, change to active.
    const newStatus = !localIsActive;
    
    // Update the UI immediately (optimistic update) so the user sees the change right away
    setLocalIsActive(newStatus);
    
    try {
      // Tell the API to update the user's status in the database
      const result = await updateStatus(userId, newStatus);
      
      // If the API call failed for any reason, change the UI back to what it was before
      if (!result.data) {
        setLocalIsActive(!newStatus);
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
      // If something went wrong (network error, server error), revert the UI change
      setLocalIsActive(!newStatus);
    }
  }
  
  // While data is loading, show the skeleton placeholders
  if (isLoading) {
    return <DetailPageSkeleton />;
  }
  
  // If the API returned an error, show an error message
  if (hasError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          Failed to load user details. Please try again.
        </div>
      </div>
    );
  }
  
  // If the user doesn't exist in the database, show a "not found" message
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
  
  // Main page render
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      
      {/* Link that takes the user back to the main users list page */}
      <Link 
        href="/admin/users"
        className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Users</span>
      </Link>
      
      {/* Card that displays the user's profile information */}
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-500 text-sm sm:text-base">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate max-w-45 sm:max-w-none">{user.email}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span>{user.phone}</span>
              </div>
              
              {/* Shows "Active" in green or "Inactive" in red based on current status */}
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
          
          {/* Right side - Button that toggles between "Deactivate Account" and "Activate Account" */}
          <Button
            onClick={handleToggleUserStatus}
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
                : "Activate Account"
            }
          </Button>
        </div>

        {/* Horizontal line separating user info from "Member since" */}
        <hr className="my-4 border-t border-gray-200" />
        
        <p className="text-xs sm:text-sm text-gray-400">
          Member since {formatDateForDisplay(user.createdAt)}
        </p>
      </div>
      
      {/* Section containing the tabs and their content */}
      <div className="bg-white p-4 sm:p-6 rounded-lg">
        
        {/* Tab buttons - on mobile you can scroll left/right, on desktop they stay in one row */}
        <div className="overflow-x-auto overflow-y-hidden pb-3 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-4 sm:gap-8 border-b border-gray-200 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "orders"
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Orders
              {/* Orange underline under the active tab that is wider than the text itself */}
              {activeTab === "orders" && (
                <div className="absolute bottom-0 left-[-8px] right-[-8px] h-0.5 bg-orange-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("solarSystems")}
              className={`pb-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "solarSystems"
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Solar Systems
              {activeTab === "solarSystems" && (
                <div className="absolute bottom-0 left-[-8px] right-[-8px] h-0.5 bg-orange-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("creditAccounts")}
              className={`pb-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "creditAccounts"
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Credit Accounts
              {activeTab === "creditAccounts" && (
                <div className="absolute bottom-0 left-[-8px] right-[-8px] h-0.5 bg-orange-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("savings")}
              className={`pb-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "savings"
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Savings
              {activeTab === "savings" && (
                <div className="absolute bottom-0 left-[-8px] right-[-8px] h-0.5 bg-orange-600"></div>
              )}
            </button>
          </div>
        </div>
        
        {/* Content area - tables can scroll horizontally on mobile */}
        <div className="mt-6 overflow-x-auto overflow-y-hidden">
          
          {/* Orders Tab - Shows a table of all the user's orders */}
          {activeTab === "orders" && (
            <div className="w-full" style={{ minWidth: "550px" }}>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">ORDER ID</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">AMOUNT</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">PAYMENT TYPE</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">STATUS</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50">
                        <td className="py-3 text-xs sm:text-sm text-gray-600 truncate">{order.id}</td>
                        <td className="py-3 text-xs sm:text-sm text-gray-600">{formatCurrency(order.totalAmount)}</td>
                        <td className="py-3 text-xs sm:text-sm text-gray-600">{order.paymentType}</td>
                        <td className="py-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs sm:text-sm">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-xs sm:text-sm text-gray-600">{formatDateForDisplay(order.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Solar Systems Tab - Shows the user's solar installations */}
          {activeTab === "solarSystems" && (
            <div className="w-full" style={{ minWidth: "450px" }}>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">DEVICE ID</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">BUNDLE</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {solarSystems.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-12 text-gray-400 text-sm">
                        No solar systems found
                      </td>
                    </tr>
                  ) : (
                    solarSystems.map((system) => (
                      <tr key={system.id} className="border-b border-gray-50">
                        <td className="py-3 text-xs sm:text-sm text-gray-600 truncate">{system.id}</td>
                        <td className="py-3 text-xs sm:text-sm text-gray-600">{system.bundleName}</td>
                        <td className="py-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs sm:text-sm">
                            {system.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Credit Accounts Tab - Shows financing/credit information */}
          {activeTab === "creditAccounts" && (
            <div className="w-full" style={{ minWidth: "500px" }}>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">ACCOUNT ID</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">TOTAL</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">BALANCE</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">STATUS</th>
                  </tr>
                </thead>
                </table>
                <tbody>
                  {creditAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                        No credit accounts found
                      </td>
                    </tr>
                  ) : (
                    creditAccounts.map((account) => (
                      <tr key={account.id} className="border-b border-gray-50">
                        <td className="py-3 text-xs sm:text-sm text-gray-600 truncate">{account.id}</td>
                        <td className="py-3 text-xs sm:text-sm text-gray-600">{formatCurrency(account.totalAmount)}</td>
                        <td className="py-3 text-xs sm:text-sm text-gray-600">{formatCurrency(account.balanceRemaining)}</td>
                        <td className="py-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs sm:text-sm">
                            {account.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              
            </div>
          )}
          
          {/* Savings Tab - Shows estimated savings from solar installations */}
          {activeTab === "savings" && (
            <div className="w-full" style={{ minWidth: "500px" }}>
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">SYSTEM ID</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">ESTIMATED ANNUAL SAVINGS</th>
                    <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {savings.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-12 text-gray-400 text-sm">
                        No savings account data available
                      </td>
                    </tr>
                  ) : (
                    savings.map((saving) => (
                      <tr key={saving.id} className="border-b border-gray-50">
                        <td className="py-3 text-xs sm:text-sm text-gray-600 truncate">{saving.systemId}</td>
                        <td className="py-3 text-xs sm:text-sm text-gray-600">{formatCurrency(saving.estimatedAnnualSavings || 0)}</td>
                        <td className="py-3 text-xs sm:text-sm text-gray-600">{formatDateForDisplay(saving.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}