import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // is best seller
  @ApiProperty({
    example: true,
    description: 'Indicates if the order is best seller',
    required: false,
  })
  @IsBoolean({
    message: 'is best seller must be a boolean',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value; // Skip transformation if already boolean
    return value === 'true';
  })
  isBestSeller: boolean;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'An array of tag IDs to associate with the product',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds: number[];

  @ApiProperty({
    example: ['/images/product1.jpg', '/images/product2.jpg'],
    description: 'Array of image paths to delete',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim()) // Trim whitespace
        .filter((item) => item.length > 0); // Optional: remove empty strings
    }
    return value;
  })
  @IsString({ each: true })
  imagesToDelete: string[];
}
