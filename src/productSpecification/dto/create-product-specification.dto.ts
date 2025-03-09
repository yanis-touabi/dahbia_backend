import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductSpecificationDto {
  @ApiProperty({
    description: 'ID of the product',
    example: 1,
    type: Number,
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    description: 'Initial quantity of the product specification',
    example: 10,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'ID of the size specification',
    example: 1,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  sizeId?: number;

  @ApiProperty({
    description: 'ID of the color specification',
    example: 1,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  colorId?: number;

  @ApiProperty({
    description: 'ID of the material specification',
    example: 1,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  materialId?: number;
}
