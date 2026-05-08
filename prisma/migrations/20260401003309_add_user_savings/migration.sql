-- CreateTable
CREATE TABLE "user_savings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "estimatedAnnualSavings" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_savings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_savings" ADD CONSTRAINT "user_savings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_savings" ADD CONSTRAINT "user_savings_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "solar_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
