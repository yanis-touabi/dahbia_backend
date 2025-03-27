import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
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
import { ShippingModule } from './shipping/shipping.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '6000000s' },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
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
    SharedModule,
  ],
})
export class AppModule {}
