import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductSpecificationDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the product',
  })
  @IsInt({ message: 'productId must be an integer' })
  @IsNotEmpty({ message: 'productId is required' })
  productId: number;

  @ApiProperty({
    example: 'color',
    description: 'The key of the product specification',
  })
  @IsString({ message: 'key must be a string' })
  @IsNotEmpty({ message: 'key is required' })
  @MinLength(2, { message: 'key must be at least 2 characters' })
  @MaxLength(50, { message: 'key must be at most 50 characters' })
  key: string;

  @ApiProperty({
    example: 'red',
    description: 'The value of the product specification',
  })
  @IsString({ message: 'value must be a string' })
  @IsNotEmpty({ message: 'value is required' })
  @MinLength(1, { message: 'value must be at least 1 character' })
  @MaxLength(255, { message: 'value must be at most 255 characters' })
  value: string;
}
