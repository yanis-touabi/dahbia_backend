import { Module } from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { SpecificationController } from './specification.controller';

@Module({
  controllers: [SpecificationController],
  providers: [SpecificationService],
})
export class ProductSpecificationModule {}
