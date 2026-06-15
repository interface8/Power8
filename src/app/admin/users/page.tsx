"use client";

import { useState, useEffect } from "react";
import { useAdminUsers } from "@/hooks/use-admin-users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Eye } from "lucide-react";
import Link from "next/link";

// Takes a full name like "John Doe" and returns "JD"
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Changes a database date like "2024-01-15T00:00:00.000Z" into "Jan 15, 2024"
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Shows a single row of gray placeholder boxes while the table is loading
const SkeletonRow = () => (
  <TableRow className="animate-pulse">
    <TableCell>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-200 rounded-full" />
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32" />
      </div>
    </TableCell>
    <TableCell>
      <div className="h-4 sm:h-5 bg-gray-200 rounded w-28 sm:w-40" />
    </TableCell>
    <TableCell>
      <div className="h-4 sm:h-5 bg-gray-200 rounded w-20 sm:w-28" />
    </TableCell>
    <TableCell>
      <div className="h-4 sm:h-5 bg-gray-200 rounded-full w-12 sm:w-16" />
    </TableCell>
    <TableCell>
      <div className="h-4 sm:h-5 bg-gray-200 rounded w-20 sm:w-24" />
    </TableCell>
    <TableCell>
      <div className="h-8 bg-gray-200 rounded w-14 sm:w-16" />
    </TableCell>
  </TableRow>
);

export default function AdminUsersPage() {
  // What the user is currently typing in the search box
  const [searchInput, setSearchInput] = useState<string>("");
  
  // The actual search term used after the user stops typing (prevents searching on every keystroke)
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  
  // Filter for showing all users, only active, or only inactive
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  
  // Which page of results we are currently viewing
  const [page, setPage] = useState<number>(1);
  
  // How many users to show per page
  const limit = 5;

  // Wait 200ms after the user stops typing before actually searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Go back to the first page when searching for something new
    }, 200);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Convert the filter value to the format the API expects
  // "all" becomes undefined (no filter), "active" becomes true, "inactive" becomes false
  const isActiveFilter = statusFilter === "all" ? undefined : statusFilter === "active";

  // Fetch the list of users from the API with the current filters
  const { data, loading, error } = useAdminUsers({
    search: debouncedSearch || undefined,
    isActive: isActiveFilter,
    page,
    limit,
  });

  // Extract data from the API response, or use empty defaults if not available yet
  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Show skeleton placeholders while the first page of users is loading
  if (loading && users.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Users</h1>

        <div className="flex flex-col gap-3 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 h-11 bg-gray-200 rounded animate-pulse" />
              <div className="w-full sm:w-44 h-11 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="w-full" style={{ minWidth: "700px" }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">NAME</TableHead>
                    <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">EMAIL</TableHead>
                    <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">PHONE</TableHead>
                    <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">STATUS</TableHead>
                    <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">DATE JOINED</TableHead>
                    <TableHead className="text-xs sm:text-base font-semibold text-gray-500 w-24 whitespace-nowrap">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If the API returned an error, show an error message
  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Users</h1>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm sm:text-base">
          Error loading users: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Users</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            
            {/* Search Input - magnifying glass icon on the left */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 w-full h-11 text-sm sm:text-base"
              />
            </div>

            {/* Status Filter Dropdown - All Users / Active / Inactive */}
            <div className="w-full sm:w-44">
              <Select
                value={statusFilter}
                onValueChange={(val: "all" | "active" | "inactive") => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 text-sm sm:text-base w-full">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Small loading text that appears when searching for new results */}
      {loading && users.length > 0 && (
        <div className="text-xs sm:text-sm text-gray-500 text-center py-2">
          Searching...
        </div>
      )}

      {/* Users Table - scrolls horizontally on mobile phones */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="w-full" style={{ minWidth: "700px" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b-0"> 
                  <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">NAME</TableHead>
                  <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">EMAIL</TableHead>
                  <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">PHONE</TableHead>
                  <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">STATUS</TableHead>
                  <TableHead className="text-xs sm:text-base font-semibold text-gray-500 whitespace-nowrap">DATE JOINED</TableHead>
                  <TableHead className="text-xs sm:text-base font-semibold text-gray-500 w-24 whitespace-nowrap">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 text-sm sm:text-base">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow 
                      key={user.id} 
                      className={`
                        hover:bg-gray-50
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        border-b-0
                      `}
                    >
                      {/* Name column with avatar circle and initials */}
                      <TableCell className="border-b-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                            <AvatarFallback className="bg-orange-50 text-orange-500 text-xs sm:text-sm font-bold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm sm:text-base text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </TableCell>
                      
                      {/* Email column - light gray text */}
                      <TableCell className="text-sm sm:text-base font-medium border-b-0 text-gray-500">
                        {user.email}
                      </TableCell>
                      
                      {/* Phone column - light gray text */}
                      <TableCell className="text-sm sm:text-base font-medium border-b-0 text-gray-500">
                        {user.phone}
                      </TableCell>
                      
                      {/* Status badge - green for active, gray for inactive */}
                      <TableCell className="border-b-0">
                        <Badge 
                          variant="secondary"
                          className={
                            user.isActive 
                              ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs sm:text-sm font-medium py-1 px-2 sm:px-3" 
                              : "bg-gray-100 text-gray-600 hover:bg-gray-100 text-xs sm:text-sm font-medium py-1 px-2 sm:px-3"
                          }
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      
                      {/* Date joined column */}
                      <TableCell className="text-sm sm:text-base font-medium border-b-0 text-gray-500 whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      
                      {/* Actions column - eye icon that links to the user detail page */}
                      <TableCell className="border-b-0">
                        <Link 
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">View</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination - only shows when there is more than one page of results */}
      {totalPages > 1 && (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
    <div className="text-xs sm:text-base text-gray-500 text-center sm:text-left">
      Showing {((page - 1) * limit) + 1} to{" "}
      {Math.min(page * limit, total)} of {total} users
    </div>
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(page - 1)}
        disabled={page === 1 || loading}
        className="border-gray-300 hover:bg-orange-100 hover:text-orange-600 text-xs sm:text-base h-8 sm:h-9 px-3 sm:px-4"
      >
        Previous
      </Button>
      
      {/* Show loading dots or page number */}
      {loading ? (
        <div className="flex items-center gap-1 px-2">
          <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" />
          <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce delay-150" />
          <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce delay-300" />
        </div>
      ) : (
        <span className="flex items-center px-2 sm:px-3 text-xs sm:text-base text-gray-600">
          Page {page} of {totalPages}
        </span>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages || loading}
        className="border-gray-300 hover:bg-orange-100 hover:text-orange-600 text-xs sm:text-base h-8 sm:h-9 px-3 sm:px-4"
      >
        Next
      </Button>
    </div>
  </div>
)}
    </div>
  );
}