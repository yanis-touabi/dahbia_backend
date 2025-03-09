import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColorDto {
  @ApiProperty({
    example: 'RED',
    description: 'the color of the product',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
