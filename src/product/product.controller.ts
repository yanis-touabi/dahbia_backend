import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { OptionalParseIntPipe } from './pipes/optional-parse-int.pipe';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Product') // Organizes endpoints in Swagger UI
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageCoverFile', maxCount: 1 },
      { name: 'imageFiles', maxCount: 10 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageCoverFile: {
          type: 'string',
          format: 'binary',
        },
        imageFiles: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        sku: { type: 'string', nullable: true },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        priceAfterDiscount: { type: 'number', nullable: true },
        gender: {
          type: 'string',
          enum: ['MALE', 'FEMALE', 'UNISEX'],
          nullable: true,
        },
        categoryId: { type: 'number', nullable: true },
        supplierId: { type: 'number', nullable: true },
        brandId: { type: 'number', nullable: true },
        isFreeShipping: { type: 'boolean', nullable: true },
        isFavorite: { type: 'boolean', nullable: true },
        isPromo: { type: 'boolean', nullable: true },
        specifications: {
          type: 'array', // Define as array
          items: {
            type: 'object',
            properties: {
              quantity: { type: 'number' },
              sizeId: { type: 'number', nullable: true },
              colorId: { type: 'number', nullable: true },
              materialId: { type: 'number', nullable: true },
            },
          },
          nullable: true,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new Product' }) // Describe endpoint
  @ApiResponse({
    status: 201,
    description: 'Product successfully created.',
  }) // Response info
  create(
    @UploadedFiles()
    files: {
      imageCoverFile?: Express.Multer.File[];
      imageFiles?: Array<Express.Multer.File>;
    },
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createProductDto: CreateProductDto,
  ) {
    return this.productService.create(
      createProductDto,
      files.imageCoverFile,
      files.imageFiles,
    );
  }

  @Post('allProducts')
  @ApiOperation({ summary: 'Get all Products' })
  @ApiResponse({ status: 200, description: 'List of all products.' })
  findAll(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    findAllProductsDto: FindAllProductsDto,
  ) {
    return this.productService.findAll(findAllProductsDto);
  }

  @Get(':id')
  @Roles([Role.USER, Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a single Product' })
  @ApiResponse({ status: 200, description: 'Product details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageCoverFile', maxCount: 1 },
      { name: 'imageFiles', maxCount: 10 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageCoverFile: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        imageFiles: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          nullable: true,
        },
        sku: { type: 'string', nullable: true },
        name: { type: 'string', nullable: true },
        description: { type: 'string', nullable: true },
        price: { type: 'number', nullable: true },
        priceAfterDiscount: { type: 'number', nullable: true },
        isBestSeller: { type: 'boolean', nullable: true },
        gender: {
          type: 'string',
          enum: ['MALE', 'FEMALE', 'UNISEX'],
          nullable: true,
        },
        categoryId: { type: 'number', nullable: true },
        supplierId: { type: 'number', nullable: true },
        brandId: { type: 'number', nullable: true },
        isFreeShipping: { type: 'boolean', nullable: true },
        isFavorite: { type: 'boolean', nullable: true },
        isPromo: { type: 'boolean', nullable: true },
        specifications: {
          type: 'array', // Define as array
          items: {
            type: 'object',
            properties: {
              quantity: { type: 'number' },
              sizeId: { type: 'number', nullable: true },
              colorId: { type: 'number', nullable: true },
              materialId: { type: 'number', nullable: true },
            },
          },
          nullable: true,
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update a Product' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated.',
  })
  update(
    @UploadedFiles()
    files: {
      imageCoverFile?: Express.Multer.File[];
      imageFiles?: Array<Express.Multer.File>;
    },
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(
      id,
      updateProductDto,
      files.imageCoverFile,
      files.imageFiles,
    );
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Product' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
