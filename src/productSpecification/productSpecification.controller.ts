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

@Controller('product-specification')
export class ProductSpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) {}

  //  @docs   Admin Can create a new Product Specification
  //  @Route  POST /product-specification
  //  @access Private [Amdin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
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
  findAll(@Query('productId', ParseIntPipe) productId: number) {
    return this.productSpecificationService.findAll(productId);
  }

  //  @docs   Any User Can get single Product Specification
  //  @Route  GET /product-specification
  //  @access Public
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productSpecificationService.findOne(id);
  }

  //  @docs   Admin can update a Product Specification
  //  @Route  PATCH /api/v1/product-specification
  //  @access Private [admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
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
  //  @Route  DELETE /api/v1/product-specification
  //  @access Private [admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productSpecificationService.remove(id);
  }
}
