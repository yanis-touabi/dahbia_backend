import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, UserMeController } from './user.controller';

// For Admin
@Module({
  controllers: [UserController, UserMeController],
  providers: [UserService],
})
export class UserModule {}
