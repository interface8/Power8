import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminUsersService } from "@/modules/admin-users";

// DELETE /api/admin/users/:id/roles/:roleId
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; roleId: string } },
) {
  const guard = await requireApiPermissionFor("permissions", "assign");
  if (isErrorResponse(guard)) return guard;

  try {
    const data = await adminUsersService.removeRoleFromUser(
      params.id,
      params.roleId,
    );

    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to remove role";
    if (message === "User not found") return errorResponse(message, 404);
    if (message === "User does not have this role") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}
