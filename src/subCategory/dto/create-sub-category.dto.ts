import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the sub-category',
  })
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(30, { message: 'name must be at most 30 characters' })
  name: string;

  @ApiProperty({
    example: 'This is a description of the sub-category',
    description: 'The description of the sub-category',
    required: false,
  })
  @IsString({ message: 'description must be a string' })
  @MaxLength(200, {
    message: 'description must be at most 200 characters',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the parent category',
  })
  @IsInt({ message: 'category must be a valid integer' }) // Ensures the value is an integer
  @IsPositive({ message: 'category must be a positive number' }) // Optional: Ensures the ID is positive
  @Min(1, { message: 'category must be greater than or equal to 1' }) // Optional: Set a minimum value
  categoryId: number;
}
