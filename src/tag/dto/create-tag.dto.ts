import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'The name of the tag',
    example: 'Summer Collection',
  })
  @IsString({ message: 'name must be a string' })
  @MaxLength(100, { message: 'name must be at most 50 characters' })
  name: string;
}
