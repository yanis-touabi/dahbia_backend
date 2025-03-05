import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSizeDto {
  @ApiProperty({
    example: 'M',
    description: 'the size of the product',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
