-- CreateTable
CREATE TABLE "solar_calculations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "appliances" JSONB NOT NULL,
    "config" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "location" TEXT,
    "totalDailyWh" INTEGER NOT NULL,
    "inverterSize" INTEGER NOT NULL,
    "solarPanelWatts" INTEGER NOT NULL,
    "batteryAh" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solar_calculations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "solar_calculations" ADD CONSTRAINT "solar_calculations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
