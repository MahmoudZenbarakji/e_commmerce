import { Body, Controller, ForbiddenException, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto,SignUpDto,ResetPasswordDto,ChangePasswordDto, VerifyCodeDto } from './dto/auth-user.dto';
import { JwtService } from '@nestjs/jwt';
import { sign } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

  ) {}

  @Post('sign-up')
  signUp(
    @Body(new ValidationPipe({forbidNonWhitelisted:true}))
    signUp:SignUpDto,
  ){
    return this.authService.signUp(signUp)
  }
  @Post('sign-in')
  siginIn(
    @Body(new ValidationPipe({forbidNonWhitelisted:true}))
     signin:SignInDto
    ){
      return this.authService.siginIn(signin)
    }

      @Post('reset-password')
  resetPassword(
    @Body(new ValidationPipe({forbidNonWhitelisted:true}))
     email:ResetPasswordDto
    ){
      return this.authService.resetPassword(email)
    }
    @Post("verify-code")
    verifyCode(
      @Body(new ValidationPipe({ forbidNonWhitelisted: true }))
      verifyCodeDto: VerifyCodeDto
    ) {
      return this.authService.verifyCode(verifyCodeDto);
    }

    @Post("change-Password")
    changePassword(@Body(new ValidationPipe({forbidNonWhitelisted:true}))
    changepassword:ChangePasswordDto
  ){
    return this.authService.changePassword(changepassword)
    }
  }