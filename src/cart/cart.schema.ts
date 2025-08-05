import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';
import { Coupon } from 'src/coupon/entities/coupon.entity';

export type CartDocument = HydratedDocument<Cart>;
@Schema({ timestamps: true })
export class Cart {
  @Prop([
    {
      productId: { type: Types.ObjectId, ref: Product.name, required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 },
      color: { type: String, default: '' },
      priceAtAddition: { type: Number, required: true }
    }
  ])
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

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop([
    {
      name: { type: String },
      couponId: { type: Types.ObjectId, ref: Coupon.name },
      discount: { type: Number }
    }
  ])
  coupons: Array<{
    name: string;
    couponId: Types.ObjectId;
    discount: number;
  }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);