import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order, OrderSchema } from './order.schema';
import { Cart, CartSchema } from 'src/cart/cart.schema';
import { Tax, TaxSchema } from 'src/tax/tax.schema';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Order.name,schema:OrderSchema},{name:Cart.name,schema:CartSchema},{name:Tax.name,schema:TaxSchema},{name:User.name,schema:UserSchema}])
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
