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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //  @docs   Admin Can Create User
  //  @Route  POST /user
  //  @access Private [admin]
  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
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
    return this.userService.create(createUserDto, req.user);
  }

  //  @docs   Admin Can Get User
  //  @Route  GET /user
  //  @access Private [admin]
  @Get()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  //  @docs   Admin Can Get User by id
  //  @Route  GET /user/:id
  //  @access Private [admin]
  @Get(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  //  @docs   Admin Can Update a user
  //  @Route  UPDATE /user/:id
  //  @access Private [admin]
  @Patch(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}

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
  getMe(@Req() req) {
    return this.userService.getMe(req.user);
  }

  //  @docs   Any User can update data on your account
  //  @Route  PATCH /api/v1/user/me
  //  @access Private [user, admin]
  @Patch()
  @Roles([Role.ADMIN, Role.USER])
  @UseGuards(AuthGuard)
  updateMe(
    @Req() req,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMe(req.user, updateUserDto);
  }

  //  @docs   Any User can unActive his account
  //  @Route  PATCH /api/v1/user/me
  //  @access Private [user, admin]
  @Delete()
  @Roles([Role.ADMIN, Role.USER])
  @UseGuards(AuthGuard)
  deleteMe(@Req() req) {
    return this.userService.deleteMe(req.user);
  }
}
