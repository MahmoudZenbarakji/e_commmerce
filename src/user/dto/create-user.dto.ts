import { IsBoolean, IsEmail, IsEnum, IsIn, isNotEmpty, IsNotEmpty, IsString, Length, Max, Min, min } from "class-validator";

export class CreateUserDto {
         @IsString()
        @IsNotEmpty()
        @Length(5,20)
    name:string
        @IsString()
        @IsNotEmpty()
        @IsEmail()
    email: string;
        @IsNotEmpty()
        @Length(5, 20)
    password:string;
    //     @IsNotEmpty()
    //     @IsEnum(['user','admin'])
    // role:string;
    @IsIn(['user', 'admin'])
role?: string;

        @IsNotEmpty()
    avatar:string;
    age:Number;
    address:string;
        @IsBoolean()
    active:boolean;
        @IsNotEmpty()
        @IsString()
    verificationCode:string;
    @IsEnum(["male","Female"])
    Gender:string;

}
