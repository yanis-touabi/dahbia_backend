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
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductSpecificationService } from './productSpecification.service';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Product Specification') // Organizes endpoints in Swagger UI
@Controller('product-specification')
export class ProductSpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) {}

  //  @docs   Admin Can create a new Product Specification
  //  @Route  POST /product-specification
  //  @access Private [Admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Product Specification' }) // Describe endpoint
  @ApiResponse({
    status: 201,
    description: 'Product specification successfully created.',
  }) // Response info
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createProductSpecificationDto: CreateProductSpecificationDto,
  ) {
    return this.productSpecificationService.create(
      createProductSpecificationDto,
    );
  }

  //  @docs   Any User Can get all Products Specifications
  //  @Route  GET /product-specification
  //  @access Public
  @Get()
  @ApiOperation({ summary: 'Get all Product Specifications' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'List of all product specifications.',
  }) // Response info
  findAll(@Query('productId', ParseIntPipe) productId: number) {
    return this.productSpecificationService.findAll(productId);
  }

  //  @docs   Any User Can get single Product Specification
  //  @Route  GET /product-specification/:id
  //  @access Public
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Product Specification' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Product specification details.',
  }) // Response info
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productSpecificationService.findOne(id);
  }

  //  @docs   Admin can update a Product Specification
  //  @Route  PATCH /product-specification/:id
  //  @access Private [Admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Product Specification' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Product specification successfully updated.',
  }) // Response info
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateProductSpecificationDto: UpdateProductSpecificationDto,
  ) {
    return this.productSpecificationService.update(
      id,
      updateProductSpecificationDto,
    );
  }

  //  @docs   Admin can delete a Product Specification
  //  @Route  DELETE /product-specification/:id
  //  @access Private [Admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Product Specification' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Product specification successfully deleted.',
  }) // Response info
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productSpecificationService.remove(id);
  }
}
