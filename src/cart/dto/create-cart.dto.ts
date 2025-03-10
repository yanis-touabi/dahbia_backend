import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;
}
