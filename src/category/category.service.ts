import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (category) {
      throw new HttpException('Category already exist', 400);
    }

    const newCategory = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return {
      status: 200,
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  async findAll() {
    const category = await this.prisma.category.findMany();
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

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = await this.prisma.category.update({
      where: {
        id: id,
      },
      data: updateCategoryDto,
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
