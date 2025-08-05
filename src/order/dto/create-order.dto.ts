import { IsOptional } from "class-validator"

export class CreateOrderDto {
    @IsOptional()
    shipppingAddress:{  
    alias:string
    details:string,
    phone:number,
    city:string,
    Postalcode:number
}
}
