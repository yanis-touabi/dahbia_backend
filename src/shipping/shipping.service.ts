import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async create(createShippingDto: CreateShippingDto) {
    try {
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
    } catch (error) {
      console.error('Error in create shipping:', {
        createShippingDto,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during shipping creation',
      );
    }
  }

  async findAll() {
    try {
      const shippings = await this.prisma.shipping.findMany();
      return {
        status: 200,
        message: 'Shippings found',
        length: shippings.length,
        data: shippings,
      };
    } catch (error) {
      console.error('Error in find all shippings:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during shippings retrieval',
      );
    }
  }

  async findOne(id: number) {
    try {
      const shipping = await this.prisma.shipping.findUnique({
        where: {
          id: id,
        },
      });

      if (!shipping) {
        throw new NotFoundException('Shipping not found');
      }

      return {
        status: 200,
        message: 'Shipping found',
        data: shipping,
      };
    } catch (error) {
      console.error('Error in find one shipping:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during shipping retrieval',
      );
    }
  }

  async update(id: number, updateShippingDto: UpdateShippingDto) {
    try {
      const shipping = await this.prisma.shipping.findUnique({
        where: {
          id: id,
        },
      });

      if (!shipping) {
        throw new NotFoundException('Shipping not found');
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
    } catch (error) {
      console.error('Error in update shipping:', {
        id,
        updateShippingDto,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during shipping update',
      );
    }
  }

  async remove(id: number) {
    try {
      const shipping = await this.prisma.shipping.findUnique({
        where: {
          id: id,
        },
      });

      if (!shipping) {
        throw new NotFoundException('Shipping not found');
      }

      await this.prisma.shipping.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error('Error in remove shipping:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during shipping deletion',
      );
    }
  }
}
