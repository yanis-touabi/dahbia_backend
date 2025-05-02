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
import { Roles } from 'src/user/decorator/roles.decorator';
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
  ) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Get()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  async getAllOrders() {
    return this.orderService.getOrders();
  }

  @Get(':id')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a single order by id' }) // Describe endpoint
  @ApiResponse({ status: 200, description: 'Order details.' }) // Response info
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }

  @Get(':orderId/items')
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get order items by order ID (Admin only)',
  })
  async getOrderItems(
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.orderService.getOrderItems(orderId);
  }
}
