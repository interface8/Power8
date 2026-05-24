import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminUsersService, adminUpdateUserStatusSchema } from "@/modules/admin-users";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  const { id } = await params;

  const body = await request.json();
  const parsed = adminUpdateUserStatusSchema.safeParse(body);
  if (!parsed.success) return errorResponse("Invalid status payload", 400);

  try {
    const result = await adminUsersService.updateUserStatus({
      userId: id,
      adminId: guard.id,
      isActive: parsed.data.isActive,
    });

    return jsonResponse({ data: result });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update user status";
    if (msg === "User not found") return errorResponse(msg, 404);
    return errorResponse(msg, 500);
  }
}