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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  // @Roles([Role.ADMIN])
  // @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'categoryImage', maxCount: 1 }]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categoryImage: {
          type: 'string',
          format: 'binary',
        },
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new Category' })
  @ApiResponse({
    status: 201,
    description: 'Category successfully created.',
  })
  create(
    @UploadedFiles()
    files: {
      categoryImage?: Express.Multer.File[];
    },
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(
      createCategoryDto,
      files.categoryImage,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all Categories' })
  @ApiResponse({
    status: 200,
    description: 'List of all categories.',
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single Category' })
  @ApiResponse({ status: 200, description: 'Category details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  // @Roles([Role.ADMIN])
  // @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'categoryImage', maxCount: 1 }]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        categoryImage: {
          type: 'string',
          format: 'binary',
        },
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiOperation({ summary: 'Update a Category' })
  @ApiResponse({
    status: 200,
    description: 'Category successfully updated.',
  })
  update(
    @UploadedFiles()
    files: {
      categoryImage?: Express.Multer.File[];
    },
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(
      id,
      updateCategoryDto,
      files.categoryImage,
    );
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Category' })
  @ApiResponse({
    status: 200,
    description: 'Category successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
