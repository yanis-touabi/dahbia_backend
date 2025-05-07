import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FindAllOrdersDto {
  @ApiProperty({
    example: 1,
    description: 'The page number for pagination',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'The number of items per page for pagination',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({
    enum: OrderStatus,
    description: 'The status to filter orders by',
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({
    description: 'Start date for filtering orders',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering orders',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description:
      'The search term to filter orders by name or description',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: 'asc',
    description: 'The order to sort the products by (asc or desc)',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: string;

  @ApiProperty({
    enum: ['createdAt', 'totalAmount', 'status'],
    description: 'The field to sort orders by',
    required: false,
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortField?: 'createdAt' | 'totalAmount' | 'status' = 'createdAt';
}
