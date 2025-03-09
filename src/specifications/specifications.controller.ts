import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SpecificationService } from './specifications.service';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@ApiTags('Specification')
@Controller('specification')
export class SpecificationController {
  constructor(
    private readonly specificationService: SpecificationService,
  ) {}

  // ==============================================
  // SIZE SPECIFICATIONS
  // ==============================================
  // Size Endpoints
  @Post('size')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Size' })
  @ApiResponse({
    status: 201,
    description: 'Size successfully created.',
  })
  createSize(@Body() createSizeDto: CreateSizeDto) {
    return this.specificationService.createSize(createSizeDto);
  }

  @Get('size')
  @ApiOperation({ summary: 'Get all Sizes' })
  @ApiResponse({ status: 200, description: 'List of all sizes.' })
  findAllSizes() {
    return this.specificationService.findAllSizes();
  }

  @Get('size/:id')
  @ApiOperation({ summary: 'Get a single Size' })
  @ApiResponse({ status: 200, description: 'Size details.' })
  findSizeById(@Param('id', ParseIntPipe) id: number) {
    return this.specificationService.findSizeById(id);
  }

  @Patch('size/:id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Size' })
  @ApiResponse({
    status: 200,
    description: 'Size successfully updated.',
  })
  updateSize(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSizeDto: UpdateSizeDto,
  ) {
    return this.specificationService.updateSize(id, updateSizeDto);
  }

  @Delete('size/:id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Size' })
  @ApiResponse({
    status: 200,
    description: 'Size successfully deleted.',
  })
  removeSize(@Param('id', ParseIntPipe) id: number) {
    return this.specificationService.removeSize(id);
  }

  // Color Endpoints
  @Post('color')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Color' })
  @ApiResponse({
    status: 201,
    description: 'Color successfully created.',
  })
  createColor(@Body() createColorDto: CreateColorDto) {
    return this.specificationService.createColor(createColorDto);
  }

  @Get('color')
  @ApiOperation({ summary: 'Get all Colors' })
  @ApiResponse({ status: 200, description: 'List of all colors.' })
  findAllColors() {
    return this.specificationService.findAllColors();
  }

  @Get('color/:id')
  @ApiOperation({ summary: 'Get a single Color' })
  @ApiResponse({ status: 200, description: 'Color details.' })
  findColorById(@Param('id', ParseIntPipe) id: number) {
    return this.specificationService.findColorById(id);
  }

  @Patch('color/:id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Color' })
  @ApiResponse({
    status: 200,
    description: 'Color successfully updated.',
  })
  updateColor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return this.specificationService.updateColor(id, updateColorDto);
  }

  @Delete('color/:id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Color' })
  @ApiResponse({
    status: 200,
    description: 'Color successfully deleted.',
  })
  removeColor(@Param('id', ParseIntPipe) id: number) {
    return this.specificationService.removeColor(id);
  }

  // Material Endpoints
  @Post('material')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new Material' })
  @ApiResponse({
    status: 201,
    description: 'Material successfully created.',
  })
  createMaterial(@Body() createMaterialDto: CreateMaterialDto) {
    return this.specificationService.createMaterial(
      createMaterialDto,
    );
  }

  @Get('material')
  @ApiOperation({ summary: 'Get all Materials' })
  @ApiResponse({ status: 200, description: 'List of all materials.' })
  findAllMaterials() {
    return this.specificationService.findAllMaterials();
  }

  @Get('material/:id')
  @ApiOperation({ summary: 'Get a single Material' })
  @ApiResponse({ status: 200, description: 'Material details.' })
  findMaterialById(@Param('id', ParseIntPipe) id: number) {
    return this.specificationService.findMaterialById(id);
  }

  @Patch('material/:id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a Material' })
  @ApiResponse({
    status: 200,
    description: 'Material successfully updated.',
  })
  updateMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.specificationService.updateMaterial(
      id,
      updateMaterialDto,
    );
  }

  @Delete('material/:id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a Material' })
  @ApiResponse({
    status: 200,
    description: 'Material successfully deleted.',
  })
  removeMaterial(@Param('id', ParseIntPipe) id: number) {
    return this.specificationService.removeMaterial(id);
  }
}
