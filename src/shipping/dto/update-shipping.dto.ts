import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingDto } from './create-shipping.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShippingDto extends PartialType(
  CreateShippingDto,
) {
  @ApiProperty({
    description: 'The company of the shipping',
    example: 'DHL',
    required: false,
  })
  company?: string;

  @ApiProperty({
    description: 'The wilaya ID of the shipping',
    required: false,
    example: 16,
  })
  wilayaId?: number;

  @ApiProperty({
    description: 'The amount of the shipping',
    example: 1000,
    required: false,
  })
  amount?: number;
}
