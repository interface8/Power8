"use client"

import { useQuery } from "@tanstack/react-query";

export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const res = await fetch("/api/orders");
            if(!res.ok) throw new Error("Failed to fetch orders")

                const json = await res.json()
                return json.data;
        }
    })

} 