import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, NumberSchemaDefinition, Types } from "mongoose";
import { Cart } from "src/cart/cart.schema";
import { Product } from "src/product/product.schema";
import { Tax } from "src/tax/tax.schema";
import { User } from "src/user/user.schema";
export type OrderDocument = HydratedDocument<Order>;
@Schema({timestamps:true})
export class Order{
@Prop({
required:true,
type:Types.ObjectId,ref:User.name
})
user:User

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: Product.name, required: true },
      quantity: { type: Number, required: true },
      color: { type: String, default: '' },
      priceAtAddition: { type: Number, required: true }
    }
  ])
cartItem:{
    productId: Types.ObjectId;
    quantity: number;
    color: string;
    priceAtAddition: number;
    priceAfterDiscount:number
}
@Prop({
    required:true,
    type:Types.ObjectId,ref:Tax.name
})
taxPrice:number
@Prop({
    required:true,
    type:Number
})
shippingPrice:number
@Prop({
    required:true,
    type:Number
})
totalOrderPrice:number
@Prop({
    type:String,
    enum:["cash","card"]
})
paymentMethod:
    string

@Prop({
    type:Boolean,
    required:true,
    default:false
})
isPaid:Boolean

@Prop({
    required:true,
    type:Date,
})
paidAt:Date
@Prop({
    required:true,
    type:Boolean,
    default:false
})
isDeliverd:boolean

@Prop({
    required:true,
    type:Date
})
deliverdAt:Date
@Prop({
    required:true,
    type:{  
    alias:String,
    details:String,
    phone:Number,
    city:String,
    Postalcode:Number
}
})
shipppingAddress:{  
    alias:string
    details:string,
    phone:number,
    city:string,
    Postalcode:number
}
}
export const OrderSchema = SchemaFactory.createForClass(Order);