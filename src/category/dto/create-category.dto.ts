import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(30, { message: 'name must be at most 30 characters' })
  name: string;

  @ApiProperty({
    example: 'This is a description of the category',
    description: 'The description of the category',
    required: false,
  })
  @IsString({ message: 'description must be a string' })
  @MinLength(10, {
    message: 'description must be at least 10 characters',
  })
  @MaxLength(200, {
    message: 'description must be at most 200 characters',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'The URL of the category image',
    required: false,
  })
  @IsString({ message: 'image must be a string' })
  @IsUrl({}, { message: 'image must be a valid URL' })
  @IsOptional()
  image: string;
}
