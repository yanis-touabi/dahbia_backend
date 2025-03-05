import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMaterialDto {
  @ApiProperty({
    example: 'GOLD',
    description: 'the material of the product',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
