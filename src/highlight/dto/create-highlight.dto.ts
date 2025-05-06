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
  @MaxLength(500, {
    message: 'description must be at most 500 characters',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'This is a subtitle of the highlight',
    description: 'The subtitle of the highlight',
  })
  @IsString({ message: 'subtitle must be a string' })
  @MaxLength(500, {
    message: 'subtitle must be at most 500 characters',
  })
  @IsOptional()
  subtitle: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the highlight is for the best seller',
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
}
