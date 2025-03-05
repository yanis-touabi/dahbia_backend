import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
  @ApiProperty({
    example: 'GOLD',
    description: 'the material of the product',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
