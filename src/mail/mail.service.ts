import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOrderConfirmation(
    to: string,
    orderNumber: string,
    totalAmount: number,
  ) {
    await this.mailerService.sendMail({
      to: to,
      subject: 'Order Confirmation',
      template: 'order-confirmation', // `.hbs` extension is appended automatically
      context: {
        name: to,
        orderNumber: orderNumber,
        totalAmount: totalAmount,
      },
    });
  }

  async sendOrderNotification(
    orderNumber: string,
    totalAmount: number,
  ) {
    await this.mailerService.sendMail({
      to: 'store_owner@example.com',
      subject: 'New Order Notification',
      template: 'order-notification', // `.hbs` extension is appended automatically
      context: {
        orderNumber: orderNumber,
        totalAmount: totalAmount,
      },
    });
  }
}
