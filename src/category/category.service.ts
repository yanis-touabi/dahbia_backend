import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from '../shared/file/file.service';
import { FilterDataService } from 'src/shared/file/filterData.service';
import { w } from '@faker-js/faker/dist/airline-BXaRegOM';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private filterDataService: FilterDataService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    categoryImage: any,
  ) {
    const category = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (category) {
      throw new HttpException('Category already exist', 400);
    }

    // Save the category image
    const imageCategory = await this.fileService.saveImage(
      categoryImage[0],
    );

    const newCategory = await this.prisma.category.create({
      data: {
        ...createCategoryDto,
        image: imageCategory,
      },
    });

    return {
      status: 200,
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  async findAll() {
    // Base URL for serving images
    const baseUrl = 'http://localhost:4000'; // Change this as needed

    const category = await this.prisma.category.findMany();

    if (category.length !== 0) {
      // Format image URLs
      const formattedCategory = category.map((category) => ({
        ...category,
        image: category.image ? `${baseUrl}${category.image}` : null,
      }));
    }

    return {
      status: 200,
      message: 'Categorys found',
      length: category.length,
      isEmpty: category.length > 0 ? 'false' : 'true',
      data: category,
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      status: 200,
      message: 'Category found',
      data: category,
    };
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    categoryImage: any,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Ensure filteredData is properly typed before accessing 'name'
    // if (filteredData && 'name' in filteredData && filteredData.name) {
    //   const existingCategory = await this.prisma.category.findUnique({
    //     where: { name: filteredData.name },
    //   });

    //   if (existingCategory && existingCategory.id !== id) {
    //     throw new BadRequestException('Category name must be unique');
    //   }
    // }

    let image = category.image;

    if (categoryImage && categoryImage.length > 0) {
      // Delete old image cover
      if (category.image) {
        await this.fileService.deleteImage(category.image);
      }

      // Save the new image cover
      image = await this.fileService.saveImage(categoryImage[0]);
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        image,
      },
    });

    return {
      status: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (category.image) {
      await this.fileService.deleteImage(category.image);
    }
    await this.prisma.category.delete({
      where: {
        id: id,
      },
    });
    return {
      status: 200,
      message: 'Category deleted successfully',
    };
  }
}
