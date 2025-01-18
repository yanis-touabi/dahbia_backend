import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductInventoryDto {
  @IsInt()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsOptional()
  @Type(() => Date)
  deletedAt?: Date | null;
}
