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

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new SubCategory' })
  @ApiResponse({
    status: 201,
    description: 'SubCategory successfully created.',
  })
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SubCategories' })
  @ApiResponse({
    status: 200,
    description: 'List of all sub-categories.',
  })
  findAll() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single SubCategory' })
  @ApiResponse({ status: 200, description: 'SubCategory details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.findOne(id);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a SubCategory' })
  @ApiResponse({
    status: 200,
    description: 'SubCategory successfully updated.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a SubCategory' })
  @ApiResponse({
    status: 200,
    description: 'SubCategory successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoryService.remove(id);
  }
}
