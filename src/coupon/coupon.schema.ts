import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { timeStamp } from 'node:console';

export type CouponDocument = HydratedDocument<Coupon>;
@Schema({timestamps:true})
export class Coupon{
@Prop({
    required:true,
    type:String,
    min:[10,"name must ve at least 10"],
    max:[20,"name must ve at most 10"]
})
name:string
@Prop({
required:true,
type:Date,
min: new Date("2025-01-01"),
})
expireDate:Date

@Prop({
    required:true,

    
})
Discount:Number
}
export const CouponSchema = SchemaFactory.createForClass(Coupon);