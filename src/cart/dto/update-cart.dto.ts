import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({ required: false })
  @IsOptional()
  userId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
