import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '../user/guard/Auth.guard';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createCartDto: CreateCartDto,
    @Req() req: Request,
  ) {
    if (req.user) {
      // Authenticated user - use userId from token
      return this.cartService.create({
        ...createCartDto,
        userId: req?.user.id,
      });
    } else {
      // Unauthenticated user - use sessionId from cookies
      const sessionId = req.cookies?.sessionId;
      if (!sessionId) {
        return new BadRequestException(
          'Session ID is required for unauthenticated users',
        );
      }
      return this.cartService.create({
        ...createCartDto,
        sessionId,
      });
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Get('session/:sessionId')
  findBySessionId(@Param('sessionId') sessionId: string) {
    return this.cartService.findBySessionId(sessionId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }

  //   @Post('merge')
  //   @UseGuards(AuthGuard)
  //   async mergeCarts(@Req() req: Request) {
  //     const sessionId = req.cookies?.sessionId;
  //     if (!sessionId) {
  //       return;
  //     }

  //     const userId = req.user.id;
  //     return this.cartService.mergeCarts(userId, sessionId);
  //   }
}
