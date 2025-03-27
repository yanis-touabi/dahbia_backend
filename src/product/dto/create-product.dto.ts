import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  IsEnum,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class ProductSpecificationDto {
  @ApiProperty({
    example: 100,
    description: 'The quantity of the product in stock',
  })
  @IsInt({ message: 'quantity must be a valid integer' })
  @IsPositive({ message: 'quantity must be a positive number' })
  @Min(0, { message: 'quantity must be greater than or equal to 0' })
  quantity: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the size of the product',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'sizeId must be a valid integer' })
  @IsPositive({ message: 'sizeId must be a positive number' })
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  sizeId: number;
  @ApiProperty({
    example: 1,
    description: 'The ID of the color of the product',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'colorId must be a valid integer' })
  @IsPositive({ message: 'colorId must be a positive number' })
  @Optional()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  colorId: number;
  @ApiProperty({
    example: 1,
    description: 'The ID of the material of the product',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'materialId must be a valid integer' })
  @IsPositive({ message: 'materialId must be a positive number' })
  @Optional()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  materialId: number;
}

export class CreateProductDto {
  @ApiProperty({
    example: 'SKU123',
    description: 'The SKU of the product',
    required: false,
  })
  @IsString({ message: 'sku Must be a String' })
  @IsOptional()
  sku: string;

  @ApiProperty({
    example: 'Product Title',
    description: 'The title of the product',
  })
  @IsString({ message: 'Title Must be a String' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  name: string;

  @ApiProperty({
    example: 'This is a detailed description of the product.',
    description: 'The description of the product',
  })
  @IsString({ message: 'Description Must be a String' })
  @MinLength(20, {
    message: 'Description must be at least 20 characters',
  })
  description: string;

  // @ApiProperty({
  //   example: 'https://example.com/image.png',
  //   description: 'The cover image URL of the product',
  // })
  // @IsString({ message: 'imageCover Must be a String' })
  // @IsString({ message: 'imageCover Must be a String' })
  // imageCover: string;

  // @ApiProperty({
  //   example: [
  //     'https://example.com/image1.png',
  //     'https://example.com/image2.png',
  //   ],
  //   description: 'An array of image URLs of the product',
  //   required: false,
  // })
  // @IsArray({ message: 'Images Must be an array' })
  // @IsOptional()
  // images: string[];

  @ApiProperty({
    example: 199.99,
    description: 'The price of the product',
  })
  @IsNumber({}, { message: 'Price Must be a Number' })
  @Min(1, { message: 'price must be at least 1 L.E' })
  @Max(200000, { message: 'price must be at max 20000 L.E' })
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({
    example: 150.0,
    description: 'The price of the product after discount',
    required: false,
  })
  @IsNumber({}, { message: 'priceAfterDiscount Must be a Number' })
  @Min(1, { message: 'priceAfterDiscount must be at least 1 L.E' })
  @Max(20000, {
    message: 'priceAfterDiscount must be at max 20000 L.E',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  priceAfterDiscount: number;

  @ApiProperty({
    example: 'MALE',
    description: 'The gender the product is intended for',
    enum: Gender,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, {
    message: 'gender must be MALE, FEMALE or UNISEX',
  })
  gender: Gender;

  @ApiProperty({
    example: 1,
    description: 'The ID of the category the product belongs to',
  })
  @IsInt({ message: 'categoryId must be a valid integer' })
  @IsPositive({ message: 'categoryId must be a positive number' })
  @Min(1, {
    message: 'categoryId must be greater than or equal to 1',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  categoryId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the supplier of the product',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'supplierId must be a valid integer' })
  @IsPositive({ message: 'supplierId must be a positive number' })
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  supplierId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the brand of the product',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'brandId must be a valid integer' })
  @IsPositive({ message: 'brandId must be a positive number' })
  @Transform(({ value }) => (value ? parseFloat(value) : null))
  brandId: number;

  // is free shipping
  @ApiProperty({
    example: true,
    description: 'Indicates if the order is free shipping',
    required: false,
  })
  @IsBoolean({
    message: 'is free shipping must be a boolean',
  })
  @IsEnum([true, false], {
    message: 'is free shipping must be true or false',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isFreeShipping: boolean;

  // Is promo
  @ApiProperty({
    example: true,
    description: 'Indicates if the order is in promo or not',
    required: false,
  })
  @IsBoolean({
    message: 'is promo must be a boolean',
  })
  @IsEnum([true, false], {
    message: 'is promo must be true or false',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isPromo: boolean;

  @ApiProperty({
    example: [
      {
        quantity: 10,
        sizeId: 1,
        colorId: 2,
        materialId: 3,
      },
      {
        quantity: 5,
        sizeId: 2,
        colorId: 1,
        materialId: 2,
      },
    ],
    description: 'An array of product inventory specifications',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value); // Parse JSON string into an array of objects
        return Array.isArray(parsedValue)
          ? parsedValue.map((item) =>
              Object.assign(new ProductSpecificationDto(), item),
            )
          : [];
      } catch (e) {
        return []; // Return empty array if parsing fails
      }
    }
    return Array.isArray(value)
      ? value.map((item) =>
          Object.assign(new ProductSpecificationDto(), item),
        )
      : [];
  })
  specifications: ProductSpecificationDto[];
}
