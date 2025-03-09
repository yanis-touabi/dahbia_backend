import { Module } from '@nestjs/common';
import { SpecificationService } from './specifications.service';
import { SpecificationController } from './specifications.controller';

@Module({
  controllers: [SpecificationController],
  providers: [SpecificationService],
})
export class SpecificationModule {}
