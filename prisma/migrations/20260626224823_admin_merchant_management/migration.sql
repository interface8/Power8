-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MerchantActivityType" ADD VALUE 'BUNDLE_SUBMITTED';
ALTER TYPE "MerchantActivityType" ADD VALUE 'BUNDLE_APPROVED';
ALTER TYPE "MerchantActivityType" ADD VALUE 'BUNDLE_REJECTED';
ALTER TYPE "MerchantActivityType" ADD VALUE 'MERCHANT_APPROVED';
ALTER TYPE "MerchantActivityType" ADD VALUE 'MERCHANT_SUSPENDED';
ALTER TYPE "MerchantActivityType" ADD VALUE 'MERCHANT_REINSTATED';
