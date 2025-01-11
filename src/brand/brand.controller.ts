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

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  //  @docs   Admin Can create a new Brand
  //  @Route  POST /brand
  //  @access Private [Amdin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
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
  findAll() {
    return this.brandService.findAll();
  }

  //  @docs   Any User Can get single Brand
  //  @Route  GET /brand
  //  @access Public
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  //  @docs   Admin can update a Brand
  //  @Route  PATCH /api/v1/brand
  //  @access Private [admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandService.update(id, updateBrandDto);
  }

  //  @docs   Admin can delete a Brand
  //  @Route  DELETE /api/v1/brand
  //  @access Private [admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}
