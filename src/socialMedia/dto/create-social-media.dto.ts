import { IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSocialMediaDto {
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
}
