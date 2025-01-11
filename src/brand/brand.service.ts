import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
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
  }

  async findAll() {
    const brands = await this.prisma.brand.findMany();
    return {
      status: 200,
      message: 'Brands found',
      length: brands.length,
      data: brands,
    };
  }

  async findOne(id: number) {
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
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
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
  }

  async remove(id: number): Promise<void> {
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
  }
}
