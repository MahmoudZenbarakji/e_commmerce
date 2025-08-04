import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
import { Url } from "url";

export class CreateSupplierDto {
    @IsString()
    @IsNotEmpty()
      @Length(5,20)
    name:string
    @IsUrl()
    website:Url
}
