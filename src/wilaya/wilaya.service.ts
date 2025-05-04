import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWilayaDto } from './dto/create-wilaya.dto';
import { UpdateWilayaDto } from './dto/update-wilaya.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WilayaService {
  constructor(private prisma: PrismaService) {}

  async create(createWilayaDto: CreateWilayaDto) {
    try {
      const wilaya = await this.prisma.wilaya.findFirst({
        where: { name: createWilayaDto.name },
      });
      if (wilaya) {
        return new HttpException('Wilaya already exists', 400);
      }

      const newWilaya = await this.prisma.wilaya.create({
        data: createWilayaDto,
      });
      return {
        status: 200,
        message: 'Wilaya created successfully',
        data: newWilaya,
      };
    } catch (error) {
      console.error('Error in create:', {
        name: createWilayaDto.name,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during wilaya creation',
      );
    }
  }

  async findAll() {
    try {
      const wilayas = await this.prisma.wilaya.findMany();
      return {
        status: 200,
        message: 'Wilayas retrieved successfully',
        length: wilayas.length,
        data: wilayas,
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving wilayas',
      );
    }
  }

  async findOne(id: number) {
    try {
      const wilaya = await this.prisma.wilaya.findUnique({
        where: { id },
      });
      if (!wilaya) {
        return new NotFoundException('Wilaya not found');
      }
      return {
        status: 200,
        message: 'Wilaya retrieved successfully',
        data: wilaya,
      };
    } catch (error) {
      console.error('Error in findOne:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving wilaya',
      );
    }
  }

  async update(id: number, updateWilayaDto: UpdateWilayaDto) {
    try {
      const wilaya = await this.prisma.wilaya.findUnique({
        where: { id },
      });
      if (!wilaya) {
        return new NotFoundException('Wilaya not found');
      }

      const updatedWilaya = await this.prisma.wilaya.update({
        where: { id },
        data: updateWilayaDto,
      });
      return {
        status: 200,
        message: 'Wilaya updated successfully',
        data: updatedWilaya,
      };
    } catch (error) {
      console.error('Error in update:', {
        id,
        updateWilayaDto,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating wilaya',
      );
    }
  }

  async remove(id: number) {
    try {
      const wilaya = await this.prisma.wilaya.findUnique({
        where: { id },
      });
      if (!wilaya) {
        return new NotFoundException('Wilaya not found');
      }
      await this.prisma.wilaya.delete({
        where: { id },
      });
      return {
        status: 200,
        message: 'Wilaya deleted successfully',
      };
    } catch (error) {
      console.error('Error in remove:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting wilaya',
      );
    }
  }
}
