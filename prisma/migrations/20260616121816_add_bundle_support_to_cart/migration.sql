/*
  Warnings:

  - A unique constraint covering the columns `[cartId,bundleId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemType` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "bundleId" TEXT,
ADD COLUMN     "itemType" "ItemType" NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_bundleId_key" ON "cart_items"("cartId", "bundleId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "product_bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
