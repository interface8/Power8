import { prisma } from "@/lib/prisma";

export async function createMerchantWithUser(data: {
  name: string;
  email: string;
  phone: string;
  hashedPassword: string;
  businessName: string;
  businessAddress: string;
  cacNumber: string;
  cacDocumentUrl: string;
  governmentIdUrl: string;
  logoUrl?: string;
}) {
  // Nested create = atomic: User + Merchant in one transaction
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.hashedPassword,
      userType: "MERCHANT",
      merchant: {
        create: {
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          cacNumber: data.cacNumber,
          cacDocumentUrl: data.cacDocumentUrl,
          governmentIdUrl: data.governmentIdUrl,
          logoUrl: data.logoUrl,
          status: "PENDING",
        },
      },
    },
    select: { id: true, email: true, name: true },
  });
}

export async function emailExists(email: string) {
  return (await prisma.user.count({ where: { email } })) > 0;
}

export async function phoneExists(phone: string) {
  return (await prisma.user.count({ where: { phone } })) > 0;
}

export async function cacNumberExists(cacNumber: string) {
  return (await prisma.merchant.count({ where: { cacNumber } })) > 0;
}
