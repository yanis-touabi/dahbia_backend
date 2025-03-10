import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartCleanupService implements OnModuleInit {
  private readonly CART_EXPIRY_DAYS = 30;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // Run cleanup immediately on startup
    this.cleanupExpiredCarts();
  }

  // @Cron('*/5 * * * * *')
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredCarts() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - this.CART_EXPIRY_DAYS);

    try {
      await this.prisma.cart.deleteMany({
        where: {
          userId: null, // Only delete guest carts
          lastActivityAt: {
            lt: expiryDate,
          },
        },
      });
    } catch (error) {
      console.error('Failed to clean up expired carts:', error);
    }
  }
}
