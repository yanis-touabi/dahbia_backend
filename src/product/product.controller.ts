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

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //  @docs   Admin can create a new product
  //  @Route  POST /product
  //  @access Private [Admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createProductDto: CreateProductDto,
  ) {
    return this.productService.create(createProductDto);
  }

  //  @docs   Any authenticated user can get all products
  //  @Route  GET /product
  //  @access Private [User]
  @Get()
  @Roles([Role.USER, Role.ADMIN])
  @UseGuards(AuthGuard)
  findAll(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    findAllProductsDto: FindAllProductsDto,
  ) {
    return this.productService.findAll(findAllProductsDto);
  }

  //  @docs   Any authenticated user can get a single product
  //  @Route  GET /product/:id
  //  @access Private [User]
  @Get(':id')
  @Roles([Role.USER, Role.ADMIN])
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  //  @docs   Admin can update a product
  //  @Route  PATCH /product/:id
  //  @access Private [Admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  //  @docs   Admin can delete a product
  //  @Route  DELETE /product/:id
  //  @access Private [Admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
