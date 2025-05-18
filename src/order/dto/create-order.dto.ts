import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({
    description: 'Product specification ID',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  productSpecificationId: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
  })
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1-555-555-5555',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Address line 1',
    example: '123 Main St',
  })
  @IsString()
  addressLine1: string;

  @ApiProperty({
    description: 'Address line 2 (optional)',
    example: 'Apt 4B',
  })
  @IsString()
  addressLine2?: string;

  @ApiProperty({
    description: 'Commune',
    example: 'Some Commune',
  })
  @IsString()
  commune: string;

  @ApiProperty({
    description: 'WilayaId',
    example: '16',
  })
  @IsInt()
  wilayaId: number;

  @ApiProperty({
    description: 'Postal code',
    example: '12345',
  })
  @IsString()
  @IsOptional()
  postalCode: string;

  @ApiProperty({
    description: 'Country',
    example: 'USA',
  })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({
    description: 'Shipping ID',
    example: 1,
  })
  @IsInt()
  shippingId: number;

  @ApiProperty({
    description: 'Order items',
    example: [
      {
        productSpecificationId: 1,
        quantity: 2,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
