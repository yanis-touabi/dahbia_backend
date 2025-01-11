import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
  HttpException,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  //  @docs   Admin Can create a new Brand
  //  @Route  POST /coupon
  //  @access Private [Amdin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCouponDto: CreateCouponDto,
  ) {
    const isExpired = new Date(createCouponDto.endDate) > new Date();
    if (!isExpired) {
      throw new HttpException("Coupon can't be expired", 400);
    }
    return this.couponService.create(createCouponDto);
  }

  //  @docs   Any User Can get all Coupons
  //  @Route  GET /coupon
  //  @access Public
  @Get()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  findAll() {
    return this.couponService.findAll();
  }

  //  @docs   Any User Can get single Coupon
  //  @Route  GET /coupon
  //  @access Public
  @Get(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.findOne(id);
  }

  //  @docs   Admin can update a Coupon
  //  @Route  PATCH /coupon
  //  @access Private [admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCouponDto: UpdateCouponDto,
  ) {
    const isExpired = new Date(updateCouponDto.endDate) > new Date();
    if (!isExpired) {
      throw new HttpException("Coupon can't be expired", 400);
    }
    return this.couponService.update(id, updateCouponDto);
  }

  //  @docs   Admin can delete a Coupon
  //  @Route  DELETE /coupon
  //  @access Private [admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.remove(id);
  }
}
