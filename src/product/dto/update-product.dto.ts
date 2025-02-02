import { PartialType } from '@nestjs/mapped-types';
import {
  CreateProductDto,
  ProductSpecificationDto,
} from './create-product.dto';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    example: [
      { key: 'color', value: 'red' },
      { key: 'size', value: 'M' },
    ],
    description: 'An array of product specifications',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  specifications?: ProductSpecificationDto[];
}
