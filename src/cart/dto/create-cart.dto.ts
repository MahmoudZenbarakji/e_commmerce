import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsMongoId()
  couponId: string;
}
