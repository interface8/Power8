import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { roleService, createRoleSchema } from "@/modules/roles";

// GET /api/admin/roles
// GET /api/admin/roles
export async function GET() {
  const guard = await requireApiPermissionFor("roles", "view");
  if (isErrorResponse(guard)) return guard;

  try {
    const data = await roleService.listRolesAdmin();
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch roles";
    return errorResponse(message, 500);
  }
}

// POST /api/admin/roles
// POST /api/admin/roles
export async function POST(request: NextRequest) {
  const guard = await requireApiPermissionFor("roles", "create");
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = createRoleSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return errorResponse(firstError, 400);
    }

    const data = await roleService.createRoleAdmin(parsed.data);
    return jsonResponse({ data }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create role";
    if (message.includes("already exists")) return errorResponse(message, 409);
    return errorResponse(message, 500);
  }
}