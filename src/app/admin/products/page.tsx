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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Skeleton row
const SkeletonRow = () => (
  <TableRow className="animate-pulse">
    <TableCell>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="h-5 bg-gray-200 rounded w-32" />
      </div>
    </TableCell>
    <TableCell>
      <div className="h-5 bg-gray-200 rounded w-40" />
    </TableCell>
    <TableCell>
      <div className="h-5 bg-gray-200 rounded w-28" />
    </TableCell>
    <TableCell>
      <div className="h-5 bg-gray-200 rounded-full w-16" />
    </TableCell>
    <TableCell>
      <div className="h-5 bg-gray-200 rounded w-24" />
    </TableCell>
    <TableCell>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded" />
      </div>
    </TableCell>
  </TableRow>
);

export default function AdminUsersPage() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState<number>(1);
  const limit = 20;

  // Debounce search - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const isActiveFilter = statusFilter === "all" ? undefined : statusFilter === "active";

  // Use the hook directly - it will refetch when dependencies change
  const { data, loading, error } = useAdminUsers({
    search: debouncedSearch || undefined,
    isActive: isActiveFilter,
    page,
    limit,
  });

  // Debug log to check if filter is working
  useEffect(() => {
    console.log("Filter changed:", { statusFilter, isActiveFilter, debouncedSearch, page });
  }, [statusFilter, isActiveFilter, debouncedSearch, page]);

  const users = data?.users || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Users</h1>

        <div className="hidden md:block">
          <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center">
            <div className="flex-1 bg-white rounded-lg border p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 h-11 bg-gray-200 rounded animate-pulse" />
                <div className="w-44 h-11 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-base font-semibold">NAME</TableHead>
                  <TableHead className="text-base font-semibold">EMAIL</TableHead>
                  <TableHead className="text-base font-semibold">PHONE</TableHead>
                  <TableHead className="text-base font-semibold">STATUS</TableHead>
                  <TableHead className="text-base font-semibold">DATE JOINED</TableHead>
                  <TableHead className="text-base font-semibold w-24">ACTIONS</TableHead>
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
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Users</h1>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-base">
          Error loading users: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Users</h1>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
        <div className="flex-1 bg-white rounded-lg border p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input with icon */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 w-full h-11 text-base"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="w-full sm:w-44">
              <Select
                value={statusFilter}
                onValueChange={(val: "all" | "active" | "inactive") => {
                  console.log("Dropdown changed to:", val);
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 text-base w-full">
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

      {/* Loading indicator for search */}
      {loading && users.length > 0 && (
        <div className="text-sm text-gray-500 text-center py-2">
          Searching...
        </div>
      )}

      {/* Debug info - remove after testing */}
      <div className="text-xs text-gray-400 mb-2">
        Filter: {statusFilter} | Total: {total} users
      </div>

      {/* Desktop Table View */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-base font-semibold">NAME</TableHead>
                <TableHead className="text-base font-semibold">EMAIL</TableHead>
                <TableHead className="text-base font-semibold">PHONE</TableHead>
                <TableHead className="text-base font-semibold">STATUS</TableHead>
                <TableHead className="text-base font-semibold">DATE JOINED</TableHead>
                <TableHead className="text-base font-semibold w-24">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500 text-base">
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
                    `}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-orange-50 text-orange-500 text-sm font-bold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-base">{user.name}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-base text-gray-500">{user.email}</TableCell>
                    
                    <TableCell className="text-base text-gray-500">{user.phone}</TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={
                          user.isActive 
                            ? "bg-green-100 text-green-700 hover:bg-green-100" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                        }
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-base text-gray-500">{formatDate(user.createdAt)}</TableCell>
                    
                    <TableCell>
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-base">View</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing {((page - 1) * limit) + 1} to{" "}
            {Math.min(page * limit, total)} of {total} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}