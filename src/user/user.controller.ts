import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Roles } from './decorator/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guard/index';
import { UserService } from './user.service';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('User') // Organizes endpoints in Swagger UI
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //  @docs   Admin Can Create User
  //  @Route  POST /user
  //  @access Private [admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new User' }) // Describe endpoint
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
  }) // Response info
  create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true, // Explicitly strip non-whitelisted properties
        transform: true, // Transform payloads to DTO instances
      }),
    )
    createUserDto: CreateUserDto,
    @Req() req,
  ) {
    // business logic
    return this.userService.create(createUserDto);
  }

  //  @docs   Admin Can Get User
  //  @Route  GET /user
  //  @access Private [admin]
  @Get()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all Users' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'List of all users.' }) // Response info
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  //  @docs   Admin Can Get User by id
  //  @Route  GET /user/:id
  //  @access Private [admin]
  @Get(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a single User' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'User details.' }) // Response info
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  //  @docs   Admin Can Update a user
  //  @Route  PATCH /user/:id
  //  @access Private [admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a User' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'User successfully updated.',
  }) // Response info
  update(
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  //  @docs   Admin Can delete user
  //  @Route  DELETE /user/:id
  //  @access Private [admin]
  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a User' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted.',
  }) // Response info
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}

@ApiTags('UserMe') // Organizes endpoints in Swagger UI
@Controller('userMe')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  // For User
  //  @docs   Any User can get data on your account
  //  @Route  GET /api/v1/user/me
  //  @access Private [user, admin]
  @Get()
  @Roles([Role.ADMIN, Role.USER])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get User Account Data' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'User account details.' }) // Response info
  getMe(@Req() req) {
    return this.userService.getMe(req.user);
  }

  //  @docs   Any User can update data on your account
  //  @Route  PATCH /api/v1/user/me
  //  @access Private [user, admin]
  @Patch()
  @Roles([Role.ADMIN, Role.USER])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update User Account Data' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'User account successfully updated.',
  }) // Response info
  updateMe(
    @Req() req,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMe(req.user, updateUserDto);
  }

  //  @docs   Any User can unActive his account
  //  @Route  DELETE /api/v1/user/me
  //  @access Private [user, admin]
  @Delete()
  @Roles([Role.ADMIN, Role.USER])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Deactivate User Account' }) // Describe endpoint
  @ApiResponse({
    status: 200,
    description: 'User account successfully deactivated.',
  }) // Response info
  deleteMe(@Req() req) {
    return this.userService.deleteMe(req.user);
  }
}
