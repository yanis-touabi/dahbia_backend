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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Suppliers') // Organizes endpoints in Swagger UI
@Controller('supplier')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  //  @docs   Admin Can create a new Supplier
  //  @Route  POST /supplier
  //  @access Private [Admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Supplier' }) // Describe endpoint
  @ApiResponse({
    status: 201,
    description: 'Supplier successfully created.',
  }) // Response info
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createSuppliersDto: CreateSuppliersDto,
  ) {
    return this.suppliersService.create(createSuppliersDto);
  }

  //  @docs   Any User Can get all Suppliers
  //  @Route  GET /supplier
  //  @access Public
  @Get()
  @ApiOperation({ summary: 'Get all Suppliers' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'List of all suppliers.' }) // Response info
  findAll() {
    return this.suppliersService.findAll();
  }

  //  @docs   Any User Can get single Supplier
  //  @Route  GET /supplier/:id
  //  @access Public
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Supplier' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'Supplier details.' }) // Response info
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.findOne(id);
  }

  //  @docs   Admin can update a Supplier
  //  @Route  PATCH /supplier/:id
  //  @access Private [Admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Supplier' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Supplier successfully updated.',
  }) // Response info
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateSuppliersDto: UpdateSuppliersDto,
  ) {
    return this.suppliersService.update(id, updateSuppliersDto);
  }

  //  @docs   Admin can delete a Supplier
  //  @Route  DELETE /supplier/:id
  //  @access Private [Admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Supplier' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Supplier successfully deleted.',
  }) // Response info
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.remove(id);
  }
}
