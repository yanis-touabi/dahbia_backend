import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    payload,
  ): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    console.log(payload);

    // check if the email already exists in the database
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    // if the user exists, throw an error
    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        400,
      );
    }

    // create a new user
    const password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const user = {
      password,
      role: createUserDto.role ?? Role.USER,
      isActive: true,
    };

    const newUser = await this.prisma.user.create({
      data: { ...createUserDto, ...user },
    });

    return {
      status: 200,
      message: 'User created successfully',
      data: newUser,
    };
  }

  async findAll() {
    console.log('rani hna');
    const users = await this.prisma.user.findMany();
    console.log('users', users);
    return {
      status: 200,
      message: 'Users found successfully',
      data: users,
    };
  }

  async findOne(id: number): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    const userById = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userById) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 200,
      message: 'User found successfully',
      data: userById,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log('id', id);
    console.log('updateUserDto', updateUserDto);
    const userById = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userById) {
      throw new NotFoundException('User not found');
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
    if (!updateUser) {
      throw new HttpException('User not updated', 400);
    }
    return {
      status: 200,
      message: 'User updated successfully',
      data: updateUser,
    };
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const deletedUser = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    if (!deletedUser) {
      throw new HttpException('User not deleted', 400);
    }
    return {
      status: 200,
      message: 'User deleted successfully',
      data: deletedUser,
    };
  }
}
