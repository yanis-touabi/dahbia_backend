import { Role, Gender } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  // FirstName
  @IsString({ message: 'FirstName must be a string' })
  @MinLength(3, {
    message: 'FirstName must be at least 3 characters',
  })
  @MaxLength(30, {
    message: 'FirstName must be at most 30 characters',
  })
  firstName: string;
  // LastName
  @IsString({ message: 'LastName must be a string' })
  @MinLength(3, {
    message: 'LastName must be at least 3 characters',
  })
  @MaxLength(30, {
    message: 'LastName must be at most 30 characters',
  })
  lastName: string;
  // Email
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, {
    message: 'Thie Email Must be Required',
  })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
  // Password
  @IsString({
    message: 'Password must be a string',
  })
  @MinLength(3, {
    message: 'password must be at least 3 characters',
  })
  @MaxLength(20, {
    message: 'password must be at most 20 characters',
  })
  password: string;
  // Role
  @IsEnum(['USER', 'ADMIN'], {
    message: 'role must be user or admin',
  })
  @MinLength(0, {
    message: 'Thie role Must be Required',
  })
  @IsOptional()
  role: Role;
  // Avatar
  @IsString({ message: 'avatar must be a string' })
  @IsUrl({}, { message: 'avatar must be a valid URL' })
  @IsOptional()
  avatar: string;
  //   Age
  @IsNumber({}, { message: 'age must be a number' })
  @IsOptional()
  age: number;
  // PhoneNumber
  @IsString({
    message: 'phoneNumber must be a string',
  })
  // @IsPhoneNumber('AL', {
  //   message: 'phoneNumber must be an Algerian phone number',
  // })
  @IsOptional()
  phoneNumber: string;
  // Active
  @IsBoolean({
    message: 'active must be a boolean',
  })
  @IsEnum([true, false], {
    message: 'active must be true or false',
  })
  @IsOptional()
  isActive: boolean;
  // VerificationCode
  @IsString({
    message: 'verificationCode must be a string',
  })
  @IsOptional()
  @Length(6, 6, {
    message: 'verificationCode must be 6 characters',
  })
  verificationCode: string;
  // Gender
  @IsEnum(['MALE', 'FEMALE'], {
    message: 'gender must be male or female',
  })
  @IsOptional()
  gender: Gender;
}
