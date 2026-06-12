import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminUsersService } from "@/modules/admin-users";

// GET /api/admin/users/:id/available-roles
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiPermissionFor("permissions", "assign");
  if (isErrorResponse(guard)) return guard;

  try {
    const data = await adminUsersService.getAvailableRolesForUser(params.id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch available roles";
    if (message === "User not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}
