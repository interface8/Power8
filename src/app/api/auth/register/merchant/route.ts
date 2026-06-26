import { NextRequest } from "next/server";
import { merchantService, registerMerchantSchema } from "@/modules/merchants";
import { jsonResponse, errorResponse } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerMerchantSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
      return errorResponse(firstError, 400);
    }

    await merchantService.registerMerchant(parsed.data);

    // NOTE: deliberately no token / cookie — merchant cannot log in until approved.
    return jsonResponse(
      {
        message:
          "Your merchant application has been submitted and is under review. You'll be able to log in once it's approved.",
      },
      201,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    if (message.includes("already in use")) return errorResponse(message, 409);
    console.error("Merchant register error:", error);
    return errorResponse("Internal server error", 500);
  }
}
