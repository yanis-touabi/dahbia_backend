import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shipping' })
  @ApiResponse({
    status: 201,
    description: 'Shipping created successfully.',
  })
  create(@Body() createShippingDto: CreateShippingDto) {
    return this.shippingService.create(createShippingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shippings' })
  @ApiResponse({ status: 200, description: 'List of shippings.' })
  findAll() {
    return this.shippingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shipping by ID' })
  @ApiResponse({
    status: 200,
    description: 'Shipping found successfully.',
  })
  @ApiResponse({ status: 404, description: 'Shipping not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shippingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shipping' })
  @ApiResponse({
    status: 200,
    description: 'Shipping updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Shipping not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {
    return this.shippingService.update(id, updateShippingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipping' })
  @ApiResponse({
    status: 200,
    description: 'Shipping deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Shipping not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shippingService.remove(id);
  }
}
