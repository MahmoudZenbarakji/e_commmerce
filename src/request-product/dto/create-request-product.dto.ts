import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRequestProductDto {
    @IsString()
    @IsNotEmpty()
    titleNeed:string
    @IsString()
    details:string
    @IsNumber()
    @IsNotEmpty()
    quantity:number
    @IsString()
    category:string
    user:{  
        _id:string
    }

}
