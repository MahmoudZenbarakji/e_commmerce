import { isString, IsString, IsUrl, Length } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @Length(5,20)
    name:string
    @IsUrl()
    image:string

}
