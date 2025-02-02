import {
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth') // Organizes endpoints in Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //  @docs   Sign Up
  //  @Route  POST /api/v1/auth/sign-up
  //  @access Public
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign Up' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'User successfully signed up.',
  }) // Response info
  signUp(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signUpDto: SignUpDto,
  ) {
    return this.authService.signup(signUpDto);
  }

  //  @docs   Sign In
  //  @Route  POST /api/auth/sign-in
  //  @access Public
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign In' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in.',
  }) // Response info
  signIn(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    signInDto: SignInDto,
  ) {
    return this.authService.signIn(signInDto);
  }

  //  @docs   Any User Can Reset Password
  //  @Route  POST /api/v1/auth/reset-password
  //  @access Public
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent.',
  }) // Response info
  resetPassword(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    email: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(email);
  }

  //  @docs   Any User Can Verify Code
  //  @Route  POST /auth/verify-code
  //  @access Public
  @Post('verify-code')
  @ApiOperation({ summary: 'Verify Code' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Code successfully verified.',
  }) // Response info
  verifyCode(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    verifyCode: {
      email: string;
      code: string;
    },
  ) {
    return this.authService.verifyCode(verifyCode);
  }

  //  @docs   Any User Can Change Password
  //  @Route  POST /auth/change-password
  //  @access Private for users=> admin, user
  @Post('change-password')
  @ApiOperation({ summary: 'Change Password' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'Password successfully changed.',
  }) // Response info
  changePassword(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    changePasswordData: SignInDto,
  ) {
    return this.authService.changePassword(changePasswordData);
  }
}
