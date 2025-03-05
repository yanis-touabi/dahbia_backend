/*
  Warnings:

  - You are about to drop the column `colors` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductSpecification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `ProductInventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSpecification" DROP CONSTRAINT "ProductSpecification_productId_fkey";

-- DropIndex
DROP INDEX "Product_inventoryId_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "colors",
DROP COLUMN "inventoryId";

-- AlterTable
ALTER TABLE "ProductInventory" ADD COLUMN     "colorId" INTEGER,
ADD COLUMN     "materialId" INTEGER,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "sizeId" INTEGER;

-- DropTable
DROP TABLE "ProductSpecification";

-- CreateTable
CREATE TABLE "Size" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
