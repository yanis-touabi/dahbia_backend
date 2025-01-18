import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ProductSpecificationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductSpecificationDto: CreateProductSpecificationDto,
  ) {
    // Validate product exists
    const product = await this.prisma.product.findUnique({
      where: { id: createProductSpecificationDto.productId },
    });

    if (!product) {
      throw new BadRequestException('Product does not exist');
    }

    // Check for duplicate key for the same product
    const existingSpec =
      await this.prisma.productSpecification.findFirst({
        where: {
          productId: createProductSpecificationDto.productId,
          key: createProductSpecificationDto.key,
        },
      });

    if (existingSpec) {
      throw new BadRequestException(
        'Specification with this key already exists for this product',
      );
    }

    // Create specification within transaction
    return this.prisma.$transaction(async (tx) => {
      const newSpec = await tx.productSpecification.create({
        data: createProductSpecificationDto,
      });

      // Update product updatedAt timestamp
      await tx.product.update({
        where: { id: createProductSpecificationDto.productId },
        data: { updatedAt: new Date() },
      });

      return {
        status: 201,
        message: 'Product specification created successfully',
        data: newSpec,
      };
    });
  }

  async findAll(productId: number) {
    const specifications =
      await this.prisma.productSpecification.findMany({
        where: { productId },
        orderBy: { id: 'asc' },
      });

    return {
      status: 200,
      message: 'Product specifications retrieved successfully',
      data: specifications,
    };
  }

  async findOne(id: number) {
    const specification =
      await this.prisma.productSpecification.findUnique({
        where: { id },
      });

    if (!specification) {
      throw new NotFoundException('Product specification not found');
    }

    return {
      status: 200,
      message: 'Product specification retrieved successfully',
      data: specification,
    };
  }

  async update(
    id: number,
    updateProductSpecificationDto: UpdateProductSpecificationDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const spec = await tx.productSpecification.findUnique({
        where: { id },
      });

      if (!spec) {
        throw new NotFoundException(
          'Product specification not found',
        );
      }

      // Validate product exists if being updated
      if (updateProductSpecificationDto.productId) {
        const product = await tx.product.findUnique({
          where: { id: updateProductSpecificationDto.productId },
        });

        if (!product) {
          throw new BadRequestException('Product does not exist');
        }
      }

      const updatedSpec = await tx.productSpecification.update({
        where: { id },
        data: updateProductSpecificationDto,
      });

      // Update product updatedAt timestamp
      await tx.product.update({
        where: { id: spec.productId },
        data: { updatedAt: new Date() },
      });

      return {
        status: 200,
        message: 'Product specification updated successfully',
        data: updatedSpec,
      };
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const spec = await tx.productSpecification.findUnique({
        where: { id },
      });

      if (!spec) {
        throw new NotFoundException(
          'Product specification not found',
        );
      }

      await tx.productSpecification.delete({
        where: { id },
      });

      // Update product updatedAt timestamp
      await tx.product.update({
        where: { id: spec.productId },
        data: { updatedAt: new Date() },
      });
    });
  }
}
