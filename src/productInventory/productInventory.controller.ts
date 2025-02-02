import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ProductInventoryService } from './productInventory.service';
import { UpdateProductInventoryDto } from './dto/update-product-inventory.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Product Inventory') // Organizes endpoints in Swagger UI
@Controller('product-inventory')
export class ProductInventoryController {
  constructor(
    private readonly productInventoryService: ProductInventoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all Product Inventories' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'List of all product inventories.',
  }) // Response info
  findAll() {
    return this.productInventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single Product Inventory' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Product inventory details.',
  }) // Response info
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productInventoryService.findOne(id);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Product Inventory' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Product inventory successfully updated.',
  }) // Response info
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateProductInventoryDto: UpdateProductInventoryDto,
  ) {
    return this.productInventoryService.update(
      id,
      updateProductInventoryDto,
    );
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Product Inventory' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Product inventory successfully deleted.',
  }) // Response info
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productInventoryService.remove(id);
  }
}
