import { Type } from "class-transformer";
import { IsDate, IsDateString, isDateString, IsNotEmpty, IsNumber, IsString, Length, Min, MinDate } from "class-validator";
import { IsFutureDate } from "src/decorators/futureDate.decorator";

export class CreateCouponDto {

    @IsString()
    @Length(5,20)
    name:string

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @IsFutureDate()  
    expireDate:Date

    
    Disount:Number
}

