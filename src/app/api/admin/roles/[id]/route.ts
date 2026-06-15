import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { roleService, updateRoleSchema } from "@/modules/roles";

// GET /api/admin/roles/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiPermissionFor("roles", "view");
  if (isErrorResponse(guard)) return guard;

  try {
    const data = await roleService.getRoleDetailsByIdAdmin(params.id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch role";
    if (message === "Role not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}

// PATCH /api/admin/roles/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiPermissionFor("roles", "edit");
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = updateRoleSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return errorResponse(firstError, 400);
    }

    const data = await roleService.updateRoleAdmin(params.id, parsed.data);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update role";
    if (message === "Role not found") return errorResponse(message, 404);
    if (message.includes("already exists")) return errorResponse(message, 409);
    return errorResponse(message, 500);
  }
}

// DELETE /api/admin/roles/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiPermissionFor("roles", "delete");
  if (isErrorResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  try {
    const result = await roleService.deleteRoleAdmin(params.id, force);

    if (!result.deleted) {
      return jsonResponse(
        {
          message: "Cannot delete role because it has users assigned. Use force=true to delete anyway.",
          affectedUsers: result.affectedUsers,
          warning: result.warning,
        },
        409,
      );
    }

    return jsonResponse({
      message: "Role deleted successfully",
      affectedUsers: result.affectedUsers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete role";
    if (message === "Role not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}