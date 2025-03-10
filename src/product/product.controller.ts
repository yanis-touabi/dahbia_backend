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
  Query,
  DefaultValuePipe,
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

@ApiTags('Product') // Organizes endpoints in Swagger UI
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //  @docs   Admin can create a new product
  //  @Route  POST /product
  //  @access Private [Admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Product' }) // Describe endpoint
  @ApiResponse({
    status: 201,
    description: 'Product successfully created.',
  }) // Response info
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createProductDto: CreateProductDto,
  ) {
    return this.productService.create(createProductDto);
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
  @ApiOperation({ summary: 'Update a Product' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
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
