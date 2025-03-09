import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';

@Injectable()
export class ProductSpecificationService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyProductExists(productId: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId, deletedAt: null },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${productId} not found`,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async create(createDto: CreateProductSpecificationDto) {
    try {
      //! verify also if the sizeId, materialId and colorId exist
      await this.verifyProductExists(createDto.productId);

      // Check if specification already exists
      const existingSpec =
        await this.prisma.productSpecification.findFirst({
          where: {
            productId: createDto.productId,
            sizeId: createDto.sizeId,
            colorId: createDto.colorId,
            materialId: createDto.materialId,
          },
        });

      if (existingSpec) {
        throw new ConflictException(
          'Product specification with these attributes already exists',
        );
      }

      const specification =
        await this.prisma.productSpecification.create({
          data: {
            productId: createDto.productId,
            sizeId: createDto.sizeId,
            colorId: createDto.colorId,
            materialId: createDto.materialId,
          },
        });

      if (!specification) {
        throw new NotFoundException(
          'Product specification not created',
        );
      }

      // Create product inventory if quantity is provided
      await this.prisma.productInventory.create({
        data: {
          productSpecificationId: specification.id,
          quantity: createDto.quantity ? createDto.quantity : 0,
        },
      });

      return {
        status: 200,
        message: 'Product specification created successfully',
        data: specification,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const specifications =
        await this.prisma.productSpecification.findMany();
      return {
        status: 200,
        message: 'Product specifications retrieved successfully',
        data: specifications,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const specification =
        await this.prisma.productSpecification.findUnique({
          where: { id },
        });

      if (!specification) {
        throw new NotFoundException(
          `Product specification with ID ${id} not found`,
        );
      }

      return {
        status: 200,
        message: 'Product specification retrieved successfully',
        data: specification,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateDto: UpdateProductSpecificationDto) {
    try {
      const specification = await this.findOne(id);

      await this.prisma.productInventory.update({
        where: { productSpecificationId: id },
        data: {
          quantity: updateDto.quantity,
        },
      });

      return {
        status: 200,
        message: 'Product inventory quantity updated successfully',
        data: specification,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.productSpecification.delete({
        where: { id },
      });

      return {
        status: 200,
        message: 'Product specification deleted successfully',
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }
}
