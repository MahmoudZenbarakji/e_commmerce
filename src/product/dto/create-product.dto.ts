import { Optional } from "@nestjs/common";
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, IsUrl, Max, Min, Validate } from "class-validator";

export class CreateProductDto {
    @IsString()

    title:string
    @IsString()

    description:string
    @IsNumber()

    quantity:number
    @IsString()
    @IsUrl()
    imageCover:string
    @IsArray()
    @IsOptional()
    images:string
    @IsNumber()
    @Optional()
    sold:number
    @IsNumber()
    @Min(1)
    @Max(20000)
    price:number
    @Min(1)
    @Max(20000)
    priceAfterdiscount:number
    @IsArray()
    @IsOptional()
    colors:string
    @IsMongoId()
    @IsString()
    category:string
    @IsMongoId()
    @IsString()
    subcategory:string
    @IsMongoId()
    @IsString()
    @IsOptional()
    brand:string






}
