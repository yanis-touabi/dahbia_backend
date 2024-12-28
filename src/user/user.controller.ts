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
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guard/index';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
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

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
function UseGuard(
  AuthGuard: (
    type?: string | string[],
  ) => import('@nestjs/passport').Type<
    import('@nestjs/passport').IAuthGuard
  >,
) {
  throw new Error('Function not implemented.');
}
