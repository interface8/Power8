import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminUsersService } from "@/modules/admin-users";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const { id } = await params;
    const data = await adminUsersService.getUserDetailsById(id);
    return jsonResponse({ data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to fetch user";
    if (msg === "User not found") return errorResponse(msg, 404);
    return errorResponse(msg, 500);
  }
}