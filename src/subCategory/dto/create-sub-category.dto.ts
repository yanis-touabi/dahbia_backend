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

export class CreateSubCategoryDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(30, { message: 'name must be at most 30 characters' })
  name: string;

  @IsString({ message: 'description must be a string' })
  @MinLength(10, {
    message: 'description must be at least 10 characters',
  })
  @MaxLength(200, {
    message: 'description must be at most 200 characters',
  })
  @IsOptional()
  description: string;

  @IsString({ message: 'image must be a string' })
  @IsUrl({}, { message: 'image must be a valid URL' })
  @IsOptional()
  image: string;

  @IsInt({ message: 'category must be a valid integer' }) // Ensures the value is an integer
  @IsPositive({ message: 'category must be a positive number' }) // Optional: Ensures the ID is positive
  @Min(1, { message: 'category must be greater than or equal to 1' }) // Optional: Set a minimum value
  categoryId: number;
}
