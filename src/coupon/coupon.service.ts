import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        code: createCouponDto.code,
      },
    });
    if (coupon) {
      throw new HttpException('Coupon already exist', 400);
    }

    const newCoupon = await this.prisma.coupon.create({
      data: {
        ...createCouponDto,
        startDate: new Date(createCouponDto.startDate).toISOString(),
        endDate: new Date(createCouponDto.endDate).toISOString(),
      },
    });

    return {
      status: 200,
      message: 'Coupon created successfully',
      data: newCoupon,
    };
  }

  async findAll() {
    const coupons = await this.prisma.coupon.findMany();
    return {
      status: 200,
      message: 'Coupons found',
      length: coupons.length,
      data: coupons,
    };
  }

  async findOne(id: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        id: id,
      },
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return {
      status: 200,
      message: 'Coupon found',
      data: coupon,
    };
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        id: id,
      },
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const updatedCoupon = await this.prisma.coupon.update({
      where: {
        id: id,
      },
      data: {
        ...updateCouponDto,
        startDate: new Date(updateCouponDto.startDate).toISOString(),
        endDate: new Date(updateCouponDto.endDate).toISOString(),
      },
    });

    return {
      status: 200,
      message: 'Coupon updated successfully',
      data: updatedCoupon,
    };
  }

  async remove(id: number): Promise<void> {
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        id: id,
      },
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    await this.prisma.coupon.delete({
      where: {
        id: id,
      },
    });
  }
}
