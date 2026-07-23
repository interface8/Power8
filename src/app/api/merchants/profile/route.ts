import { NextRequest } from "next/server";
import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  businessName: z.string().min(2).max(150).optional(),
  businessAddress: z.string().min(2).max(255).optional(),
  logoUrl: z.string().url().optional().nullable(),
});

export async function GET() {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;

  const merchant = await prisma.merchant.findUnique({
    where: { id: auth.merchant.id },
    select: {
      id: true,
      businessName: true,
      businessAddress: true,
      cacNumber: true,
      cacDocumentUrl: true,
      governmentIdUrl: true,
      logoUrl: true,
      status: true,
      suspensionReason: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!merchant) return errorResponse("Merchant not found", 404);

  return jsonResponse({ data: merchant });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Validation failed";
      return errorResponse(first, 400);
    }

    const updated = await prisma.merchant.update({
      where: { id: auth.merchant.id },
      data: {
        ...(parsed.data.businessName !== undefined ? { businessName: parsed.data.businessName } : {}),
        ...(parsed.data.businessAddress !== undefined ? { businessAddress: parsed.data.businessAddress } : {}),
        ...(parsed.data.logoUrl !== undefined ? { logoUrl: parsed.data.logoUrl } : {}),
      },
      select: {
        id: true,
        businessName: true,
        businessAddress: true,
        logoUrl: true,
        status: true,
      },
    });

    return jsonResponse({ data: updated, message: "Profile updated successfully" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update profile";
    return errorResponse(message, 500);
  }
}
