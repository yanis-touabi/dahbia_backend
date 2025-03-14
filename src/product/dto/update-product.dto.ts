import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // is best seller
  @ApiProperty({
    example: true,
    description: 'Indicates if the order is best seller',
    required: false,
  })
  @IsBoolean({
    message: 'is best seller must be a boolean',
  })
  @IsEnum([true, false], {
    message: 'is best seller must be true or false',
  })
  @IsOptional()
  isBestSeller: boolean;
}
