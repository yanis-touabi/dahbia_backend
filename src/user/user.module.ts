import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

// For Admin
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
