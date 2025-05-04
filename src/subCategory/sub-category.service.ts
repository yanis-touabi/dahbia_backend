import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    try {
      const subCategory = await this.prisma.subCategory.findFirst({
        where: {
          name: createSubCategoryDto.name,
        },
      });

      if (subCategory) {
        return new HttpException('subCategory already exist', 400);
      }

      const category = await this.prisma.category.findFirst({
        where: {
          id: createSubCategoryDto.categoryId,
        },
      });

      if (!category) {
        return new NotFoundException('Category not found');
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
    } catch (error) {
      console.error('Error in create subCategory:', {
        createSubCategoryDto,
        error,
      });
      if (
        error instanceof NotFoundException ||
        error instanceof HttpException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during subCategory creation',
      );
    }
  }

  async findAll() {
    try {
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
    } catch (error) {
      console.error('Error in find all subCategories:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during subCategories retrieval',
      );
    }
  }

  async findOne(id: number) {
    try {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: {
          id: id,
        },
        include: {
          category: true,
        },
      });
      if (!subCategory) {
        return new NotFoundException('subCategory not found');
      }
      return {
        status: 200,
        message: 'subCategory found',
        data: subCategory,
      };
    } catch (error) {
      console.error('Error in find one subCategory:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during subCategory retrieval',
      );
    }
  }

  async update(
    id: number,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    try {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: {
          id: id,
        },
      });
      if (!subCategory) {
        return new NotFoundException('subCategory not found');
      }

      const updatedSubCategory = await this.prisma.subCategory.update(
        {
          where: {
            id: id,
          },
          data: updateSubCategoryDto,
          include: {
            category: true,
          },
        },
      );

      return {
        status: 200,
        message: 'subCategory updated successfully',
        data: updatedSubCategory,
      };
    } catch (error) {
      console.error('Error in update subCategory:', {
        id,
        updateSubCategoryDto,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during subCategory update',
      );
    }
  }

  async remove(id: number) {
    try {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: {
          id: id,
        },
      });
      if (!subCategory) {
        return new NotFoundException('subCategory not found');
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
    } catch (error) {
      console.error('Error in remove subCategory:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during subCategory deletion',
      );
    }
  }
}
