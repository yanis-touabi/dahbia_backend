/*
  Warnings:

  - You are about to drop the column `color` on the `CartItem` table. All the data in the column will be lost.
  - Added the required column `colorId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materialId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "color",
ADD COLUMN     "colorId" INTEGER NOT NULL,
ADD COLUMN     "materialId" INTEGER NOT NULL,
ADD COLUMN     "sizeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
