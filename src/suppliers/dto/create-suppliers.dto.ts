import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuppliersDto {
  @ApiProperty({
    example: 'Supplier Name',
    description: 'The name of the supplier',
  })
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(100, { message: 'name must be at most 100 characters' })
  name: string;

  @ApiProperty({
    example: 'https://example.com',
    description: 'The website URL of the supplier',
    required: false,
  })
  @IsString({ message: 'website must be a string' })
  @IsUrl({}, { message: 'website must be a valid URL' })
  @IsOptional()
  website: string;

  @ApiProperty({
    example: 'supplier@example.com',
    description: 'The email address of the supplier',
    required: false,
  })
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, {
    message: 'The Email Must be Required',
  })
  @IsEmail({}, { message: 'Email is not valid' })
  @IsOptional()
  email: string;

  @ApiProperty({
    example: '+213123456789',
    description: 'The phone number of the supplier',
    required: false,
  })
  @IsString({
    message: 'phone must be a string',
  })
  // @IsPhoneNumber('AL', {
  //   message: 'phone must be an Algerian phone number',
  // })
  @IsOptional()
  phone: string;
}
