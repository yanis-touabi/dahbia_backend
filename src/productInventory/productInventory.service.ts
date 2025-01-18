import {
  HttpException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateProductInventoryDto } from './dto/update-product-inventory.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ProductInventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const inventories = await this.prisma.productInventory.findMany({
      where: { deletedAt: null },
      include: { product: true },
    });

    return {
      status: 200,
      message: 'Product inventories retrieved successfully',
      length: inventories.length,
      data: inventories,
    };
  }

  async findOne(id: number) {
    const inventory = await this.prisma.productInventory.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!inventory || inventory.deletedAt) {
      throw new NotFoundException('Product inventory not found');
    }

    return {
      status: 200,
      message: 'Product inventory retrieved successfully',
      data: inventory,
    };
  }

  async update(
    id: number,
    updateProductInventoryDto: UpdateProductInventoryDto,
  ) {
    try {
      // Check if inventory exists
      const existingInventory =
        await this.prisma.productInventory.findUnique({
          where: { id },
        });

      if (!existingInventory || existingInventory.deletedAt) {
        throw new NotFoundException('Product inventory not found');
      }

      // Validate quantity
      if (
        updateProductInventoryDto.quantity !== undefined &&
        updateProductInventoryDto.quantity < 0
      ) {
        throw new HttpException('Quantity cannot be negative', 400);
      }

      const updatedInventory =
        await this.prisma.productInventory.update({
          where: { id },
          data: {
            quantity: updateProductInventoryDto.quantity,
            modifiedAt: new Date(),
          },
        });

      return {
        status: 200,
        message: 'Product inventory updated successfully',
        data: updatedInventory,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Product inventory not found');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      // Soft delete implementation
      const inventory = await this.prisma.productInventory.findUnique(
        {
          where: { id },
        },
      );

      if (!inventory || inventory.deletedAt) {
        throw new NotFoundException('Product inventory not found');
      }

      await this.prisma.productInventory.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return {
        status: 200,
        message: 'Product inventory deleted successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Product inventory not found');
      }
      throw error;
    }
  }
}
