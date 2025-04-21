import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'About our jewelry store...' })
  @IsString()
  @IsOptional()
  description: string;
}
