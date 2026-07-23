import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/http";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ merchantId: string }> },
) {
  try {
    const { merchantId } = await params;

    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId, status: "APPROVED" },
      select: {
        id: true,
        businessName: true,
        businessAddress: true,
        logoUrl: true,
        createdAt: true,
        products: {
          where: { approvalStatus: "APPROVED", isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            warranty: true,
            capacity: true,
            stockQuantity: true,
            images: true,
            category: { select: { name: true } },
            // Pull through to the linked Product record for cart purposes
            product: { select: { id: true } },
          },
        },
        bundles: {
          where: { approvalStatus: "APPROVED", isActive: true },
          select: {
            id: true,
            name: true,
            totalPrice: true,
            systemCapacityKw: true,
            description: true,
            // Pull the linked ProductBundle id for cart
            productBundle: { select: { id: true } },
            items: {
              select: {
                quantity: true,
                merchantProduct: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!merchant) return errorResponse("Merchant not found", 404);

    return jsonResponse({
      data: {
        id: merchant.id,
        businessName: merchant.businessName,
        businessAddress: merchant.businessAddress,
        logoUrl: merchant.logoUrl,
        memberSince: merchant.createdAt,
        products: merchant.products.map((p) => ({
          id: p.product?.id ?? p.id, // use the linked Product id for cart
          merchantProductId: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          warranty: p.warranty,
          capacity: p.capacity,
          stockQuantity: p.stockQuantity,
          imageUrl: p.images[0] ?? null,
          imageUrls: p.images,
          categoryName: p.category.name,
        })),
        bundles: merchant.bundles.map((b) => ({
          id: b.productBundle?.id ?? b.id, // use the linked ProductBundle id for cart
          merchantBundleId: b.id,
          name: b.name,
          totalPrice: Number(b.totalPrice),
          systemCapacityKw: b.systemCapacityKw ? Number(b.systemCapacityKw) : null,
          description: b.description,
          items: b.items.map((item) => ({
            productName: item.merchantProduct.name,
            quantity: item.quantity,
          })),
        })),
      },
    });
  } catch (error) {
    console.error("Storefront error:", error);
    return errorResponse("Failed to load storefront", 500);
  }
}