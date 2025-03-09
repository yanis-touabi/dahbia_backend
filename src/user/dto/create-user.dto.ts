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
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  // FirstName
  @ApiProperty({
    example: 'hafidha',
    description: 'The first name of the user',
  })
  @IsString({ message: 'FirstName must be a string' })
  @MinLength(3, {
    message: 'FirstName must be at least 3 characters',
  })
  @MaxLength(30, {
    message: 'FirstName must be at most 30 characters',
  })
  firstName: string;

  // LastName
  @ApiProperty({
    example: 'front',
    description: 'The last name of the user',
  })
  @IsString({ message: 'LastName must be a string' })
  @MinLength(3, {
    message: 'LastName must be at least 3 characters',
  })
  @MaxLength(30, {
    message: 'LastName must be at most 30 characters',
  })
  lastName: string;

  // Email
  @ApiProperty({
    example: 'hafidha@gmail.com',
    description: 'The email address of the user',
  })
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, {
    message: 'The Email Must be Required',
  })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  // Password
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
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
  @ApiProperty({
    example: 'USER',
    description: 'The role of the user (USER or ADMIN)',
    enum: ['USER', 'ADMIN'],
    required: false,
  })
  @IsEnum(['USER', 'ADMIN'], {
    message: 'role must be user or admin',
  })
  @MinLength(0, {
    message: 'The role Must be Required',
  })
  @IsOptional()
  role: Role;

  // Avatar
  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'The URL of the user avatar',
    required: false,
  })
  @IsString({ message: 'avatar must be a string' })
  @IsUrl({}, { message: 'avatar must be a valid URL' })
  @IsOptional()
  avatar: string;

  // Age
  @ApiProperty({
    example: 31,
    description: 'The age of the user',
    required: false,
  })
  @IsNumber({}, { message: 'age must be a number' })
  @IsOptional()
  age: number;

  // PhoneNumber
  @ApiProperty({
    example: '+213123456789',
    description: 'The phone number of the user',
    required: false,
  })
  @IsString({
    message: 'phoneNumber must be a string',
  })
  // @IsPhoneNumber('AL', {
  //   message: 'phoneNumber must be an Algerian phone number',
  // })
  @IsOptional()
  phoneNumber: string;

  // Active
  @ApiProperty({
    example: true,
    description: 'Indicates if the user account is active',
    required: false,
  })
  @IsBoolean({
    message: 'active must be a boolean',
  })
  @IsEnum([true, false], {
    message: 'active must be true or false',
  })
  @IsOptional()
  isActive: boolean;

  // VerificationCode
  @ApiProperty({
    example: '123456',
    description: 'The verification code for the user',
    required: false,
  })
  @IsString({
    message: 'verificationCode must be a string',
  })
  @IsOptional()
  @Length(6, 6, {
    message: 'verificationCode must be 6 characters',
  })
  verificationCode: string;

  // Gender
  @ApiProperty({
    example: 'MALE',
    description: 'The gender of the user (MALE or FEMALE)',
    enum: ['MALE', 'FEMALE'],
    required: false,
  })
  @IsEnum(['MALE', 'FEMALE'], {
    message: 'gender must be male or female',
  })
  @IsOptional()
  gender: Gender;
}
