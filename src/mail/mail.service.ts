import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    try {
      await this.mailerService.sendMail({
        from: `dahbia <${process.env.EMAIL_USERNAME}>`,
        to,
        subject: 'Réinitialisation de votre mot de passe',
        template, // Template file (e.g., 'order-confirmation')
        context,
      });
      console.log(`Email de réinitialisation envoyé à ${to}`);
    } catch (error) {
      console.error(
        'Erreur lors de l’envoi de l’e-mail de réinitialisation :',
        error,
      );
    }
  }

  async sendOrderNotification(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    try {
      await this.mailerService.sendMail({
        from: `dahbia <${process.env.EMAIL_USERNAME}>`,
        to,
        subject,
        template,
        context,
      });
      console.log(`Email envoyé à ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendOrderEmails(
    customerEmail: string,
    storeOwnerEmail: string,
    orderDetails: any,
  ) {
    // notify the store owner
    await this.sendOrderNotification(
      storeOwnerEmail,
      'Nouvelle commande reçue',
      'admin-notification', // template for admin
      orderDetails,
    );

    // notify the customer
    await this.sendOrderNotification(
      customerEmail,
      'Confirmation de votre commande',
      'customer-notification', // template for customer
      orderDetails,
    );
  }
}
