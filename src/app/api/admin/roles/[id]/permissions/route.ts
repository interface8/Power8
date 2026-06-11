import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import * as permissionsModule from "@/modules/permissions";
import { replaceRolePermissionsSchema } from "@/modules/permissions";

function authorize(
  guard: Awaited<ReturnType<typeof requireApiAuth>>,
  permission: string,
) {
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);
  if (!guard.permissions.includes(permission)) {
    return errorResponse("Forbidden", 403);
  }
  return guard;
}

// GET /api/admin/roles/:id/permissions
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  const auth = authorize(guard, "permissions.assign");
  if (isErrorResponse(auth)) return auth;

  try {
    const data = await permissionsModule.permissionService.getRolePermissions(params.id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch role permissions";
    if (message === "Role not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}

// PUT /api/admin/roles/:id/permissions
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  const auth = authorize(guard, "permissions.assign");
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = replaceRolePermissionsSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return errorResponse(firstError, 400);
    }

    const data = await permissionsModule.permissionService.replaceRolePermissions(
      params.id,
      parsed.data,
    );

    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update role permissions";
    if (message === "Role not found") return errorResponse(message, 404);
    if (message.includes("invalid")) return errorResponse(message, 400);
    return errorResponse(message, 500);
  }
}