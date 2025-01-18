import { Module } from '@nestjs/common';
import { ProductSpecificationService } from './productSpecification.service';
import { ProductSpecificationController } from './productSpecification.controller';

@Module({
  controllers: [ProductSpecificationController],
  providers: [ProductSpecificationService],
})
export class SpecificationModule {}
