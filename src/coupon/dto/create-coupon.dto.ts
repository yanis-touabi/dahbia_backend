import { CouponType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({
    example: 'SUMMER2023',
    description: 'The coupon code',
  })
  @IsString({ message: 'code must be a string' })
  @MinLength(3, { message: 'code must be at least 3 characters' })
  @MaxLength(100, { message: 'code must be at most 100 characters' })
  code: string;

  @ApiProperty({
    example: '2023-01-01',
    description:
      'The start date of the coupon in the format YYYY-MM-DD',
  })
  @IsString({ message: 'startDate must be a string' })
  @IsDateString(
    {},
    {
      message:
        'startDate must be a valid date string in the format YYYY-MM-DD',
    },
  )
  startDate: string;

  @ApiProperty({
    example: '2023-12-31',
    description:
      'The end date of the coupon in the format YYYY-MM-DD',
  })
  @IsString({ message: 'endDate must be a string' })
  @IsDateString(
    {},
    {
      message:
        'endDate must be a valid date string in the format YYYY-MM-DD',
    },
  )
  endDate: string;

  @ApiProperty({
    example: 10,
    description: 'The discount value of the coupon',
  })
  @IsNumber({}, { message: 'discount must be a number' })
  @Min(0, { message: 'discount must be at least 0' })
  discount: number;

  @ApiProperty({
    example: 'PERCENTAGE',
    description: 'The type of the coupon (PERCENTAGE or FIXED)',
    enum: ['PERCENTAGE', 'FIXED'],
    required: false,
  })
  @IsEnum(['PERCENTAGE', 'FIXED'], {
    message: 'type must be percentage or fixed',
  })
  @IsOptional()
  type: CouponType;
}
