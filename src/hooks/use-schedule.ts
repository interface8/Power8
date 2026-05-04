"use client";

import { useQuery } from "@tanstack/react-query";

export function useSchedule(creditId?: string) {
  return useQuery({
    queryKey: ["schedule", creditId],
    queryFn: async () => {
      const res = await fetch(`/api/credit/schedule/${creditId}`);
      if (!res.ok) throw new Error("Failed to fetch schedule");

      const json = await res.json();
      return json.data;
    },
    enabled: !!creditId,
  });
}
