import { getCurrentUser } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  return jsonResponse({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      roles: user.roles,
      permissions: user.permissions,
    },
  });
}