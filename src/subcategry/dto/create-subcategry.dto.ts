import { IsMongoId, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateSubcategryDto {
    @IsString()
    @IsNotEmpty()
    name:string
    @IsUrl()
    image:string
    @IsMongoId()
    category:string
}
