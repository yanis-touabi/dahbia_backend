import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = await this.prisma.subCategory.findFirst({
      where: {
        name: createSubCategoryDto.name,
      },
    });

    if (subCategory) {
      throw new HttpException('subCategory already exist', 400);
    }

    const category = await this.prisma.category.findFirst({
      where: {
        id: createSubCategoryDto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newSubCategory = await this.prisma.subCategory.create({
      data: createSubCategoryDto,
      include: {
        category: true,
      },
    });

    return {
      status: 200,
      message: 'subCategory created successfully',
      data: newSubCategory,
    };
  }

  async findAll() {
    const subCategory = await this.prisma.subCategory.findMany({
      include: {
        category: true,
      },
    });
    return {
      status: 200,
      message: 'subCategories found',
      length: subCategory.length,
      isEmpty: subCategory.length > 0 ? 'false' : 'true',
      data: subCategory,
    };
  }

  async findOne(id: number) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      },
    });
    if (!subCategory) {
      throw new NotFoundException('subCategory not found');
    }
    return {
      status: 200,
      message: 'subCategory found',
      data: subCategory,
    };
  }

  async update(
    id: number,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: {
        id: id,
      },
    });
    if (!subCategory) {
      throw new NotFoundException('subCategory not found');
    }

    const updatedSubCategory = await this.prisma.subCategory.update({
      where: {
        id: id,
      },
      data: updateSubCategoryDto,
      include: {
        category: true,
      },
    });

    return {
      status: 200,
      message: 'subCategory updated successfully',
      data: updatedSubCategory,
    };
  }

  async remove(id: number) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: {
        id: id,
      },
    });
    if (!subCategory) {
      throw new NotFoundException('subCategory not found');
    }
    await this.prisma.subCategory.delete({
      where: {
        id: id,
      },
      include: {
        category: true,
      },
    });
    return {
      status: 200,
      message: 'subCategory deleted successfully',
    };
  }
}
