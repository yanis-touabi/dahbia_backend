import { Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisTestController } from './redis.controller';

// import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './subCategory/sub-category.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductModule } from './product/product.module';
import { ProductInventoryModule } from './productInventory/productInventory.module';
import { SpecificationModule } from './specifications/specifications.module';
import { ProductSpecificationModule } from './productSpecification/productSpecification.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { TagModule } from './tag/tag.module';
import { ShippingModule } from './shipping/shipping.module';
// import { SocialMediaModule } from './socialMedia/socialMedia.module';
import { ContactModule } from './contact/contact.module';
import { CompanyInfoModule } from './company-info/company-info.module';
import { HighlightModule } from './highlight/highlight.module';
import { SharedModule } from './shared/shared.module';
import { MailModule } from './mail/mail.module';
import { WilayaModule } from './wilaya/wilaya.module';
import * as redisStore from 'cache-manager-ioredis';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true, // ✅ Makes it available app-wide
      useFactory: async () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 60,
      }),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    // MailerModule.forRoot({
    //   transport: {
    //     service: 'gmail',
    //     auth: {
    //       user: process.env.EMAIL_USERNAME,
    //       pass: process.env.EMAIL_PASSWORD,
    //     },
    //   },
    // }),
    MailModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    CouponModule,
    SuppliersModule,
    ProductModule,
    ProductInventoryModule,
    ProductSpecificationModule,
    SpecificationModule,
    CartModule,
    OrderModule,
    ShippingModule,
    // SocialMediaModule,
    ContactModule,
    CompanyInfoModule,
    HighlightModule,
    TagModule,
    WilayaModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor, // ✅ Enables auto-caching for all routes
    },
  ],
  controllers: [RedisTestController],
})
export class AppModule {}
