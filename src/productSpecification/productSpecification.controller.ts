import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductSpecificationService } from './productSpecification.service';
import { CreateProductSpecificationDto } from './dto/create-product-specification.dto';
import { UpdateProductSpecificationDto } from './dto/update-product-specification.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/user/guard/Auth.guard';

@ApiTags('Product Specifications')
@Controller('product-specifications')
export class ProductSpecificationController {
  constructor(
    private readonly service: ProductSpecificationService,
  ) {}

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new product specification' })
  @ApiResponse({ status: 201, type: Object })
  async create(@Body() createDto: CreateProductSpecificationDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product specifications' })
  @ApiResponse({
    status: 200,
    type: Object,
  })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product specification by ID' })
  @ApiResponse({ status: 200, type: Object })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a product specification' })
  @ApiResponse({ status: 200, type: Object })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductSpecificationDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product specification' })
  @ApiResponse({ status: 200, type: Object })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
