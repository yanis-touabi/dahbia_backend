import { Injectable, NotFoundException } from '@nestjs/common';
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

    return this.prisma.$transaction(async (tx) => {
      // Create inventory first
      const inventory = await tx.productInventory.create({
        data: {
          quantity: createProductDto.quantity || 0,
        },
      });

      // Then create product with inventory relation
      // Remove quantity from product data since it's only used for inventory
      const { quantity, ...productData } = createProductDto;

      const newProduct = await tx.product.create({
        data: {
          ...productData,
          inventoryId: inventory.id,
          images: createProductDto.images || [],
          colors: createProductDto.colors || [],
          specifications: {
            create: createProductDto.specifications || [],
          },
        },
        include: {
          category: true,
          subCategory: true,
          brand: true,
          supplier: true,
          inventory: true,
          specifications: true,
        },
      });

      return {
        status: 200,
        message: 'Product created successfully',
        data: newProduct,
      };
    });
  }

  private async verifyRelatedEntitiesExist(
    dto: CreateProductDto | UpdateProductDto,
  ) {
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

    // Verify subCategory exists
    if (dto.subCategoryId) {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: { id: dto.subCategoryId },
      });
      if (!subCategory) {
        throw new NotFoundException(
          `SubCategory with ID ${dto.subCategoryId} not found`,
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
          subCategory: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
          inventory: true,
          specifications: true,
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
        subCategory: true,
        brand: true,
        supplier: true,
        inventory: true,
        specifications: true,
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
          colors: updateProductDto.colors || undefined,
          specifications: {
            deleteMany: {},
            create: updateProductDto.specifications || [],
          },
        },
        include: {
          category: true,
          subCategory: true,
          brand: true,
          supplier: true,
          inventory: true,
          specifications: true,
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
