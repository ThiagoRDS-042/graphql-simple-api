/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "deleted_at",
ADD COLUMN     "canceled_at" TIMESTAMP(3);
