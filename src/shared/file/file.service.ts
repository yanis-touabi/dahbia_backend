import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileService {
  async saveImage(image: Express.Multer.File): Promise<string> {
    if (!image || !image.originalname || !image.fieldname) {
      throw new HttpException(
        'Invalid image file',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Get file extension
    const fileExt = path.extname(image.originalname);
    // Remove extension from original name and sanitize
    const baseName = path
      .basename(image.originalname, fileExt)
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, ''); // Additional sanitization

    // Generate date string in YYYYMMDD format
    const dateStr = new Date()
      .toISOString()
      .split('T')[0]
      .replace(/-/g, '');

    // Generate 5-digit random number
    const random5digit = Math.floor(10000 + Math.random() * 90000);

    // Create unique filename
    const uniqueFilename = `${baseName}-${dateStr}-${random5digit}${fileExt}`;

    const uploadPath = path.join(
      process.cwd(),
      'public',
      'images',
      image.fieldname,
      uniqueFilename,
    );

    try {
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });
      await fs.writeFile(uploadPath, image.buffer);
      return `/images/${image.fieldname}/${uniqueFilename}`;
    } catch (error) {
      console.error('Error saving image:', error);
      throw new HttpException(
        'Failed to save image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteImage(imagePath: string): Promise<void> {
    if (!imagePath) {
      throw new HttpException(
        'Invalid image path',
        HttpStatus.BAD_REQUEST,
      );
    }

    const absolutePath = path.join(
      process.cwd(),
      'public',
      imagePath,
    );

    try {
      // Check if the file exists before attempting to delete
      await fs.access(absolutePath);
      await fs.unlink(absolutePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`Image not found: ${imagePath}`);
        return;
      }
      console.error('Error deleting image:', error);
      throw new HttpException(
        'Failed to delete image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeNullValues(obj: Record<string, any>) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== null),
    );
  }
}
