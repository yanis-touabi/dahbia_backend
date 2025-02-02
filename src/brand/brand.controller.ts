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
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Brand') // Organizes endpoints in Swagger UI
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  //  @docs   Admin Can create a new Brand
  //  @Route  POST /brand
  //  @access Private [Admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Brand' }) // Describe endpoint
  @ApiResponse({
    status: 201,
    description: 'Brand successfully created.',
  }) // Response info
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createBrandDto: CreateBrandDto,
  ) {
    return this.brandService.create(createBrandDto);
  }

  //  @docs   Any User Can get all Brands
  //  @Route  GET /brand
  //  @access Public
  @Get()
  @ApiOperation({ summary: 'Get all Brands' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'List of all brands.' }) // Response info
  findAll() {
    return this.brandService.findAll();
  }

  //  @docs   Any User Can get single Brand
  //  @Route  GET /brand/:id
  //  @access Public
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Brand' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'Brand details.' }) // Response info
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  //  @docs   Admin can update a Brand
  //  @Route  PATCH /brand/:id
  //  @access Private [admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Brand' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Brand successfully updated.',
  }) // Response info
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandService.update(id, updateBrandDto);
  }

  //  @docs   Admin can delete a Brand
  //  @Route  DELETE /brand/:id
  //  @access Private [admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Brand' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Brand successfully deleted.',
  }) // Response info
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}
