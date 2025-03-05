import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateColorDto {
  @ApiProperty({
    example: 'RED',
    description: 'the color of the product',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
