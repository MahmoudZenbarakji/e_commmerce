import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Mongoose, Types } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema'; // Ensure this import exists
import { Coupon } from 'src/coupon/entities/coupon.entity';
import { Product } from 'src/product/product.schema';
import { Subcategory } from 'src/subcategry/subcategory.schema';
import { User } from 'src/user/user.schema';

 export type CartDocument = HydratedDocument<Cart>;

// @Schema({ timestamps: true })
// export class Cart {
//   @Prop([{
//     productId: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: Product.name,
//       required: true 
//     },
//     quantity: { 
//       type: Number, 
//       default: 1,
//       min: 1
//     },
//     color: { 
//       type: String, 
//       default: '' 
//     },
//     // Add price snapshot to avoid price changes affecting cart
//     priceAtAddition: {
//       type: Number,
//       required: true
//     }
//   }])
//   cartItems: {
//     productId: mongoose.Types.ObjectId;
//     quantity: number;
//     color: string;
//     priceAtAddition: number;
//   }[];
// @Prop({
//     type:Number,
//     required:true,
// })
// totalPrice:number
// @Prop({
//     type:String,
//     required:true,
// })
// totalPriceAfterDiscount:number

// @Prop({
//     type:mongoose.Schema.Types.ObjectId,
//     ref:User.name
// })
// user:string
// @Prop({
//     type:[
//         {
//             name:{
//                 type:String
//             },
//            couponId :{
//                 type:mongoose.Schema.Types.ObjectId,
//                 ref:Coupon.name
//             }
//         }
//     ]
// })
// coupons:[{
//     name:string,
//     couponId:string,
//     discount:number,
// }]

// }


@Schema({ timestamps: true })
export class Cart {
  @Prop([{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: Product.name,
      required: true 
    },
    quantity: { 
      type: Number, 
      default: 1,
      min: 1
    },
    color: { 
      type: String, 
      default: '' 
    },
    priceAtAddition: {
      type: Number,
      required: true
    }
  }])
  cartItems: Array<{
    productId: Types.ObjectId;
    quantity: number;
    color: string;
    priceAtAddition: number;
  }>;

  @Prop({ type: Number, required: true, default: 0 })
  totalPrice: number;

  @Prop({ type: Number, required: true, default: 0 })
  totalPriceAfterDiscount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;  // Changed to ObjectId type

  @Prop([{
    name: { type: String },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: Coupon.name },
    discount: { type: Number }  // Added discount field
  }])
  coupons: Array<{
    name: string;
    couponId: Types.ObjectId;
    discount: number;
  }>;
}
 export const CartSchema = SchemaFactory.createForClass(Cart);
