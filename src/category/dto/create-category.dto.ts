import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
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
}
