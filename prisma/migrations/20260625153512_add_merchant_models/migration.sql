-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'MERCHANT');

-- CreateEnum
CREATE TYPE "MerchantStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MerchantApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE "merchants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "cacNumber" TEXT NOT NULL,
    "cacDocumentUrl" TEXT NOT NULL,
    "governmentIdUrl" TEXT NOT NULL,
    "logoUrl" TEXT,
    "status" "MerchantStatus" NOT NULL DEFAULT 'PENDING',
    "suspensionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_products" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "warranty" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "approvalStatus" "MerchantApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_bundles" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "systemCapacityKw" DECIMAL(10,2),
    "description" TEXT,
    "approvalStatus" "MerchantApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_bundle_items" (
    "id" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "merchantProductId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "merchant_bundle_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchants_userId_key" ON "merchants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "merchants_cacNumber_key" ON "merchants"("cacNumber");

-- AddForeignKey
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_products" ADD CONSTRAINT "merchant_products_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_products" ADD CONSTRAINT "merchant_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_bundles" ADD CONSTRAINT "merchant_bundles_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_bundle_items" ADD CONSTRAINT "merchant_bundle_items_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "merchant_bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_bundle_items" ADD CONSTRAINT "merchant_bundle_items_merchantProductId_fkey" FOREIGN KEY ("merchantProductId") REFERENCES "merchant_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
