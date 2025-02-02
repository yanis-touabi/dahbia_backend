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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Category') // Organizes endpoints in Swagger UI
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //  @docs   Admin Can create a new category
  //  @Route  POST /category
  //  @access Private [Admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Category' }) // Describe endpoint
  @ApiResponse({
    status: 201,
    description: 'Category successfully created.',
  }) // Response info
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  //  @docs   Any User Can get categories
  //  @Route  GET /category
  //  @access Public
  @Get()
  @ApiOperation({ summary: 'Get all Categories' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'List of all categories.',
  }) // Response info
  findAll() {
    return this.categoryService.findAll();
  }

  //  @docs   Any User Can get any category
  //  @Route  GET /category/:id
  //  @access Public
  @Get(':id')
  @ApiOperation({ summary: 'Get a single Category' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'Category details.' }) // Response info
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  //  @docs   Admin Can update any category
  //  @Route  PATCH /category/:id
  //  @access Private [Admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Category' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Category successfully updated.',
  }) // Response info
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  //  @docs   Admin Can delete any category
  //  @Route  DELETE /category/:id
  //  @access Private [Admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Category' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Category successfully deleted.',
  }) // Response info
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
