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
  findAll() {
    return this.userService.findAll();
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

  //  @docs   Admin Can Update a single user
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

  @Delete(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
