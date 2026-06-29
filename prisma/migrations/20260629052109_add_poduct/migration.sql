/*
  Warnings:

  - You are about to drop the column `guestEmail` on the `orders` table. All the data in the column will be lost.
  - Made the column `userId` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "guestEmail",
ALTER COLUMN "userId" SET NOT NULL;
