import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  // firstName
  @IsString({ message: 'firstName must be a string' })
  @MinLength(3, {
    message: 'firstName must be at least 3 characters',
  })
  @MaxLength(30, {
    message: 'firstName must be at most 30 characters',
  })
  firstName: string;
  // lastName
  @IsString({ message: 'lastName must be a string' })
  @MinLength(3, { message: 'lastName must be at least 3 characters' })
  @MaxLength(30, {
    message: 'lastName must be at most 30 characters',
  })
  lastName: string;
  // Email
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, { message: 'Thie Email Must be Required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
  // Password
  @IsString({ message: 'Password must be a string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, {
    message: 'password must be at most 20 characters',
  })
  password: string;
}
export class SignInDto {
  // Email
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, { message: 'Thie Email Must be Required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
  // Password
  @IsString({ message: 'Password must be a string' })
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, {
    message: 'password must be at most 20 characters',
  })
  password: string;
}

export class ResetPasswordDto {
  // Email
  @IsString({ message: 'Email must be a string' })
  @MinLength(0, { message: 'Thie Email Must be Required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
}
