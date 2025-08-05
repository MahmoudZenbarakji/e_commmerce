import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './user/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { SubcategryModule } from './subcategry/subcategry.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { SupplierModule } from './supplier/supplier.module';
import { RequestProductModule } from './request-product/request-product.module';
import { TaxModule } from './tax/tax.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { config } from 'process';
import { OrderModule } from './order/order.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mahmmoudzenbarakji:01mahmoud01@ecommerceclus.ilmzjxj.mongodb.net/commerce?retryWrites=true&w=majority&appName=ecommerceclus',
),
      ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
      UserModule,
          JwtModule.register({
          global: true,
          secret: process.env.jwt_secret,
          signOptions: { expiresIn: '2d' },
    }),
      
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    AuthModule,
    CategoryModule,
    SubcategryModule,
    BrandModule,
    CouponModule,
    SupplierModule,
    RequestProductModule,
    TaxModule,
    ProductModule,
    CartModule,
    OrderModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}








