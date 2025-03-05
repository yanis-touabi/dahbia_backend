import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSizeDto {
  @ApiProperty({
    example: 'M',
    description: 'the size of the product',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
