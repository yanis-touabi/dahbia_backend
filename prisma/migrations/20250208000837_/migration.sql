/*
  Warnings:

  - A unique constraint covering the columns `[productId,quantity,sizeId,colorId,materialId]` on the table `ProductInventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductInventory_productId_quantity_sizeId_colorId_material_key" ON "ProductInventory"("productId", "quantity", "sizeId", "colorId", "materialId");
