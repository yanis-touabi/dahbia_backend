import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  IsBoolean,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';

export class ProductSpecificationDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString({ message: 'sku Must be a String' })
  @MinLength(3, { message: 'sku must be at least 3 characters' })
  @IsOptional()
  sku: string;

  @IsString({ message: 'Title Must be a String' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  name: string;

  @IsString({ message: 'Description Must be a String' })
  @MinLength(20, {
    message: 'Description must be at least 20 characters',
  })
  description: string;

  @IsString({ message: 'imageCover Must be a String' })
  @IsUrl({}, { message: 'imageCover Must be a URL' })
  imageCover: string;

  @IsArray({ message: 'Images Must be an array' })
  @IsUrl(
    {},
    { each: true, message: 'Each image must be a valid URL' },
  )
  @IsOptional()
  images: string[];

  @IsNumber({}, { message: 'sold Must be a Number' })
  @IsPositive({ message: 'sold must be a positive number' })
  @IsOptional()
  sold: number;

  @IsNumber({}, { message: 'Price Must be a Number' })
  @Min(1, { message: 'price must be at least 1 L.E' })
  @Max(20000, { message: 'price must be at max 20000 L.E' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'priceAfterDiscount Must be a Number' })
  @Min(1, { message: 'priceAfterDiscount must be at least 1 L.E' })
  @Max(20000, {
    message: 'priceAfterDiscount must be at max 20000 L.E',
  })
  priceAfterDiscount: number;

  @IsOptional()
  @IsBoolean({ message: 'isBestSeller must be a boolean' })
  isBestSeller: boolean;

  @IsOptional()
  @IsEnum(Gender, {
    message: 'gender must be MALE, FEMALE or UNISEX',
  })
  gender: Gender;

  @IsArray({ message: 'Colors Must be an array' })
  @IsString({ each: true, message: 'Each color must be a string' })
  @IsOptional()
  colors: string[];

  @IsInt({ message: 'categoryId must be a valid integer' })
  @IsPositive({ message: 'categoryId must be a positive number' })
  @Min(1, {
    message: 'categoryId must be greater than or equal to 1',
  })
  categoryId: number;

  @IsOptional()
  @IsInt({ message: 'supplierId must be a valid integer' })
  @IsPositive({ message: 'supplierId must be a positive number' })
  supplierId: number;

  @IsOptional()
  @IsInt({ message: 'inventoryId must be a valid integer' })
  @IsPositive({ message: 'inventoryId must be a positive number' })
  @Min(1, {
    message: 'inventoryId must be greater than or equal to 1',
  })
  inventoryId: number;

  @IsOptional()
  @IsInt({ message: 'subCategoryId must be a valid integer' })
  @IsPositive({ message: 'subCategoryId must be a positive number' })
  subCategoryId: number;

  @IsOptional()
  @IsInt({ message: 'brandId must be a valid integer' })
  @IsPositive({ message: 'brandId must be a positive number' })
  brandId: number;

  @IsInt({ message: 'quantity must be a valid integer' })
  @IsPositive({ message: 'quantity must be a positive number' })
  @Min(0, { message: 'quantity must be greater than or equal to 0' })
  quantity: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  specifications: ProductSpecificationDto[];
}
