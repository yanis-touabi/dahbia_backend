import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSuppliersDto } from './dto/create-suppliers.dto';
import { UpdateSuppliersDto } from './dto/update-suppliers.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(createSuppliersDto: CreateSuppliersDto) {
    try {
      const supplier = await this.prisma.supplier.findFirst({
        where: {
          name: createSuppliersDto.name,
        },
      });
      if (supplier) {
        return new HttpException('supplier already exist', 400);
      }

      const newSupplier = await this.prisma.supplier.create({
        data: createSuppliersDto,
      });

      return {
        status: 200,
        message: 'Supplier created successfully',
        data: newSupplier,
      };
    } catch (error) {
      console.error('Error in create supplier:', {
        createSuppliersDto,
        error,
      });
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during supplier creation',
      );
    }
  }

  async findAll() {
    try {
      const suppliers = await this.prisma.supplier.findMany();
      return {
        status: 200,
        message: 'Suppliers found',
        length: suppliers.length,
        data: suppliers,
      };
    } catch (error) {
      console.error('Error in find all suppliers:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during suppliers retrieval',
      );
    }
  }

  async findOne(id: number) {
    try {
      const supplier = await this.prisma.supplier.findUnique({
        where: {
          id: id,
        },
      });

      if (!supplier) {
        return new NotFoundException('Supplier not found');
      }

      return {
        status: 200,
        message: 'Supplier found',
        data: supplier,
      };
    } catch (error) {
      console.error('Error in find one supplier:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during supplier retrieval',
      );
    }
  }

  async update(id: number, updateSuppliersDto: UpdateSuppliersDto) {
    try {
      const supplier = await this.prisma.supplier.findUnique({
        where: {
          id: id,
        },
      });

      if (!supplier) {
        return new NotFoundException('Supplier not found');
      }

      const updatedSupplier = await this.prisma.supplier.update({
        where: {
          id: id,
        },
        data: updateSuppliersDto,
      });
      return {
        status: 200,
        message: 'Supplier updated successfully',
        data: updatedSupplier,
      };
    } catch (error) {
      console.error('Error in update supplier:', {
        id,
        updateSuppliersDto,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during supplier update',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const supplier = await this.prisma.supplier.findUnique({
        where: {
          id: id,
        },
      });

      if (!supplier) {
        throw new NotFoundException('Supplier not found');
      }
      await this.prisma.supplier.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error('Error in remove supplier:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during supplier deletion',
      );
    }
  }
}
