import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSuppliersDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(100, { message: 'name must be at most 100 characters' })
  name: string;
  @IsString({ message: 'website must be a string' })
  @IsUrl({}, { message: 'website must be a valid URL' })
  @IsOptional()
  website: string;

  // Email
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, {
    message: 'Thie Email Must be Required',
  })
  @IsEmail({}, { message: 'Email is not valid' })
  @IsOptional()
  email: string;

  // Phone
  @IsString({
    message: 'phone must be a string',
  })
  // @IsPhoneNumber('AL', {
  //   message: 'phone must be an Algerian phone number',
  // })
  @IsOptional()
  phone: string;
}
