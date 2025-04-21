import { Module } from '@nestjs/common';
import { HighlightService } from './highlight.service';
import { HighlightController } from './highlight.controller';

@Module({
  controllers: [HighlightController],
  providers: [HighlightService],
})
export class HighlightModule {}
