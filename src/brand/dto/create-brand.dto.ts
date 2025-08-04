import { IsString, IsUrl, Length } from "class-validator"

export class CreateBrandDto {
        @IsString()
        @Length(5,20)
        name:string
        @IsUrl()
        image:string
    
}
