// import {
//   Injectable,
//   NotFoundException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { CreateSocialMediaDto } from './dto/create-social-media.dto';
// import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class SocialMediaService {
//   constructor(private prisma: PrismaService) {}

//   async create(createSocialMediaDto: CreateSocialMediaDto) {
//     try {
//       // There should only be one social media record
//       const existing = await this.prisma.socialMedia.findFirst();
//       if (existing) {
//         return this.update(existing.id, createSocialMediaDto);
//       }

//       const socialMedia = await this.prisma.socialMedia.create({
//         data: createSocialMediaDto,
//       });
//       return {
//         status: 200,
//         message: 'Social media links created successfully',
//         data: socialMedia,
//       };
//     } catch (error) {
//       console.error('Error in create:', error);
//       throw new InternalServerErrorException(
//         'An unexpected error occurred during create',
//       );
//     }
//   }

//   async findOne() {
//     try {
//       const socialMedia = await this.prisma.socialMedia.findFirst();
//       if (!socialMedia) {
//         return {
//           status: 200,
//           message: 'No social media links found',
//           data: null,
//         };
//       }
//       return {
//         status: 200,
//         message: 'Social media links found',
//         data: socialMedia,
//       };
//     } catch (error) {
//       console.error('Error in findOne:', error);
//       throw new InternalServerErrorException(
//         'An unexpected error occurred during findOne',
//       );
//     }
//   }

//   async update(
//     id: number,
//     updateSocialMediaDto: UpdateSocialMediaDto,
//   ) {
//     try {
//       const socialMedia = await this.prisma.socialMedia.findUnique({
//         where: { id },
//       });
//       if (!socialMedia) {
//         throw new NotFoundException('Social media links not found');
//       }

//       const updated = await this.prisma.socialMedia.update({
//         where: { id },
//         data: updateSocialMediaDto,
//       });
//       return {
//         status: 200,
//         message: 'Social media links updated successfully',
//         data: updated,
//       };
//     } catch (error) {
//       console.error('Error in update:', { id, error });
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new InternalServerErrorException(
//         'An unexpected error occurred during update',
//       );
//     }
//   }
// }
