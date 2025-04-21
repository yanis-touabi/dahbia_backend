import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const contact = await this.prisma.contact.create({
        data: createContactDto,
      });
      return {
        status: 200,
        message: 'Contact created successfully',
        data: contact,
      };
    } catch (error) {
      console.error('Error in create:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during create',
      );
    }
  }

  async findAll() {
    try {
      const contacts = await this.prisma.contact.findMany();
      return {
        status: 200,
        message: 'Contacts found',
        length: contacts.length,
        data: contacts,
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred during findAll',
      );
    }
  }

  async findOne(id: number) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        throw new NotFoundException('Contact not found');
      }

      return {
        status: 200,
        message: 'Contact found',
        data: contact,
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

  async update(id: number, updateContactDto: UpdateContactDto) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
      });
      if (!contact) {
        throw new NotFoundException('Contact not found');
      }

      const updated = await this.prisma.contact.update({
        where: { id },
        data: updateContactDto,
      });
      return {
        status: 200,
        message: 'Contact updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error in update:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during update',
      );
    }
  }

  async remove(id: number) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id },
      });
      if (!contact) {
        throw new NotFoundException('Contact not found');
      }
      await this.prisma.contact.delete({
        where: { id },
      });
      return {
        status: 200,
        message: 'Contact deleted successfully',
      };
    } catch (error) {
      console.error('Error in remove:', { id, error });
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during remove',
      );
    }
  }
}
