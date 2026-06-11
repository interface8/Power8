import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import * as permissionsModule from "@/modules/permissions";

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

// GET /api/admin/permissions
export async function GET() {
  const guard = await requireApiAuth();
  const auth = authorize(guard, "permissions.assign");
  if (isErrorResponse(auth)) return auth;

  try {
    const data = await permissionsModule.permissionService.listPermissionsGrouped();
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch permissions";
    return errorResponse(message, 500);
  }
}