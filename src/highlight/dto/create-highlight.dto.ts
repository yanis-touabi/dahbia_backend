import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  description: string;
}
