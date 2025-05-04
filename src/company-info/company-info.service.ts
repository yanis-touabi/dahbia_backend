import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCompanyInfoDto } from './dto/create-company-info.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyInfoService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyInfoDto: CreateCompanyInfoDto) {
    try {
      // There should only be one company info record
      const existing = await this.prisma.companyInfo.findFirst();
      if (existing) {
        return this.update(existing.id, createCompanyInfoDto);
      }

      const companyInfo = await this.prisma.companyInfo.create({
        data: createCompanyInfoDto,
      });
      return {
        status: 200,
        message: 'Company info created successfully',
        data: companyInfo,
      };
    } catch (error) {
      console.error('Error in create:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during create',
      );
    }
  }

  async findOne() {
    try {
      const companyInfo = await this.prisma.companyInfo.findFirst();
      if (!companyInfo) {
        return {
          status: 200,
          message: 'No company info found',
          data: null,
        };
      }
      return {
        status: 200,
        message: 'Company info found',
        data: companyInfo,
      };
    } catch (error) {
      console.error('Error in findOne:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during findOne',
      );
    }
  }

  async update(
    id: number,
    updateCompanyInfoDto: UpdateCompanyInfoDto,
  ) {
    try {
      const companyInfo = await this.prisma.companyInfo.findUnique({
        where: { id },
      });
      if (!companyInfo) {
        return new NotFoundException('Company info not found');
      }

      const updated = await this.prisma.companyInfo.update({
        where: { id },
        data: updateCompanyInfoDto,
      });
      return {
        status: 200,
        message: 'Company info updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error in update:', { id, error });
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
      const companyInfo = await this.prisma.companyInfo.findUnique({
        where: { id },
      });
      if (!companyInfo) {
        return new NotFoundException('Company info not found');
      }
      await this.prisma.companyInfo.delete({
        where: { id },
      });
      return {
        status: 200,
        message: 'Company info deleted successfully',
      };
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
