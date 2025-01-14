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
import { SuppliersService } from './suppliers.service';
import { CreateSuppliersDto } from './dto/create-suppliers.dto';
import { UpdateSuppliersDto } from './dto/update-suppliers.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';

@Controller('supplier')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  //  @docs   Admin Can create a new Suppliers
  //  @Route  POST /suppliers
  //  @access Private [Amdin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createSuppliersDto: CreateSuppliersDto,
  ) {
    return this.suppliersService.create(createSuppliersDto);
  }

  //  @docs   Any User Can get all Suppliers
  //  @Route  GET /suppliers
  //  @access Public
  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  //  @docs   Any User Can get single Suppliers
  //  @Route  GET /suppliers
  //  @access Public
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.findOne(id);
  }

  //  @docs   Admin can update a Suppliers
  //  @Route  PATCH /suppliers
  //  @access Private [admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateSuppliersDto: UpdateSuppliersDto,
  ) {
    return this.suppliersService.update(id, updateSuppliersDto);
  }

  //  @docs   Admin can delete a Suppliers
  //  @Route  DELETE /suppliers
  //  @access Private [admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.remove(id);
  }
}
