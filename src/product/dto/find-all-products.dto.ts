import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllProductsDto {
  @ApiProperty({
    example: 1,
    description: 'The page number for pagination',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'The number of items per page for pagination',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({
    example: 1,
    description: 'The category ID to filter products by category',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({
    example: 1,
    description: 'The brand ID to filter products by brand',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  brandId?: number;

  @ApiProperty({
    example: 10,
    description:
      'The minimum price to filter products by price range',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiProperty({
    example: 100,
    description:
      'The maximum price to filter products by price range',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({
    example: 'product name',
    description:
      'The search term to filter products by name or description',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    example: 'price',
    description: 'The field to sort the products by',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortField?: string;

  @ApiProperty({
    example: 'asc',
    description: 'The order to sort the products by (asc or desc)',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: string;

  @ApiProperty({
    example: 'Large',
    description: 'The size to filter products by',
    required: false,
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({
    example: 'Blue',
    description: 'The color to filter products by',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    example: 'Cotton',
    description: 'The material to filter products by',
    required: false,
  })
  @IsOptional()
  @IsString()
  material?: string;
}
