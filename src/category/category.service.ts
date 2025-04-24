import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from '../shared/file/file.service';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    categoryImage: any,
  ) {
    try {
      const category = await this.prisma.category.findFirst({
        where: {
          name: createCategoryDto.name,
        },
      });

      if (category) {
        throw new HttpException('Category already exist', 400);
      }

      let imageCategory = '';
      // Save the category image
      if (categoryImage) {
        imageCategory = await this.fileService.saveImage(
          categoryImage[0],
        );
      }

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
    } catch (error) {
      console.error('Error in create:', {
        name: createCategoryDto.name,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during create',
      );
    }
  }

  async findAll() {
    try {
      const category = await this.prisma.category.findMany();

      return {
        status: 200,
        message: 'Categorys found',
        length: category.length,
        isEmpty: category.length > 0 ? 'false' : 'true',
        data: category,
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during findAll',
      );
    }
  }

  async findOne(id: number) {
    try {
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
    } catch (error) {
      console.error('Error in findOne:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during findOne',
      );
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    categoryImage: any,
  ) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      let image = category.image;

      if (categoryImage && categoryImage.length > 0) {
        // Delete old image cover
        if (image) {
          await this.fileService.deleteImage(image);
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
    } catch (error) {
      console.error('Error in update:', {
        id,
        updateCategoryDto,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during update',
      );
    }
  }

  async remove(id: number) {
    try {
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
    } catch (error) {
      console.error('Error in remove:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during remove',
      );
    }
  }
}
