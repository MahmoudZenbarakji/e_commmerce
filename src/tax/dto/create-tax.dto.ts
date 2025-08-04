import { IsNumber, IsOptional } from "class-validator";

export class CreateTaxDto {
    @IsNumber()
    @IsOptional()
    taxprice:number
        @IsNumber()
        @IsOptional()
        shppingprice:number
}
