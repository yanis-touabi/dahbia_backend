import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { HighlightService } from './highlight.service';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Highlight')
@Controller('highlight')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) {}

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'highlightImage', maxCount: 1 }]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        highlightImage: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        description: { type: 'string' },
        isBestSeller: { type: 'boolean' },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new Highlight' })
  @ApiResponse({
    status: 201,
    description: 'Highlight successfully created.',
  })
  create(
    @UploadedFiles()
    files: {
      highlightImage?: Express.Multer.File[];
    },
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createHighlightDto: CreateHighlightDto,
  ) {
    return this.highlightService.create(
      createHighlightDto,
      files.highlightImage,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all Highlights' })
  @ApiResponse({
    status: 200,
    description: 'List of all highlights.',
  })
  findAll() {
    return this.highlightService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single Highlight' })
  @ApiResponse({ status: 200, description: 'Highlight details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.highlightService.findOne(id);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'highlightImage', maxCount: 1 }]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        highlightImage: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        description: { type: 'string' },
        isBestSeller: { type: 'boolean' },
      },
    },
  })
  @ApiOperation({ summary: 'Update a Highlight' })
  @ApiResponse({
    status: 200,
    description: 'Highlight successfully updated.',
  })
  update(
    @UploadedFiles()
    files: {
      highlightImage?: Express.Multer.File[];
    },
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateHighlightDto: UpdateHighlightDto,
  ) {
    return this.highlightService.update(
      id,
      updateHighlightDto,
      files.highlightImage,
    );
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Highlight' })
  @ApiResponse({
    status: 200,
    description: 'Highlight successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.highlightService.remove(id);
  }
}
