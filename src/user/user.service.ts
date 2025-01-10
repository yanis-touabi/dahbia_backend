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

  async create(createUserDto: CreateUserDto): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
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

  async findAll(query) {
    const {
      limit,
      skip: offset,
      sort: orderBy = 'desc',
      name,
      email,
      role,
    } = query;

    const take = Number.isNaN(Number(limit)) ? Number(limit) : 10;
    const skip = Number.isNaN(Number(offset)) ? Number(offset) : 0;

    if (!['asc', 'desc'].includes(orderBy)) {
      throw new HttpException('Invalid sort value', 400);
    }

    const users = await this.prisma.user.findMany({
      take,
      skip,
      orderBy: {
        id: orderBy,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        // createdAt: true,
        // updatedAt: true,
      },
    });
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
    const userById = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userById) {
      throw new NotFoundException('User not found');
    }

    let user = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      const password = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
      user = {
        ...user,
        password,
      };
    }

    const updateUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: user,
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

  // ===================== For User =====================
  // User Can Get Data
  async getMe(payload) {
    if (!payload.id) {
      throw new NotFoundException('User not found');
    }

    // get the user from the database
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete user.password;

    return {
      status: 200,
      message: 'User found successfully',
      data: user,
    };
  }

  // User Can Update Data
  async updateMe(payload, updateUserDto: UpdateUserDto) {
    if (!payload.id) {
      throw new NotFoundException('User not found');
    }
    const userById = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    delete userById.password;

    if (!userById) {
      throw new NotFoundException('User not found');
    }
    // update the user
    const updatedUser = await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: updateUserDto,
    });

    delete updatedUser.password;

    return {
      status: 200,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  // User Can unActive his account
  async deleteMe(payload) {
    if (!payload.id) {
      throw new NotFoundException('User not found');
    }
    const userById = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!userById) {
      throw new NotFoundException('User not found');
    }
    // delete the user
    const deletedUser = await this.prisma.user.update({
      where: {
        id: payload.id,
      },
      data: {
        isActive: false,
      },
    });
    return {
      status: 200,
      message: 'User deleted successfully',
      data: deletedUser,
    };
  }
}
