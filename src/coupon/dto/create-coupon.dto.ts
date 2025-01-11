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

export class CreateCouponDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(100, { message: 'name must be at most 100 characters' })
  code: string;
  @IsString({ message: 'startDate must be a string' })
  @IsDateString(
    {},
    {
      message:
        'startDate must be a valid date string in the format YYYY-MM-DD',
    },
  )
  startDate: string;
  @IsString({ message: 'endDate must be a string' })
  @IsDateString(
    {},
    {
      message:
        'endDate must be a valid date string in the format YYYY-MM-DD',
    },
  )
  endDate: string;
  @IsNumber({}, { message: 'discount must be a number' })
  @Min(0, { message: 'discount must be at least 0' })
  discount: number;
  // Role
  @IsEnum(['PERCENTAGE', 'FIXED'], {
    message: 'type must be percentage or fixed',
  })
  @IsOptional()
  type: CouponType;
}
