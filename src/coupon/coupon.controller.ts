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

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Coupon' })
  @ApiResponse({
    status: 201,
    description: 'Coupon successfully created.',
  })
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCouponDto: CreateCouponDto,
  ) {
    const isExpired = new Date(createCouponDto.endDate) > new Date();
    if (!isExpired) {
      return new HttpException("Coupon can't be expired", 400);
    }
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all Coupons' })
  @ApiResponse({ status: 200, description: 'List of all coupons.' })
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a single Coupon' })
  @ApiResponse({ status: 200, description: 'Coupon details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.findOne(id);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Coupon' })
  @ApiResponse({
    status: 200,
    description: 'Coupon successfully updated.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCouponDto: UpdateCouponDto,
  ) {
    const isExpired = new Date(updateCouponDto.endDate) > new Date();
    if (!isExpired) {
      return new HttpException("Coupon can't be expired", 400);
    }
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Coupon' })
  @ApiResponse({
    status: 200,
    description: 'Coupon successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.remove(id);
  }
}
