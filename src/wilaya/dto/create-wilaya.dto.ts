import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateWilayaDto {
  @ApiProperty({
    description: 'The code of the wilaya',
    example: 16,
  })
  @IsInt({ message: 'code must be an integer' })
  code: number;

  @ApiProperty({
    description: 'The name of the wilaya',
    example: 'Algiers',
  })
  @IsString({ message: 'name must be a string' })
  @MaxLength(100, { message: 'name must be at most 100 characters' })
  name: string;
}
