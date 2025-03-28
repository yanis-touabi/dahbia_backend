import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FilterDataService {
  async removeNullValues(obj: Record<string, any>) {
    return await Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== null),
    );
  }
}
