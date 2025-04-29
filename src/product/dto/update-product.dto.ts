import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
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
  @IsEnum([true, false], {
    message: 'is best seller must be true or false',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isBestSeller: boolean;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'An array of tag IDs to associate with the product',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        // Try parsing as JSON first
        const parsed = JSON.parse(value);

        // If it's an array, map to numbers
        if (Array.isArray(parsed)) {
          return parsed.map(Number);
        }

        // If it's a single number/string, wrap it into an array
        return [Number(parsed)];
      } catch (e) {
        // If JSON parsing fails (like "1,2,3"), fallback to splitting manually
        return value
          .split(',')
          .map((item) => Number(item.trim()))
          .filter((item) => !isNaN(item)); // remove invalid numbers
      }
    }

    // If not a string, just return as is
    return value;
  })
  tagIds: number[];
}
