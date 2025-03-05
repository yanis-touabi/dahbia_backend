/*
  Warnings:

  - You are about to drop the `wilaya` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shipping" DROP CONSTRAINT "Shipping_wilayaId_fkey";

-- DropTable
DROP TABLE "wilaya";

-- CreateTable
CREATE TABLE "Wilaya" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_wilayaId_fkey" FOREIGN KEY ("wilayaId") REFERENCES "Wilaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
