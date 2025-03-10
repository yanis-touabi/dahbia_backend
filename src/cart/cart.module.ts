import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CartCleanupService } from './cart-cleanup.service';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [CartController],
  providers: [CartService, CartCleanupService],
  exports: [CartService],
})
export class CartModule {}
