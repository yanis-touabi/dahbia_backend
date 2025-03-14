import { Injectable } from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async create(createShippingDto: CreateShippingDto) {
    // check if the existing shipping exists or not
    const existingShipping = await this.prisma.shipping.findFirst({
      where: {
        company: createShippingDto.company,
        wilayaId: createShippingDto.wilayaId,
        amount: createShippingDto.amount,
      },
    });

    if (existingShipping) {
      return {
        status: 400,
        message: 'Shipping already exists',
      };
    }

    const newShipping = await this.prisma.shipping.create({
      data: createShippingDto,
    });
    return {
      status: 200,
      message: 'Shipping created successfully',
      data: newShipping,
    };
  }

  async findAll() {
    const shippings = await this.prisma.shipping.findMany();
    return {
      status: 200,
      message: 'Shippings found',
      length: shippings.length,
      data: shippings,
    };
  }

  async findOne(id: number) {
    const shipping = await this.prisma.shipping.findUnique({
      where: {
        id: id,
      },
    });

    if (!shipping) {
      throw new Error('Shipping not found');
    }

    return {
      status: 200,
      message: 'Shipping found',
      data: shipping,
    };
  }

  async update(id: number, updateShippingDto: UpdateShippingDto) {
    const shipping = await this.prisma.shipping.findUnique({
      where: {
        id: id,
      },
    });

    if (!shipping) {
      throw new Error('Shipping not found');
    }

    const updatedShipping = await this.prisma.shipping.update({
      where: {
        id: id,
      },
      data: updateShippingDto,
    });

    return {
      status: 200,
      message: 'Shipping updated successfully',
      data: updatedShipping,
    };
  }

  async remove(id: number) {
    const shipping = await this.prisma.shipping.findUnique({
      where: {
        id: id,
      },
    });

    if (!shipping) {
      throw new Error('Shipping not found');
    }

    await this.prisma.shipping.delete({
      where: {
        id: id,
      },
    });
  }
}
