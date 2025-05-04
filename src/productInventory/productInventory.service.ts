import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateProductInventoryDto } from './dto/update-product-inventory.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductInventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const inventories = await this.prisma.productInventory.findMany(
        {
          where: { deletedAt: null },
          include: {
            productSpecification: {
              include: {
                size: true,
                color: true,
                material: true,
                product: true,
              },
            },
          },
        },
      );

      return {
        status: 200,
        message: 'Product inventories retrieved successfully',
        length: inventories.length,
        data: inventories,
      };
    } catch (error) {
      console.error('Error in find all product inventory:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during product inventories retrieval',
      );
    }
  }

  async findOne(productSpecificationId: number) {
    try {
      const inventory = await this.prisma.productInventory.findUnique(
        {
          where: { productSpecificationId },
          include: {
            productSpecification: {
              include: {
                size: true,
                color: true,
                material: true,
                product: true,
              },
            },
          },
        },
      );

      if (!inventory || inventory.deletedAt) {
        throw new NotFoundException('Product inventory not found');
      }

      return {
        status: 200,
        message: 'Product inventory retrieved successfully',
        data: inventory,
      };
    } catch (error) {
      console.error('Error in find one product inventory:', {
        productSpecificationId,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during product inventory retrieval',
      );
    }
  }

  async update(
    id: number,
    updateProductInventoryDto: UpdateProductInventoryDto,
  ) {
    try {
      // Check if inventory exists
      const existingInventory =
        await this.prisma.productInventory.findUnique({
          where: { productSpecificationId: id },
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
          where: { productSpecificationId: id },
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
      console.error('Error in update product inventory:', {
        id,
        updateProductInventoryDto,
        error,
      });
      if (error.code === 'P2025') {
        throw new NotFoundException('Product inventory not found');
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during product inventory update',
      );
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
      console.error('Error in remove a product inventory:', {
        id,
        error,
      });
      if (error.code === 'P2025') {
        throw new NotFoundException('Product inventory not found');
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during product inventory deletion',
      );
    }
  }
}
