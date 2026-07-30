/*
  Warnings:

  - You are about to drop the `shipping_configs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ShippingActionType" AS ENUM ('SET_PRICE', 'FREE_SHIPPING', 'PERCENTAGE_OFF');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "shippingCarrier" TEXT,
ADD COLUMN     "shippingMethodName" TEXT;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "shipping_configs";

-- CreateTable
CREATE TABLE "shipping_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "estimatedDeliveryTime" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "methodId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "minOrderTotal" DOUBLE PRECISION,
    "maxOrderTotal" DOUBLE PRECISION,
    "minWeight" DOUBLE PRECISION,
    "maxWeight" DOUBLE PRECISION,
    "minItems" INTEGER,
    "maxItems" INTEGER,
    "targetCountries" TEXT[],
    "targetStates" TEXT[],
    "targetZipCodes" TEXT[],
    "isForSubscription" BOOLEAN,
    "requiredCouponId" TEXT,
    "actionType" "ShippingActionType" NOT NULL,
    "actionValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_rules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shipping_rules" ADD CONSTRAINT "shipping_rules_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "shipping_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
