"use client";

import { useQuery } from "@tanstack/react-query";

import type { AdminCreditsResponse } from "@/types/admin-credit";

interface UseAdminCreditsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

async function fetchCredits(
  params: UseAdminCreditsParams,
): Promise<AdminCreditsResponse> {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  searchParams.set("page", String(params.page ?? 1));

  searchParams.set("limit", String(params.limit ?? 20));

  const response = await fetch(
    `/api/admin/credit-accounts?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch credit accounts");
  }

  return response.json();
}

export function useAdminCredits(params: UseAdminCreditsParams) {
  return useQuery({
    queryKey: ["admin-credits", params],
    queryFn: () => fetchCredits(params),
  });
}
