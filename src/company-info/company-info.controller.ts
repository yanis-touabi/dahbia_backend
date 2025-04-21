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
import { CompanyInfoService } from './company-info.service';
import { CreateCompanyInfoDto } from './dto/create-company-info.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Company Info')
@Controller('company-info')
export class CompanyInfoController {
  constructor(
    private readonly companyInfoService: CompanyInfoService,
  ) {}

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create company information' })
  @ApiResponse({
    status: 201,
    description: 'Company info successfully created.',
  })
  create(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    createCompanyInfoDto: CreateCompanyInfoDto,
  ) {
    return this.companyInfoService.create(createCompanyInfoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get company information' })
  @ApiResponse({ status: 200, description: 'Company info details.' })
  findOne() {
    return this.companyInfoService.findOne();
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update company information' })
  @ApiResponse({
    status: 200,
    description: 'Company info successfully updated.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCompanyInfoDto: UpdateCompanyInfoDto,
  ) {
    return this.companyInfoService.update(id, updateCompanyInfoDto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete company information' })
  @ApiResponse({
    status: 200,
    description: 'Company info successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyInfoService.remove(id);
  }
}
