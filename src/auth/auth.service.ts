import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto/auth.dto';
import { Role, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signUpDto.email,
      },
    });
    if (user) {
      throw new HttpException('User already exist', 400);
    }
    const password = await bcrypt.hash(
      signUpDto.password,
      saltOrRounds,
    );
    const userCreated = {
      password,
      role: Role.USER,
      isActive: true,
    };
    const newUser = await this.prisma.user.create({
      data: {
        ...signUpDto,
        ...userCreated,
      },
    });

    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      status: 200,
      message: 'User created successfully',
      data: newUser,
      access_token: token,
    };
  }

  async signIn(signInDto: SignInDto) {
    // email, password
    const user = await this.prisma.user.findUnique({
      where: {
        email: signInDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    delete user.password;

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      status: 200,
      message: 'User logged in successfully',
      data: user,
      access_token: token,
    };
  }

  async resetPassword({ email }: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    // create code 6 digit
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    // inser code in db=> verificationCode

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        verificationCode: code,
      },
    });

    // send code to user email
    const htmlMessage = `
      <div>
        <h1>Forgot your password? If you didn't forget your password, please ignore this email!</h1>
        <p>Use the following code to verify your account: <h3 style="color: red; font-weight: bold; text-align: center">${code}</h3></p>
        <h6 style="font-weight: bold">Ecommerce-Nest.JS</h6>
      </div>
      `;

    await this.mailService.sendMail({
      from: `Ecommerce-Nest.JS <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: `renitialize your password`,
      html: htmlMessage,
    });
    return {
      status: 200,
      message: `Code sent successfully on your email (${email})`,
    };
  }

  async verifyCode({ email, code }: { email: string; code: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        verificationCode: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (user.verificationCode !== code) {
      throw new UnauthorizedException('Invalid code');
    }

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        verificationCode: null,
      },
    });

    return {
      status: 200,
      message:
        'Code verified successfully, go to change your password',
    };
  }

  async changePassword(changePasswordData: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: changePasswordData.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const password = await bcrypt.hash(
      changePasswordData.password,
      saltOrRounds,
    );

    await this.prisma.user.update({
      where: {
        email: changePasswordData.email,
      },
      data: {
        password,
      },
    });

    return {
      status: 200,
      message: 'Password changed successfully, go to login',
    };
  }
}
