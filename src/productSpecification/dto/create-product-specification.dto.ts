import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductSpecificationDto {
  @IsInt({ message: 'productId must be an integer' })
  @IsNotEmpty({ message: 'productId is required' })
  productId: number;

  @IsString({ message: 'key must be a string' })
  @IsNotEmpty({ message: 'key is required' })
  @MinLength(2, { message: 'key must be at least 2 characters' })
  @MaxLength(50, { message: 'key must be at most 50 characters' })
  key: string;

  @IsString({ message: 'value must be a string' })
  @IsNotEmpty({ message: 'value is required' })
  @MinLength(1, { message: 'value must be at least 1 character' })
  @MaxLength(255, { message: 'value must be at most 255 characters' })
  value: string;
}
