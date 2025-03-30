import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
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
      console.error('Error in verify Product if exists:', {
        productId,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during product verification',
      );
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
      console.error('Error in create product specification:', {
        createDto,
        error,
      });
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during product specification creation',
      );
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
      console.error(
        'Error in find all product specifications:',
        error,
      );
      throw new InternalServerErrorException(
        'An unexpected error occurred during product specifications retrieval',
      );
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
      console.error('Error in find one product specification:', {
        id,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during product specification retrieval',
      );
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
      console.error('Error in update product specification:', {
        id,
        updateDto,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during product specification update',
      );
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
      console.error('Error in remove product specification:', {
        id,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during product specification deletion',
      );
    }
  }
}
