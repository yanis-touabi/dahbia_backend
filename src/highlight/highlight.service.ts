import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from '../shared/file/file.service';

@Injectable()
export class HighlightService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(
    createHighlightDto: CreateHighlightDto,
    highlightImage: Express.Multer.File[],
  ) {
    try {
      // check for highlight unicity
      const existingHighlight =
        await this.prisma.highlight.findUnique({
          where: {
            isBestSeller: createHighlightDto.isBestSeller,
          },
        });

      if (existingHighlight) {
        return new HttpException(
          'Highlight already exists, please modify the existing one',
          400,
        );
      }

      let imageHighlight = '';
      if (highlightImage) {
        imageHighlight = await this.fileService.saveImage(
          highlightImage[0],
        );
      }

      const newHighlight = await this.prisma.highlight.create({
        data: {
          ...createHighlightDto,
          image: imageHighlight,
        },
      });
      return {
        status: 200,
        message: 'Highlight created successfully',
        data: newHighlight,
      };
    } catch (error) {
      console.error('Error in create:', {
        title: createHighlightDto.title,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during create',
      );
    }
  }

  async findAll() {
    try {
      const highlights = await this.prisma.highlight.findMany();
      return {
        status: 200,
        message: 'Highlights found',
        length: highlights.length,
        data: highlights,
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
      const highlight = await this.prisma.highlight.findUnique({
        where: {
          id: id,
        },
      });

      if (!highlight) {
        return new NotFoundException('Highlight not found');
      }

      return {
        status: 200,
        message: 'Highlight found',
        data: highlight,
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
    updateHighlightDto: UpdateHighlightDto,
    highlightImage: Express.Multer.File[],
  ) {
    try {
      const isHighlightExist = await this.prisma.highlight.findFirst({
        where: {
          id: {
            not: id,
          },
          isBestSeller: updateHighlightDto.isBestSeller,
        },
      });

      if (isHighlightExist) {
        return new HttpException(
          `Highlight with isBestSeller equal to ${updateHighlightDto.isBestSeller} already exists`,
          400,
        );
      }

      const highlight = await this.prisma.highlight.findUnique({
        where: {
          id: id,
        },
      });

      if (!highlight) {
        return new NotFoundException('Highlight not found');
      }

      let image = highlight.image;

      if (highlightImage && highlightImage.length > 0) {
        if (image) {
          await this.fileService.deleteImage(image);
        }
        image = await this.fileService.saveImage(highlightImage[0]);
      }

      const updatedHighlight = await this.prisma.highlight.update({
        where: { id },
        data: {
          ...updateHighlightDto,
          image,
        },
      });

      return {
        status: 200,
        message: 'Highlight updated successfully',
        data: updatedHighlight,
      };
    } catch (error) {
      console.error('Error in update:', {
        id,
        updateHighlightDto,
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
      const highlight = await this.prisma.highlight.findUnique({
        where: {
          id: id,
        },
      });
      if (!highlight) {
        return new NotFoundException('Highlight not found');
      }
      await this.prisma.highlight.delete({
        where: {
          id: id,
        },
      });
      if (highlight.image) {
        await this.fileService.deleteImage(highlight.image);
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
