import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCompanyInfoDto {
  @ApiProperty({ example: 'My Jewelry Store' })
  @IsString()
  @MaxLength(255)
  companyName: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  @MaxLength(20)
  zipCode: string;

  @ApiProperty({ example: 'United States' })
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @ApiProperty({ example: 'contact@myjewelry.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'https://myjewelry.com' })
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  websiteURL: string;

  @ApiProperty({ example: '8:00AM - 5:00PM' })
  @IsOptional()
  @MaxLength(255)
  visitingHours: string;

  @ApiProperty({ example: 'About our jewelry store...' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 'https://facebook.com/yourpage' })
  @IsUrl()
  @IsOptional()
  facebook: string;

  @ApiProperty({ example: 'https://instagram.com/yourpage' })
  @IsUrl()
  @IsOptional()
  instagram: string;

  @ApiProperty({ example: 'https://twitter.com/yourpage' })
  @IsUrl()
  @IsOptional()
  twitter: string;

  @ApiProperty({ example: 'https://linkedin.com/company/yourpage' })
  @IsUrl()
  @IsOptional()
  linkedIn: string;

  @ApiProperty({
    example: 100,
    description: 'The latitude of the company',
  })
  @IsNumber({}, { message: 'latitude Must be a Number' })
  @Transform(({ value }) => parseFloat(value))
  latitude: number;

  @ApiProperty({
    example: 100,
    description: 'The longitude of the company',
  })
  @IsNumber({}, { message: 'longitude Must be a Number' })
  @Transform(({ value }) => parseFloat(value))
  longitude: number;
}
