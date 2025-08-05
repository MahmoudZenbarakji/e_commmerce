import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OrderModule } from './order.module';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Tax } from 'src/tax/tax.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class OrderService {
  constructor(
        @InjectModel(Order.name) private readonly orderModel:Model <Order>, 
        @InjectModel(Cart.name) private readonly cartModel:Model <Cart>, 
        @InjectModel(Tax.name) private readonly taxModel:Model <Tax>,
        @InjectModel(User.name) private readonly userModel:Model<User>  
  ){}
  async create(user_id:string,paymentMethodType:"card"|"cash",createOrderDto ) {
    const cart = await this.cartModel.findOne({user:user_id}).populate("cartItem.productId user")
    if(!cart){
      throw new NotFoundException("cart not found" )
    }
    const tax = await this.taxModel.findOne()
    const user = await this.userModel.findOne()
    const shipppingAddress =  user?.address? user.address:createOrderDto.shipppingAddress ||false

    if(!shipppingAddress){
      throw new NotFoundException("shipping address not found")
    }

    let data = {
      user_id,
      cartItem:cart.cartItems,
      taxPrice:tax.taxPrice,
      shippingPrice:tax.shippingPrice,
      totalOrderPrice:  cart.totalPrice +  tax.taxPrice +  tax.shippingPrice,
      paymentMethodType,
      shipppingAddress
    }
    if(paymentMethodType==="cash"){
      const order =await this.orderModel.create({
        ...data,
        isPaid:false,
        isDeliverd:false
      });
      return{
        status:200,
        message:"the order created succsefully",
        data:order
      }
    }
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
