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
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Tag')
@ApiBearerAuth()
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  // @Roles([Role.ADMIN])
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Tag' })
  @ApiResponse({
    status: 201,
    description: 'Tag successfully created.',
  })
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createTagDto: CreateTagDto,
  ) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Tags' })
  @ApiResponse({ status: 200, description: 'List of all tags.' })
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single Tag' })
  @ApiResponse({ status: 200, description: 'Tag details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag successfully updated.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Tag' })
  @ApiResponse({
    status: 200,
    description: 'Tag successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}
