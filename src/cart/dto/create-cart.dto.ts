import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCartDto {
   @IsMongoId()
  productId: string;

  
  quantity: number;

  @IsOptional()
  @IsString()
  color: string;

  couponId: string;
}
