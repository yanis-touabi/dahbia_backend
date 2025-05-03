import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class SpecificationService {
  constructor(private prisma: PrismaService) {}

  // Size CRUD Operations
  async createSize(createSizeDto: CreateSizeDto) {
    const existingSize = await this.prisma.size.findFirst({
      where: { name: createSizeDto.name },
    });

    if (existingSize) {
      throw new ConflictException(
        'Size with this name already exists',
      );
    }

    return this.prisma.size.create({
      data: createSizeDto,
    });
  }

  async findAllSizes() {
    return this.prisma.size.findMany();
  }

  async findSizeById(id: number) {
    return this.prisma.size.findUnique({
      where: { id },
    });
  }

  async updateSize(id: number, updateSizeDto: UpdateSizeDto) {
    return this.prisma.size.update({
      where: { id },
      data: updateSizeDto,
    });
  }

  async removeSize(id: number) {
    const usedInProducts =
      await this.prisma.productSpecification.findFirst({
        where: { sizeId: id },
      });

    if (usedInProducts) {
      throw new ConflictException(
        'Cannot delete size - it is being used in product specifications',
      );
    }

    return this.prisma.size.delete({
      where: { id },
    });
  }

  // Color CRUD Operations
  async createColor(createColorDto: CreateColorDto) {
    const existingColor = await this.prisma.color.findFirst({
      where: { name: createColorDto.name },
    });

    if (existingColor) {
      throw new ConflictException(
        'Color with this name already exists',
      );
    }

    return this.prisma.color.create({
      data: createColorDto,
    });
  }

  async findAllColors() {
    return this.prisma.color.findMany();
  }

  async findColorById(id: number) {
    return this.prisma.color.findUnique({
      where: { id },
    });
  }

  async updateColor(id: number, updateColorDto: UpdateColorDto) {
    return this.prisma.color.update({
      where: { id },
      data: updateColorDto,
    });
  }

  async removeColor(id: number) {
    const usedInProducts =
      await this.prisma.productSpecification.findFirst({
        where: { colorId: id },
      });

    if (usedInProducts) {
      throw new ConflictException(
        'Cannot delete color - it is being used in product specifications',
      );
    }

    return this.prisma.color.delete({
      where: { id },
    });
  }

  // Material CRUD Operations
  async createMaterial(createMaterialDto: CreateMaterialDto) {
    const existingMaterial = await this.prisma.material.findFirst({
      where: { name: createMaterialDto.name },
    });

    if (existingMaterial) {
      throw new ConflictException(
        'Material with this name already exists',
      );
    }

    return this.prisma.material.create({
      data: createMaterialDto,
    });
  }

  async findAllMaterials() {
    return this.prisma.material.findMany();
  }

  async findMaterialById(id: number) {
    return this.prisma.material.findUnique({
      where: { id },
    });
  }

  async updateMaterial(
    id: number,
    updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.prisma.material.update({
      where: { id },
      data: updateMaterialDto,
    });
  }

  async removeMaterial(id: number) {
    const usedInProducts =
      await this.prisma.productSpecification.findFirst({
        where: { materialId: id },
      });

    if (usedInProducts) {
      throw new ConflictException(
        'Cannot delete material - it is being used in product specifications',
      );
    }

    return this.prisma.material.delete({
      where: { id },
    });
  }
}
