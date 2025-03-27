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

    // Ensure filename is safe
    const sanitizedFilename = image.originalname.replace(/\s+/g, '_');
    const uploadPath = path.join(
      process.cwd(),
      'public',
      'images',
      image.fieldname,
      sanitizedFilename,
    );

    try {
      await fs.mkdir(path.dirname(uploadPath), { recursive: true }); // Ensure directory exists
      await fs.writeFile(uploadPath, image.buffer);
      return `/images/${image.fieldname}/${sanitizedFilename}`;
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
}
