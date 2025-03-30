import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand = await this.prisma.brand.findFirst({
        where: {
          name: createBrandDto.name,
        },
      });
      if (brand) {
        throw new HttpException('Brand already exist', 400);
      }

      const newBrand = await this.prisma.brand.create({
        data: createBrandDto,
      });
      return {
        status: 200,
        message: 'Brand created successfully',
        data: newBrand,
      };
    } catch (error) {
      console.error('Error in create:', {
        name: createBrandDto.name,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during create',
      );
    }
  }

  async findAll() {
    try {
      const brands = await this.prisma.brand.findMany();
      return {
        status: 200,
        message: 'Brands found',
        length: brands.length,
        data: brands,
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
      const brand = await this.prisma.brand.findUnique({
        where: {
          id: id,
        },
      });

      if (!brand) {
        throw new NotFoundException('Brand not found');
      }

      return {
        status: 200,
        message: 'Brand found',
        data: brand,
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

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: {
          id: id,
        },
      });

      if (!brand) {
        throw new NotFoundException('Brand not found');
      }

      const updatedBrand = await this.prisma.brand.update({
        where: {
          id: id,
        },
        data: updateBrandDto,
      });

      return {
        status: 200,
        message: 'Brand updated successfully',
        data: updatedBrand,
      };
    } catch (error) {
      console.error('Error in update:', {
        id,
        updateBrandDto,
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

  async remove(id: number): Promise<void> {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: {
          id: id,
        },
      });
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
      await this.prisma.brand.delete({
        where: {
          id: id,
        },
      });
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
