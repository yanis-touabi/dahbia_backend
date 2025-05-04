import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from '../shared/file/file.service';

@Injectable()
export class BrandService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(
    createBrandDto: CreateBrandDto,
    brandImage: Express.Multer.File[],
  ) {
    try {
      const brand = await this.prisma.brand.findFirst({
        where: {
          name: createBrandDto.name,
        },
      });
      if (brand) {
        return new HttpException('Brand already exist', 400);
      }

      let imageBrand = '';
      // Save the brand image
      if (brandImage) {
        imageBrand = await this.fileService.saveImage(brandImage[0]);
      }

      const newBrand = await this.prisma.brand.create({
        data: {
          ...createBrandDto,
          image: imageBrand,
        },
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
        return new NotFoundException('Brand not found');
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

  async update(
    id: number,
    updateBrandDto: UpdateBrandDto,
    brandImage: Express.Multer.File[],
  ) {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: {
          id: id,
        },
      });

      if (!brand) {
        return new NotFoundException('Brand not found');
      }

      let image = brand.image;

      if (brandImage && brandImage.length > 0) {
        // Delete old image cover
        if (image) {
          await this.fileService.deleteImage(image);
        }

        // Save the new image cover
        image = await this.fileService.saveImage(brandImage[0]);
      }

      const updatedBrand = await this.prisma.brand.update({
        where: { id },
        data: {
          ...updateBrandDto,
          image,
        },
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

  async remove(id: number) {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: {
          id: id,
        },
      });
      if (!brand) {
        return new NotFoundException('Brand not found');
      }
      await this.prisma.brand.delete({
        where: {
          id: id,
        },
      });
      if (brand.image) {
        await this.fileService.deleteImage(brand.image);
      }
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
