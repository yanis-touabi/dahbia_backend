import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Prisma } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { User } from '@prisma/client'; // Prisma-generated type

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId?: number) {
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

    return this.prisma.$transaction(async (tx) => {
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

        if (!productSpecification || !productSpecification.product) {
          throw new NotFoundException(
            `Product Specification with ID ${item.productSpecificationId} not found`,
          );
        }
        productSpecifications.push(productSpecification);

        subtotal +=
          Number(productSpecification.product.price) * item.quantity;

        // // Accumulate shipping cost only for products without free shipping
        // if (!productSpecification.product.isFreeShipping) {
        //   shippingCost += shipping.amount; // Assuming shipping cost is per product
        // }
      }

      // If all products have free shipping, set shipping cost to 0
      if (
        productSpecifications.every((ps) => ps.product.isFreeShipping)
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

      // 4. Order Completion & Notifications
      // await this.mailService.sendOrderConfirmation(
      //   email,
      //   orderNumber,
      //   Number(totalAmount),
      // );
      // await this.mailService.sendOrderNotification(
      //   orderNumber,
      //   Number(totalAmount),
      // );

      return {
        status: 201,
        message: 'Order created successfully',
        data: order,
      };
    });
  }
}
