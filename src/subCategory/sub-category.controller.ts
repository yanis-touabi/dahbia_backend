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
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('SubCategory') // Organizes endpoints in Swagger UI
@Controller('sub-category')
export class SubCategoryController {
  constructor(
    private readonly subCategoryService: SubCategoryService,
  ) {}

  //  @docs   Admin Can create a new sub-category
  //  @Route  POST /sub-category
  //  @access Private [Admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new SubCategory' }) // Describe endpoint
  @ApiResponse({
    status: 201,
    description: 'SubCategory successfully created.',
  }) // Response info
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  //  @docs   Any User Can get sub-categories
  //  @Route  GET /sub-category
  //  @access Public
  @Get()
  @ApiOperation({ summary: 'Get all SubCategories' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'List of all sub-categories.',
  }) // Response info
  findAll() {
    return this.subCategoryService.findAll();
  }

  //  @docs   Any User Can get any sub-category
  //  @Route  GET /sub-category/:id
  //  @access Public
  @Get(':id')
  @ApiOperation({ summary: 'Get a single SubCategory' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'SubCategory details.' }) // Response info
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.findOne(id);
  }

  //  @docs   Admin Can update any sub-category
  //  @Route  PATCH /sub-category/:id
  //  @access Private [Admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a SubCategory' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'SubCategory successfully updated.',
  }) // Response info
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  //  @docs   Admin Can delete any sub-category
  //  @Route  DELETE /sub-category/:id
  //  @access Private [Admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a SubCategory' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'SubCategory successfully deleted.',
  }) // Response info
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.remove(id);
  }
}
