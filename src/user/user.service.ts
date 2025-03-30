import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
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
    try {
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
    } catch (error) {
      console.error('Error in create user:', {
        createUserDto,
        error,
      });
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during user creation',
      );
    }
  }

  async findAll(query) {
    try {
      const {
        limit,
        skip: offset,
        sort: orderBy = 'desc',
        name,
        email,
        role,
      } = query;

      const take = !isNaN(Number(limit)) ? Number(limit) : 10;
      const skip = !isNaN(Number(offset)) ? Number(offset) : 0;

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
    } catch (error) {
      console.error('Error in find all users:', { query, error });
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during users retrieval',
      );
    }
  }

  async findOne(id: number): Promise<{
    status: number;
    message: string;
    data: User;
  }> {
    try {
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
    } catch (error) {
      console.error('Error in finding a user:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during user retrieval',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
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
    } catch (error) {
      console.error('Error in update a user:', {
        id,
        updateUserDto,
        error,
      });
      if (
        error instanceof NotFoundException ||
        error instanceof HttpException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during user update',
      );
    }
  }

  async remove(id: number) {
    try {
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
    } catch (error) {
      console.error('Error in remove a user:', { id, error });
      if (
        error instanceof NotFoundException ||
        error instanceof HttpException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during user deletion',
      );
    }
  }

  // ===================== For User =====================
  // User Can Get Data
  async getMe(payload) {
    try {
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
    } catch (error) {
      console.error('Error in getting the user personal data :', {
        payload,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during user retrieval',
      );
    }
  }

  // User Can Update Data
  async updateMe(payload, updateUserDto: UpdateUserDto) {
    try {
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
    } catch (error) {
      console.error('Error in update the user personal data:', {
        payload,
        updateUserDto,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during user update',
      );
    }
  }

  // User Can unActive his account
  async deleteMe(payload) {
    try {
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
    } catch (error) {
      console.error('Error in deleting the user account:', {
        payload,
        error,
      });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during user deletion',
      );
    }
  }
}
