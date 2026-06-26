import { System, SystemsResponse, ControlLog, SystemFilters } from "@/types/admin-solar-system";

const BASE_URL = "/api/admin/solar-systems";

// GET all solar systems
export async function getSolarSystems(filters: SystemFilters): Promise<SystemsResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.status && filters.status !== "ALL") params.append("status", filters.status);
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));

  const response = await fetch(`${BASE_URL}?${params}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch solar systems");
  return response.json();
}

// GET single system
export async function getSolarSystemById(id: string): Promise<{ data: System }> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch solar system");
  return response.json();
}

// Get system logs
export async function getSolarSystemLogs(id: string): Promise<{ data: ControlLog[] }> {
  const response = await fetch(`${BASE_URL}/${id}/logs`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch system logs");
  return response.json();
}

// Enable system
export async function enableSolarSystem(id: string): Promise<{ data: System }> {
  const response = await fetch(`${BASE_URL}/${id}/enable`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to enable system");
  }
  return response.json();
}

// Disable system
export async function disableSolarSystem(id: string): Promise<{ data: System }> {
  const response = await fetch(`${BASE_URL}/${id}/disable`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to disable system");
  }
  return response.json();
}

// Limit system
export async function limitSolarSystem(id: string): Promise<{ data: System }> {
  const response = await fetch(`${BASE_URL}/${id}/limit`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to limit system");
  }
  return response.json();
}