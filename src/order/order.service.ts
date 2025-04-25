import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { User } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId?: number) {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        addressLine1,
        addressLine2,
        commune,
        wilayaId,
        postalCode,
        country,
        shippingId,
        orderItems,
      } = createOrderDto;

      const orderData = await this.prisma.$transaction(
        async (tx) => {
          // 1. User Details Submission
          let user: User | null = null;
          if (userId) {
            // Find the user if userId is provided
            user = await tx.user.findUnique({
              where: { id: userId },
            });

            if (!user) {
              throw new NotFoundException(
                `User with ID ${userId} not found`,
              );
            }
          } else {
            // Check if user with the email exists
            let existingUser = await tx.user.findUnique({
              where: { email: email },
            });

            if (existingUser) {
              // Use existing user
              user = existingUser;
            } else {
              // Create a new user if userId is not provided
              user = await tx.user.create({
                data: {
                  firstName,
                  lastName,
                  email,
                  phoneNumber,
                  isActive: false,
                  password: '123456', // Add a default password
                  addresses: {
                    create: {
                      addressLine1,
                      addressLine2,
                      commune,
                      wilayaId,
                      postalCode,
                      country,
                      phoneNumber,
                    },
                  },
                },
              });
            }
          }

          if (!user) {
            throw new Error('User not found or could not be created');
          }

          // 2. Shipping Method Selection
          const shipping = await tx.shipping.findUnique({
            where: { id: shippingId },
          });

          if (!shipping) {
            throw new NotFoundException(
              `Shipping with ID ${shippingId} not found`,
            );
          }

          // Calculate subtotal and shipping cost
          let subtotal = 0;
          let shippingCost = shipping.amount;
          const productSpecifications = [];

          for (const item of orderItems) {
            const productSpecification =
              await tx.productSpecification.findUnique({
                where: { id: item.productSpecificationId },
                include: { product: true },
              });

            if (
              !productSpecification ||
              !productSpecification.product
            ) {
              throw new NotFoundException(
                `Product Specification with ID ${item.productSpecificationId} not found`,
              );
            }
            productSpecifications.push(productSpecification);

            subtotal +=
              Number(productSpecification.product.price) *
              item.quantity;

            // // Accumulate shipping cost only for products without free shipping
            // if (!productSpecification.product.isFreeShipping) {
            //   shippingCost += shipping.amount; // Assuming shipping cost is per product
            // }
          }

          // If all products have free shipping, set shipping cost to 0
          if (
            productSpecifications.every(
              (ps) => ps.product.isFreeShipping,
            )
          ) {
            shippingCost = 0;
          }

          const totalAmount = subtotal + shippingCost;

          // 3. Order Creation
          const lastOrder = await tx.order.findFirst({
            orderBy: {
              createdAt: 'desc',
            },
          });

          let orderNumber: string;
          if (lastOrder) {
            orderNumber = (parseInt(lastOrder.orderNumber) + 1)
              .toString()
              .padStart(5, '0');
          } else {
            orderNumber = '00001';
          }

          // Check if address already exists for the user
          let address = await tx.address.findFirst({
            where: {
              userId: user.id,
              addressLine1,
              addressLine2,
              commune,
              wilayaId,
              postalCode,
              country,
              phoneNumber,
            },
          });

          // If address does not exist, create a new address
          if (!address) {
            address = await tx.address.create({
              data: {
                userId: user.id,
                addressLine1,
                addressLine2,
                commune,
                wilayaId,
                postalCode,
                country,
                phoneNumber,
              },
            });
          }

          const order = await tx.order.create({
            data: {
              orderNumber,
              userId: user.id,
              addressId: address.id,
              shippingId,
              shippingCost: new Prisma.Decimal(shippingCost),
              subtotal: new Prisma.Decimal(subtotal),
              totalAmount: new Prisma.Decimal(totalAmount),
              orderItems: {
                create: orderItems.map((item, index) => ({
                  productSpecificationId: item.productSpecificationId,
                  quantity: item.quantity,
                  unitPrice: new Prisma.Decimal(
                    productSpecifications[index].product.price as any,
                  ),
                })),
              },
            },
          });
          return {
            order,
            user,
          };
        },
        {
          maxWait: 10000, // ms to wait for a connection (optional)
          timeout: 30000, // ms allowed for transaction (default: 5000)
        },
      );

      // Move mail sending here - outside transaction
      await this.mailService.sendOrderEmails(
        email,
        'yanis.touabi@gmail.com',
        {
          ...orderData.order,
          name: orderData.user.firstName,
        },
      );

      return {
        status: 201,
        message: 'Order created successfully',
        data: orderData.order,
      };
    } catch (error) {
      console.error('Error in create order:', {
        createOrderDto,
        userId,
        error,
      });
      throw new InternalServerErrorException(
        'An unexpected error occurred during order creation',
      );
    }
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      // get the order from the database before the update
      const orderBeforeUpdate = await this.prisma.order.findUnique({
        where: {
          id: id,
        },
      });
      // 2. Fetch the order items details using the OrderItemDetails view
      const orderItemDetails =
        await this.prisma.orderItemDetails.findMany({
          where: { orderId: id },
        });

      if (!orderItemDetails || orderItemDetails.length === 0) {
        throw new NotFoundException(
          `Order items with Order ID ${id} not found`,
        );
      }

      // 3. Update the order
      const updatedOrder = await this.prisma.order.update({
        where: { id: id },
        data: updateOrderDto,
      });

      // 4. Fetch the updated order
      const fetchedOrder = await this.prisma.order.findUnique({
        where: { id: id },
      });

      // 5. Inventory Management
      if (
        (orderBeforeUpdate.status !== 'DELIVERED' ||
          orderBeforeUpdate.paymentStatus !== 'PAID') &&
        fetchedOrder.status === 'DELIVERED' &&
        fetchedOrder.paymentStatus === 'PAID'
      ) {
        try {
          await this.prisma.$transaction(async (tx) => {
            for (const orderItem of orderItemDetails) {
              // Update the sold field in the Product table
              await tx.product.update({
                where: { id: orderItem.productId },
                data: {
                  sold: {
                    increment: orderItem.orderItemQuantity,
                  },
                },
              });

              // Decrease the quantity in the product inventory table
              await tx.productInventory.update({
                where: {
                  productSpecificationId:
                    orderItem.productSpecificationId,
                },
                data: {
                  quantity: {
                    decrement: orderItem.orderItemQuantity,
                  },
                },
              });
            }
          });
        } catch (error) {
          // Handle potential errors during inventory update
          console.error('Inventory update failed:', error);
          throw new Error('Inventory update failed');
        }
      } else if (
        (orderBeforeUpdate.status !== 'CANCELLED' ||
          orderBeforeUpdate.paymentStatus !== 'REFUNDED') &&
        fetchedOrder.status === 'CANCELLED' &&
        fetchedOrder.paymentStatus === 'REFUNDED'
        (orderBeforeUpdate.status !== 'CANCELLED' ||
          orderBeforeUpdate.paymentStatus !== 'REFUNDED') &&
        fetchedOrder.status === 'CANCELLED' &&
        fetchedOrder.paymentStatus === 'REFUNDED'
      ) {
        try {
          await this.prisma.$transaction(async (tx) => {
            for (const orderItem of orderItemDetails) {
              // Restore the sold field in the Product table
              await tx.product.update({
                where: { id: orderItem.productId },
                data: {
                  sold: {
                    decrement: orderItem.orderItemQuantity,
                  },
                },
              });

              // Increase the quantity in the product inventory table
              await tx.productInventory.update({
                where: {
                  productSpecificationId:
                    orderItem.productSpecificationId,
                },
                data: {
                  quantity: {
                    increment: orderItem.orderItemQuantity,
                  },
                },
              });
            }
          });
        } catch (error) {
          // Handle potential errors during inventory update
          console.error('Inventory update failed:', error);
          throw new Error('Inventory update failed');
        }
      }

      // 6. If the orderStatus is CANCELLED, do nothing.

      // 7. Save the updates and return the updated order details.
      return {
        status: 200,
        message: 'Order updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      console.error('Error in update order:', {
        id,
        updateOrderDto,
        error,
      });
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during order update',
      );
    }
  }

  async getOrders() {
    try {
      const orders = await this.prisma.orderDetails.findMany();

      return {
        status: 200,
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch (error) {
      console.error('Error in get orders:', error);
      console.error('Error in get orders:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during order retrieval',
      );
    }
  }

  async getOrderById(id: number) {
    try {
      const order = await this.prisma.orderDetails.findUnique({
      const order = await this.prisma.orderDetails.findUnique({
        where: {
          orderId: id,
          orderId: id,
        },
      });

      if (!order) {
        throw new NotFoundException('Brand not found');
      }

      return {
        status: 200,
        message: 'Brand found',
        data: order,
      };
    } catch (error) {
      console.error('Error in findOne:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during findOne',
      );
    }
  }

  async getOrderItems(orderId: number) {
    try {
      const orderItems = await this.prisma.orderItemDetails.findMany({
      const orderItems = await this.prisma.orderItemDetails.findMany({
        where: {
          orderId: orderId,
        },
      });

      return {
        status: 200,
        message: 'Order items retrieved successfully',
        data: orderItems,
      };
    } catch (error) {
      console.error('Error in get order items:', {
        orderId,
        error,
      });
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during order items retrieval',
      );
    }
  }
}
