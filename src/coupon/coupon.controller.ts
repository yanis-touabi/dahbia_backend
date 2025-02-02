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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Coupon') // Organizes endpoints in Swagger UI
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  //  @docs   Admin Can create a new Coupon
  //  @Route  POST /coupon
  //  @access Private [Admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Coupon' }) // Describe endpoint
  @ApiResponse({
    status: 201,
    description: 'Coupon successfully created.',
  }) // Response info
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
  @ApiOperation({ summary: 'Get all Coupons' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'List of all coupons.' }) // Response info
  findAll() {
    return this.couponService.findAll();
  }

  //  @docs   Any User Can get single Coupon
  //  @Route  GET /coupon/:id
  //  @access Public
  @Get(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a single Coupon' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'Coupon details.' }) // Response info
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.findOne(id);
  }

  //  @docs   Admin can update a Coupon
  //  @Route  PATCH /coupon/:id
  //  @access Private [Admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Coupon' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Coupon successfully updated.',
  }) // Response info
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
  //  @Route  DELETE /coupon/:id
  //  @access Private [Admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Coupon' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Coupon successfully deleted.',
  }) // Response info
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.remove(id);
  }
}
