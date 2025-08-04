import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { ResetPasswordDto, SignInDto,SignUpDto, VerifyCodeDto } from './dto/auth-user.dto';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { Roles } from 'src/decorators/Roles.decorator';
import { MailerService } from '@nestjs-modules/mailer';
const saltOrRounds = 10;
@Injectable()
export class AuthService {
    
      constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>, private jwtservice:JwtService,
        private readonly mailService:MailerService
    ){}
    
      async signUp(signUp:SignUpDto){
        const user = await this.userModel.findOne({email:signUp.email}).select("-password -_v")
        if(user){
            throw new HttpException("the email does not exist",400)
        }
        

        const password = await bcrypt.hash(signUp.password,saltOrRounds)
        const userCreated = {
            password,
            role:'user',
            active:true,
        }
        const newUser = await this.userModel.create({
            ...signUp,
            ...userCreated
        });
                const payload = { _id:newUser.id,email:newUser.email,role:newUser.role };
                const token = await this.jwtservice.signAsync(payload,{secret:process.env.jwt_secret})
        return {
            status:200,
            message:"the user created sucssfully",
            data:newUser,
            access_token:token
        }


      }
     /* async siginIn(siginIn:SignInDto){
        const user  = await  this.userModel.findOne({email:siginIn.email,password:siginIn.password}).select("-+password")
        if(!user){
            throw new NotFoundException("the information is wrong please try again")
        }
        const isMatch = await bcrypt.compare(user.password,siginIn.password)
            const payload = {
                _id:user._id,
                email:user.email,
                role:user.role,
            }
            const token  = await this.jwtservice.signAsync(payload,{
                secret:process.env.jwt_secret
            })
            return{
                status:200,
                message:" logged in sucssesfully",
                data:user,
                access_token:token
            }

      }*/
     async siginIn(signInDto: SignInDto) {
  const user = await this.userModel.findOne({ email: signInDto.email }); // get hashed password

  if (!user) {
    throw new NotFoundException('The email or password is incorrect.');
  }

  const isMatch = await bcrypt.compare(signInDto.password, user.password);
  if (!isMatch) {
    throw new NotFoundException('The email or password is incorrect.');
  }

  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  const token = await this.jwtservice.signAsync(payload, {
    secret: process.env.jwt_secret,
  });

  // optionally omit password from response
  const { password, ...userWithoutPassword } = user.toObject();

  return {
    status: 200,
    message: 'Logged in successfully',
    data: userWithoutPassword,
    access_token: token,
  };
}

      async resetPassword(email:ResetPasswordDto){
        const user = await this.userModel.findOne({email:email.email})
        if(!user){
            throw new HttpException("the user does not exist",400)
        }
        const code = Math.floor(Math.random()*1000000).toString().padStart(6,"0");
        await this.userModel.findOneAndUpdate(
        { email: email.email },
        { verificationCode: code }
);

    const htmlMessage = 
    `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .code {
            background-color: #f8f9fa;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #e74c3c;
            margin: 20px 0;
            border-radius: 5px;
            letter-spacing: 2px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #7f8c8d;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .warning {
            background-color: #fff3cd;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="header">Password Reset Request</h1>
        
        <div class="warning">
            <p>If you didn't request a password reset, please ignore this email.</p>
        </div>
        
        <p>To reset your password, please use the following verification code:</p>
        
        <div class="code">${code}</div>
        
        <p>This code will expire in 15 minutes. For security reasons, please do not share this code with anyone.</p>
        
        <div class="footer">
            <p>E-Commerce Backend Team</p>
            <p>NestJS Authentication System</p>
        </div>
    </div>
</body>
</html>
    `;

    this.mailService.sendMail({
      from: `E-Commerce_Backend Nestjs Team <${process.env.EMAIL_USERNAME}>`,
      to: email.email,
      subject: `How to Send Emails with Nodemailer`,
      text: htmlMessage,
    });
    return {
        status:200,
        message:`code sent sucessfully on you email(${email.email})`
    }
  }
async verifyCode(verifyCodeDto: VerifyCodeDto) {
  const { email, code } = verifyCodeDto;

  const user = await this.userModel
    .findOne({ email })
    .select("verificationCode");

  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (user.verificationCode !== code) {
    throw new UnauthorizedException("Invalid code");
  }

  await this.userModel.updateOne(
    { email, verificationCode: code },
    { $set: { verificationCode: null } }
  );

  return {
    status: 200,
    message: "Code verified successfully",
  };
}


        async changePassword(changePassworddto){
            const user = await this.userModel.findOne({email:changePassworddto.email})
            if(!user){
                throw new NotFoundException("the user not found")
            }
            const password = await bcrypt.hash(changePassworddto.password,saltOrRounds);
            await this.userModel.findOneAndUpdate({email:changePassworddto.email},{password});
            return {
                status:200,
                message:"the password reseted succsesfully "
            }
        }
    }

