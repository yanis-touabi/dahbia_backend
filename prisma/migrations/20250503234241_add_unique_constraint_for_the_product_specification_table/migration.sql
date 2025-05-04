/*
  Warnings:

  - A unique constraint covering the columns `[productId,sizeId,colorId,materialId]` on the table `ProductSpecification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductSpecification_productId_sizeId_colorId_materialId_key" ON "ProductSpecification"("productId", "sizeId", "colorId", "materialId");
