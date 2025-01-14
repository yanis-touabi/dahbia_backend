import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSuppliersDto } from './dto/create-suppliers.dto';
import { UpdateSuppliersDto } from './dto/update-suppliers.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(createSuppliersDto: CreateSuppliersDto) {
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        name: createSuppliersDto.name,
      },
    });
    if (supplier) {
      throw new HttpException('supplier already exist', 400);
    }

    const newSupplier = await this.prisma.supplier.create({
      data: createSuppliersDto,
    });

    return {
      status: 200,
      message: 'Supplier created successfully',
      data: newSupplier,
    };
  }

  async findAll() {
    const suppliers = await this.prisma.supplier.findMany();
    return {
      status: 200,
      message: 'Suppliers found',
      length: suppliers.length,
      data: suppliers,
    };
  }

  async findOne(id: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: id,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return {
      status: 200,
      message: 'Supplier found',
      data: supplier,
    };
  }

  async update(id: number, updateSuppliersDto: UpdateSuppliersDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: id,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
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
  }

  async remove(id: number): Promise<void> {
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
  }
}
