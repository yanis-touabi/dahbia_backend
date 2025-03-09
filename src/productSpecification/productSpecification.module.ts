import { Module } from '@nestjs/common';
import { ProductSpecificationService } from './productSpecification.service';
import { ProductSpecificationController } from './productSpecification.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductSpecificationController],
  providers: [ProductSpecificationService],
})
export class ProductSpecificationModule {}
