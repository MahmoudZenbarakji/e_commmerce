import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Category } from 'src/category/category.schema'; // Ensure this import exists
import { User } from 'src/user/user.schema';

export type TaxDocument = HydratedDocument<Tax>;

@Schema({ timestamps: true })
export class Tax {
@Prop({
type:Number,
default:0
})
taxPrice:number
@Prop({
    type:Number,
    default:0
})
shippingPrice:number
}


export const TaxSchema = SchemaFactory.createForClass(Tax);
