import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductSpecificationDto {
  @ApiProperty({
    description: 'Quantity to update',
    example: 10,
    type: Number,
  })
  @IsInt()
  quantity: number;
}
