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
import { WilayaService } from './wilaya.service';
import { CreateWilayaDto } from './dto/create-wilaya.dto';
import { UpdateWilayaDto } from './dto/update-wilaya.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Wilaya')
@ApiBearerAuth()
@Controller('wilaya')
export class WilayaController {
  constructor(private readonly wilayaService: WilayaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Wilaya' })
  @ApiResponse({
    status: 201,
    description: 'Wilaya successfully created.',
  })
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createWilayaDto: CreateWilayaDto,
  ) {
    return this.wilayaService.create(createWilayaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Wilayas' })
  @ApiResponse({ status: 200, description: 'List of all wilayas.' })
  findAll() {
    return this.wilayaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single Wilaya' })
  @ApiResponse({ status: 200, description: 'Wilaya details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wilayaService.findOne(id);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Wilaya' })
  @ApiResponse({
    status: 200,
    description: 'Wilaya successfully updated.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateWilayaDto: UpdateWilayaDto,
  ) {
    return this.wilayaService.update(id, updateWilayaDto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Wilaya' })
  @ApiResponse({
    status: 200,
    description: 'Wilaya successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.wilayaService.remove(id);
  }
}
