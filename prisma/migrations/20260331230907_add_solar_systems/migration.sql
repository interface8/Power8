-- CreateEnum
CREATE TYPE "SystemStatus" AS ENUM ('ACTIVE', 'LIMITED', 'DISABLED');

-- CreateEnum
CREATE TYPE "ControlAction" AS ENUM ('ENABLE', 'LIMIT', 'DISABLE');

-- CreateTable
CREATE TABLE "solar_systems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "status" "SystemStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solar_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_control_logs" (
    "id" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "action" "ControlAction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_control_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "solar_systems" ADD CONSTRAINT "solar_systems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solar_systems" ADD CONSTRAINT "solar_systems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solar_systems" ADD CONSTRAINT "solar_systems_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "product_bundles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_control_logs" ADD CONSTRAINT "system_control_logs_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "solar_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
