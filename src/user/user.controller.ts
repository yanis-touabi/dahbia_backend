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
import { Roles } from 'src/user/decorator/roles.decorator';
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

  @Get()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all Users' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'List of all users.' }) // Response info
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a single User' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'User details.' }) // Response info
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

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

@ApiTags('MyAccount') // Organizes endpoints in Swagger UI
@Controller('myAccount')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles([Role.ADMIN, Role.USER])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get User Account Data' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'User account details.' }) // Response info
  getMe(@Req() req) {
    return this.userService.getMe(req.user);
  }

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
