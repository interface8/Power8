import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import {
  adminAssignUserRoleSchema,
  adminUsersService,
} from "@/modules/admin-users";

// GET /api/admin/users/:id/roles
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiPermissionFor("users", "view_detail");
  if (isErrorResponse(guard)) return guard;

  try {
    const data = await adminUsersService.getUserRolesById(params.id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user roles";
    if (message === "User not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}

// POST /api/admin/users/:id/roles
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiPermissionFor("permissions", "assign");
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = adminAssignUserRoleSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return errorResponse(firstError, 400);
    }

    const data = await adminUsersService.assignRoleToUser(
      params.id,
      parsed.data.roleId,
    );

    return jsonResponse({ data }, 201);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to assign role";
    if (message === "User not found") return errorResponse(message, 404);
    if (message === "Role not found") return errorResponse(message, 404);
    if (message === "User already has this role") return errorResponse(message, 409);
    return errorResponse(message, 500);
  }
}
