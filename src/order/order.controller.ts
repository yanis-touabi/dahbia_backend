import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Request,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/Auth.guard';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/user/decorator/Roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  @UseGuards(AuthGuard)
  async create(
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
    @Request() req,
  ) {
    // extract the userId from the token
    const userId = req.user ? req.user.id : null;
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully.',
  })
  @UseGuards(AuthGuard)
  @Roles([Role.ADMIN])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
    updateOrderDto: UpdateOrderDto,
    @Request() req,
  ) {
    // extract the user from the token
    const user = req.user;
    return this.orderService.updateOrder(id, updateOrderDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @Roles([Role.ADMIN])
  async getOrders(@Request() req) {
    const user = req.user;
    return this.orderService.getOrders(user);
  }

  @Get(':orderId/items')
  @ApiOperation({
    summary: 'Get order items by order ID (Admin only)',
  })
  @Roles([Role.ADMIN])
  async getOrderItems(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Request() req,
  ) {
    const user = req.user;
    return this.orderService.getOrderItems(orderId, user);
  }
}
