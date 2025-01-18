import { Module } from '@nestjs/common';
import { ProductInventoryService } from './productInventory.service';
import { ProductInventoryController } from './productInventory.controller';

@Module({
  controllers: [ProductInventoryController],
  providers: [ProductInventoryService],
})
export class ProductInventoryModule {}
