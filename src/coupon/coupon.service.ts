import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async create(createCouponDto: CreateCouponDto) {
    try {
      const coupon = await this.prisma.coupon.findUnique({
        where: {
          code: createCouponDto.code,
        },
      });
      if (coupon) {
        return new HttpException('Coupon already exist', 400);
      }

      const newCoupon = await this.prisma.coupon.create({
        data: {
          ...createCouponDto,
          startDate: new Date(
            createCouponDto.startDate,
          ).toISOString(),
          endDate: new Date(createCouponDto.endDate).toISOString(),
        },
      });

      return {
        status: 200,
        message: 'Coupon created successfully',
        data: newCoupon,
      };
    } catch (error) {
      console.error('Error in create:', {
        code: createCouponDto.code,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during create coupon',
      );
    }
  }

  async findAll() {
    try {
      const coupons = await this.prisma.coupon.findMany();
      return {
        status: 200,
        message: 'Coupons found',
        length: coupons.length,
        data: coupons,
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during findAll coupon',
      );
    }
  }

  async findOne(id: number) {
    try {
      const coupon = await this.prisma.coupon.findUnique({
        where: {
          id: id,
        },
      });
      if (!coupon) {
        return new NotFoundException('Coupon not found');
      }

      return {
        status: 200,
        message: 'Coupon found',
        data: coupon,
      };
    } catch (error) {
      console.error('Error in findOne:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during findOne coupon',
      );
    }
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    try {
      const coupon = await this.prisma.coupon.findUnique({
        where: {
          id: id,
        },
      });
      if (!coupon) {
        return new NotFoundException('Coupon not found');
      }

      const updatedCoupon = await this.prisma.coupon.update({
        where: {
          id: id,
        },
        data: {
          ...updateCouponDto,
          startDate: new Date(
            updateCouponDto.startDate,
          ).toISOString(),
          endDate: new Date(updateCouponDto.endDate).toISOString(),
        },
      });

      return {
        status: 200,
        message: 'Coupon updated successfully',
        data: updatedCoupon,
      };
    } catch (error) {
      console.error('Error in update:', {
        id,
        updateCouponDto,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during update the coupon',
      );
    }
  }

  async remove(id: number) {
    try {
      const coupon = await this.prisma.coupon.findUnique({
        where: {
          id: id,
        },
      });
      if (!coupon) {
        return new NotFoundException('Coupon not found');
      }
      await this.prisma.coupon.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error('Error in remove:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during remove the coupon',
      );
    }
  }
}
