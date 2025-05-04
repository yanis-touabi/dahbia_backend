import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductInventoryDto {
  @ApiProperty({
    example: 100,
    description: 'The quantity of the product in inventory',
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  quantity?: number;

  // @ApiProperty({
  //   example: '2023-12-31T23:59:59Z',
  //   description: 'The date when the product inventory was deleted',
  //   required: false,
  //   nullable: true,
  // })
  // @IsOptional()
  // @Type(() => Date)
  // deletedAt?: Date | null;
}
