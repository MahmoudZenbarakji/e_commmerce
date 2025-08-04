import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";

export class SignUpDto {
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

}
export class SignInDto{

        @IsString()
        @IsNotEmpty()
        @IsEmail()
    email: string;
        @IsNotEmpty()
        @Length(5, 20)
    password:string;

}
export class ResetPasswordDto{
        @IsString()
        @IsNotEmpty()
        @IsEmail()
    email: string;
}
export class ChangePasswordDto{
        @IsString()
        @IsNotEmpty()
        @IsEmail()
    email: string;
        @IsNotEmpty()
        @Length(5, 20)
    password:string;
}
export class VerifyCodeDto {
    @IsEmail()
  email: string;
  @IsString()
  @Length(6,6)
  code: string;
}
