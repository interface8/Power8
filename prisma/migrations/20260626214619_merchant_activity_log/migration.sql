/*
  Warnings:

  - A unique constraint covering the columns `[merchantBundleId]` on the table `product_bundles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[merchantProductId]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MerchantActivityType" AS ENUM ('PRODUCT_SUBMITTED', 'PRODUCT_APPROVED', 'PRODUCT_REJECTED', 'NEW_ORDER');

-- AlterTable
ALTER TABLE "product_bundles" ADD COLUMN     "merchantBundleId" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "merchantProductId" TEXT;

-- CreateTable
CREATE TABLE "merchant_activity_logs" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "type" "MerchantActivityType" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merchant_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_bundles_merchantBundleId_key" ON "product_bundles"("merchantBundleId");

-- CreateIndex
CREATE UNIQUE INDEX "products_merchantProductId_key" ON "products"("merchantProductId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_merchantProductId_fkey" FOREIGN KEY ("merchantProductId") REFERENCES "merchant_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_bundles" ADD CONSTRAINT "product_bundles_merchantBundleId_fkey" FOREIGN KEY ("merchantBundleId") REFERENCES "merchant_bundles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_activity_logs" ADD CONSTRAINT "merchant_activity_logs_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
