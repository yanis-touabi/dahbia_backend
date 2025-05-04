import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  //! the cart item will be implemented in the cart module,
  //! add a functionality that will remove an item from the cart
  //! add a functionality that will add an item to the cart

  async create(createCartDto: CreateCartDto) {
    return this.prisma.cart.create({
      data: {
        ...createCartDto,
        sessionId: createCartDto.sessionId || uuidv4(),
        totalPrice: 0,
        lastActivityAt: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.cart.findMany({
      include: {
        cartItems: true,
      },
    });
  }

  async findOne(id: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: {
        cartItems: {
          include: {
            productSpecification: {
              include: {
                product: true,
                size: true,
                color: true,
                material: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  async findBySessionId(sessionId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: {
        cartItems: {
          include: {
            productSpecification: {
              include: {
                product: true,
                size: true,
                color: true,
                material: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return new NotFoundException(
        `Cart with session ID ${sessionId} not found`,
      );
    }

    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    return this.prisma.cart.update({
      where: { id },
      data: {
        ...updateCartDto,
        lastActivityAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.cart.delete({
      where: { id },
    });
  }

  async mergeCarts(userId: number, sessionId: string) {
    const guestCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { cartItems: true },
    });

    if (!guestCart) {
      return;
    }

    const userCart = await this.prisma.cart.findFirst({
      where: { userId },
      include: { cartItems: true },
    });

    if (userCart) {
      // Merge guest cart items into user cart
      for (const item of guestCart.cartItems) {
        await this.prisma.cartItem.upsert({
          where: {
            cartId_productSpecificationId: {
              cartId: userCart.id,
              productSpecificationId: item.productSpecificationId,
            },
          },
          update: {
            quantity: {
              increment: item.quantity,
            },
          },
          create: {
            cartId: userCart.id,
            productSpecificationId: item.productSpecificationId,
            quantity: item.quantity,
          },
        });
      }

      // Delete guest cart
      await this.remove(guestCart.id);
    } else {
      // Convert guest cart to user cart
      await this.update(guestCart.id, { userId, sessionId: null });
    }
  }
}
