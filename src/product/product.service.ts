import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Verify related entities exist
    await this.verifyRelatedEntitiesExist(createProductDto);

    const { specifications, ...productData } = createProductDto;

    return this.prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
        data: {
          ...productData,
          images: productData.images || [],
          priceAfterDiscount: productData.priceAfterDiscount || null,
        },
      });

      // Insert product inventory if specifications are provided
      if (specifications && specifications.length > 0) {
        for (const specification of specifications) {
          const { quantity, ...specData } = specification;
          // Insert in the product specification table
          //! verify tat the product specification is unique before creating it
          //! we should also verify this in the front part
          const productSpecification =
            await tx.productSpecification.create({
              data: {
                productId: newProduct.id,
                ...specData,
              },
            });
          if (!productSpecification) {
            throw new Error('Failed to create product specification');
          }
          // Insert the inventory
          await tx.productInventory.create({
            data: {
              productSpecificationId: productSpecification.id,
              quantity: quantity,
            },
          });
        }
      }

      // Return product with full details
      const fullProduct = await tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          category: true,
          brand: true,
          supplier: true,
          productSpecification: {
            include: {
              size: true,
              color: true,
              material: true,
              productInventory: true,
            },
          },
        },
      });

      return {
        status: 200,
        message: 'Product created successfully',
        data: fullProduct,
      };
    });
  }

  private async verifyRelatedEntitiesExist(
    dto: CreateProductDto | UpdateProductDto,
  ) {
    // Verify if the product already exists
    const product = await this.prisma.product.findFirst({
      where: { name: dto.name },
    });

    if (product) {
      throw new ConflictException(
        `Product with name ${dto.name} already exists`,
      );
    }

    // Verify category exists
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${dto.categoryId} not found`,
        );
      }
    }

    // Verify brand exists
    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });
      if (!brand) {
        throw new NotFoundException(
          `Brand with ID ${dto.brandId} not found`,
        );
      }
    }

    // Verify supplier exists
    if (dto.supplierId) {
      const supplier = await this.prisma.supplier.findUnique({
        where: { id: dto.supplierId },
      });
      if (!supplier) {
        throw new NotFoundException(
          `Supplier with ID ${dto.supplierId} not found`,
        );
      }
    }
  }

  async findAll(dto: FindAllProductsDto) {
    // Validate pagination parameters
    const page = Math.max(1, dto.page);
    const limit = Math.min(Math.max(1, dto.limit), 100); // Limit max page size to 100

    // Build where clause with type safety
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      AND: [
        dto.categoryId ? { categoryId: dto.categoryId } : undefined,
        dto.brandId ? { brandId: dto.brandId } : undefined,
        {
          price: {
            ...(dto.minPrice !== undefined && { gte: dto.minPrice }),
            ...(dto.maxPrice !== undefined && { lte: dto.maxPrice }),
          },
        },
      ].filter(Boolean),
    };

    // Add search conditions if provided
    if (dto.search) {
      where.OR = [
        { name: { contains: dto.search, mode: 'insensitive' } },
        {
          description: { contains: dto.search, mode: 'insensitive' },
        },
        { sku: { contains: dto.search, mode: 'insensitive' } },
        // { tags: { has: search } }, // Removed since tags field doesn't exist
      ];
    }

    // Define valid sort fields and default sorting
    const validSortFields = new Set([
      'name',
      'price',
      'createdAt',
      'rating',
    ]);
    const isValidSortField =
      dto.sortField && validSortFields.has(dto.sortField);
    const sortDirection = dto.sortOrder === 'asc' ? 'asc' : 'desc';

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [isValidSortField ? dto.sortField : 'createdAt']: sortDirection,
    };

    // Execute single transaction for both count and find
    const [total, products] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        include: {
          category: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
          productSpecification: {
            include: {
              size: true,
              color: true,
              material: true,
              productInventory: true,
            },
          },
        },
        orderBy,
      }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      status: 200,
      message: 'Products retrieved successfully',
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: true,
        brand: true,
        supplier: true,
        productSpecification: {
          include: {
            size: true,
            color: true,
            material: true,
            productInventory: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      status: 200,
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Check if product exists
    await this.findOne(id);

    // Verify related entities exist
    await this.verifyRelatedEntitiesExist(updateProductDto);

    return this.prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          ...updateProductDto,
          images: updateProductDto.images || undefined,
        },
        include: {
          category: true,
          brand: true,
          supplier: true,
          productSpecification: {
            include: {
              size: true,
              color: true,
              material: true,
              productInventory: true,
            },
          },
        },
      });

      return {
        status: 200,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    });
  }

  async remove(id: number) {
    // Soft delete by setting deletedAt
    const deletedProduct = await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return {
      status: 200,
      message: 'Product deleted successfully',
      data: deletedProduct,
    };
  }
}
