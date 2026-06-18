import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminSolarSystemsService } from "@/modules/admin-solar-systems";
import type { SystemStatus } from "@prisma/client";

function parseStatus(value: string | null): SystemStatus | undefined {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return undefined;

  if (normalized === "active" || normalized === "enabled") return "ACTIVE";
  if (normalized === "limited") return "LIMITED";
  if (normalized === "disabled") return "DISABLED";

  return undefined;
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: Request) {
  const guard = await requireApiPermissionFor("solar_systems", "view_list");
  if (isErrorResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.trim() || undefined;
  const status = parseStatus(searchParams.get("status"));
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = Math.min(parsePositiveInt(searchParams.get("limit"), 20), 100);

  try {
    const data = await adminSolarSystemsService.listSolarSystems({
      search,
      status,
      page,
      limit,
    });

    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch solar systems";
    return errorResponse(message, 500);
  }
}