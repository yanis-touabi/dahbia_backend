import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileService } from '../shared/file/file.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    imageCoverFile: any,
    imageFiles: any[],
  ) {
    try {
      // Verify related entities exist
      await this.verifyRelatedEntitiesExist(
        createProductDto,
        'create',
      );

      const { specifications, ...productData } = createProductDto;

      return this.prisma.$transaction(async (tx) => {
        // Save the image cover
        let imageCover = null;
        if (imageCoverFile || imageCoverFile?.length > 0) {
          imageCover = await this.fileService.saveImage(
            imageCoverFile[0],
          );
        }

        // Save the images
        const images = [];
        if (imageFiles && imageFiles?.length > 0) {
          for (const imageFile of imageFiles) {
            const imageUrl =
              await this.fileService.saveImage(imageFile);
            images.push(imageUrl);
          }
        }

        // Create the product
        const newProduct = await tx.product.create({
          data: {
            ...productData,
            imageCover: imageCover,
            images: images,
            priceAfterDiscount:
              productData.priceAfterDiscount || null,
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
              throw new Error(
                'Failed to create product specification',
              );
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
    } catch (error) {
      console.error('Error in create product:', {
        createProductDto,
        imageCoverFile,
        imageFiles,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during product creation',
      );
    }
  }

  private async verifyRelatedEntitiesExist(
    dto: CreateProductDto | UpdateProductDto | any,
    operation: String,
  ) {
    try {
      // Verify if the product already exists
      if (dto.name && operation === 'create') {
        const product = await this.prisma.product.findFirst({
          where: { name: dto.name },
        });

        if (product) {
          throw new ConflictException(
            `Product with name ${dto.name} already exists`,
          );
        }
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
    } catch (error) {
      console.error('Error in verify related entities exist:', {
        dto,
        operation,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during related entities verification',
      );
    }
  }

  async findAll(dto: FindAllProductsDto) {
    try {
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
              ...(dto.minPrice !== undefined && {
                gte: dto.minPrice,
              }),
              ...(dto.maxPrice !== undefined && {
                lte: dto.maxPrice,
              }),
            },
          },
          dto.isBestSeller !== undefined
            ? { isBestSeller: dto.isBestSeller }
            : undefined,
          dto.isPromo !== undefined
            ? { isPromo: dto.isPromo }
            : undefined,
          dto.isFavorite !== undefined
            ? { isFavorite: dto.isFavorite }
            : undefined,
          dto.gender ? { gender: dto.gender } : undefined,
        ].filter(Boolean),
      };

      // Add size, color, and material filters
      const productSpecificationFilter: Prisma.ProductSpecificationWhereInput =
        {};

      if (dto.size) {
        productSpecificationFilter.size = {
          name: {
            equals: dto.size,
            mode: 'insensitive',
          },
        };
      }

      if (dto.color) {
        productSpecificationFilter.color = {
          name: {
            equals: dto.color,
            mode: 'insensitive',
          },
        };
      }

      if (dto.material) {
        productSpecificationFilter.material = {
          name: {
            equals: dto.material,
            mode: 'insensitive',
          },
        };
      }

      if (Object.keys(productSpecificationFilter).length > 0) {
        where.productSpecification = {
          some: productSpecificationFilter,
        };
      }

      // Add search conditions if provided
      if (dto.search) {
        where.OR = [
          {
            name: { contains: dto.search, mode: 'insensitive' },
          },
          {
            description: {
              contains: dto.search,
              mode: 'insensitive',
            },
          },
          { sku: { contains: dto.search, mode: 'insensitive' } },
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
        [isValidSortField ? dto.sortField : 'createdAt']:
          sortDirection,
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
            tags: true,
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

      // Map products to include full image URLs
      // const formattedProducts = products.map((product) => ({
      //   ...product,
      //   imageCover: product.imageCover
      //     ? `${baseUrl}${product.imageCover}`
      //     : null,
      //   images: product.images
      //     ? product.images.map((image) => `${baseUrl}${image}`)
      //     : [],
      // }));

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
          totalPages,
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      console.error('Error in find all product:', { dto, error });
      throw new InternalServerErrorException(
        'An unexpected error occurred during product retrieval',
      );
    }
  }

  async findOne(id: number) {
    try {
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
        throw new NotFoundException(
          `Product with ID ${id} not found`,
        );
      }

      return {
        status: 200,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      console.error('Error in find a unique product:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during product retrieval',
      );
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    imageCoverFile: any,
    imageFiles: any[],
  ) {
    try {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${id} not found`,
        );
      }

      // Verify related entities exist
      await this.verifyRelatedEntitiesExist(
        updateProductDto,
        'update',
      );

      return await this.prisma.$transaction(async (tx) => {
        let imageCover = product.imageCover; // Keep the old imageCover by default
        let images = product.images || []; // Keep old images by default

        if (imageCoverFile && imageCoverFile.length > 0) {
          // Delete old image cover
          if (product.imageCover) {
            await this.fileService.deleteImage(product.imageCover);
          }

          // Save the image cover
          imageCover = await this.fileService.saveImage(
            imageCoverFile[0],
          );
        }

        if (imageFiles && imageFiles.length > 0) {
          // Delete old images
          if (product.images && product.images.length > 0) {
            await Promise.all(
              product.images.map((img) =>
                this.fileService.deleteImage(img),
              ),
            );
          }
          // Save the images
          images = [];
          if (imageFiles && imageFiles.length > 0) {
            for (const imageFile of imageFiles) {
              const imageUrl =
                await this.fileService.saveImage(imageFile);
              images.push(imageUrl);
            }
          }
        }

        const updatedProduct = await tx.product.update({
          where: { id },
          data: {
            ...updateProductDto,
            imageCover: imageCover,
            images: images,
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
    } catch (error) {
      console.error('Error in update a product:', {
        id,
        updateProductDto,
        imageCoverFile,
        imageFiles,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during product update',
      );
    }
  }

  async remove(id: number) {
    try {
      // first get the product and check if it exists
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${id} not found`,
        );
      }

      // delete the images related to the product
      // Delete the imageCover
      if (product.imageCover) {
        await this.fileService.deleteImage(product.imageCover);
      }
      // Delete old images
      if (product.images && product.images.length > 0) {
        await Promise.all(
          product.images.map((img) =>
            this.fileService.deleteImage(img),
          ),
        );
      }

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
    } catch (error) {
      console.error('Error in remove a product:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during product deletion',
      );
    }
  }
}
