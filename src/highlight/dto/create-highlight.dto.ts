import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateHighlightDto {
  @ApiProperty({
    example: 'Summer Collection',
    description: 'The title of the highlight',
  })
  @IsString({ message: 'title must be a string' })
  @MinLength(3, { message: 'title must be at least 3 characters' })
  @MaxLength(100, { message: 'title must be at most 100 characters' })
  title: string;

  @ApiProperty({
    example: 'This is a description of the highlight',
    description: 'The description of the highlight',
  })
  @IsString({ message: 'description must be a string' })
  @MinLength(10, {
    message: 'description must be at least 10 characters',
  })
  @MaxLength(500, {
    message: 'description must be at most 500 characters',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the highlight is for the best seller',
    required: false,
  })
  @IsBoolean({
    message: 'is best seller must be a boolean',
  })
  @IsEnum([true, false], {
    message: 'is best seller must be true or false',
  })
  @Transform(({ value }) => value === 'true')
  isBestSeller: boolean;
}
