import { ApiProperty } from '@nestjs/swagger';

export class ProductSpecificationResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the product specification',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'ID of the associated product',
    example: 1,
    type: Number,
  })
  productId: number;

  @ApiProperty({
    description: 'ID of the associated size specification',
    example: 1,
    type: Number,
    nullable: true,
  })
  sizeId?: number;

  @ApiProperty({
    description: 'ID of the associated color specification',
    example: 1,
    type: Number,
    nullable: true,
  })
  colorId?: number;

  @ApiProperty({
    description: 'ID of the associated material specification',
    example: 1,
    type: Number,
    nullable: true,
  })
  materialId?: number;

  @ApiProperty({
    description: 'Timestamp when the specification was created',
    example: '2025-03-07T12:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the specification was last modified',
    example: '2025-03-07T12:30:00.000Z',
    type: Date,
    nullable: true,
  })
  modifiedAt?: Date;
}
