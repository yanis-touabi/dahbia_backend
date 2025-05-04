import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { name: createTagDto.name },
      });
      if (tag) {
        return new HttpException('Tag already exists', 400);
      }

      const newTag = await this.prisma.tag.create({
        data: createTagDto,
      });
      return {
        status: 200,
        message: 'Tag created successfully',
        data: newTag,
      };
    } catch (error) {
      console.error('Error in create:', {
        name: createTagDto.name,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during tag creation',
      );
    }
  }

  async findAll() {
    try {
      const tags = await this.prisma.tag.findMany();
      return {
        status: 200,
        message: 'Tags retrieved successfully',
        length: tags.length,
        data: tags,
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving tags',
      );
    }
  }

  async findOne(id: number) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { id },
      });
      if (!tag) {
        return new NotFoundException('Tag not found');
      }
      return {
        status: 200,
        message: 'Tag retrieved successfully',
        data: tag,
      };
    } catch (error) {
      console.error('Error in findOne:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving tag',
      );
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { id },
      });
      if (!tag) {
        return new NotFoundException('Tag not found');
      }

      const updatedTag = await this.prisma.tag.update({
        where: { id },
        data: updateTagDto,
      });
      return {
        status: 200,
        message: 'Tag updated successfully',
        data: updatedTag,
      };
    } catch (error) {
      console.error('Error in update:', { id, updateTagDto, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating tag',
      );
    }
  }

  async remove(id: number) {
    try {
      const tag = await this.prisma.tag.findUnique({
        where: { id },
      });
      if (!tag) {
        return new NotFoundException('Tag not found');
      }
      await this.prisma.tag.delete({
        where: { id },
      });
      return {
        status: 200,
        message: 'Tag deleted successfully',
      };
    } catch (error) {
      console.error('Error in remove:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting tag',
      );
    }
  }
}
