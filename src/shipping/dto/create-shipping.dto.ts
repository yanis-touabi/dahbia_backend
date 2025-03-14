import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShippingDto {
  @ApiProperty({
    description: 'The company of the shipping',
    example: 'DHL',
  })
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty({
    description: 'The wilaya ID of the shipping',
    required: false,
    example: 16,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  wilayaId: number;

  @ApiProperty({
    description: 'The amount of the shipping',
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
