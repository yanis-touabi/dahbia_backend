import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    example: 'Brand Name',
    description: 'The name of the brand',
  })
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(100, { message: 'name must be at most 100 characters' })
  name: string;

  @ApiProperty({
    example: 'This is a description of the brand',
    description: 'The description of the brand',
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
    description: 'The URL of the brand image',
    required: false,
  })
  @IsString({ message: 'image must be a string' })
  @IsUrl({}, { message: 'image must be a valid URL' })
  @IsOptional()
  image: string;

  @ApiProperty({
    example: 'https://example.com',
    description: 'The URL of the brand website',
    required: false,
  })
  @IsString({ message: 'website must be a string' })
  @IsUrl({}, { message: 'website must be a valid URL' })
  @MaxLength(255, {
    message: 'website must be at most 255 characters',
  })
  @IsOptional()
  website: string;
}
