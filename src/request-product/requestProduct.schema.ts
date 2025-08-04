import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Category } from 'src/category/category.schema'; // Ensure this import exists
import { User } from 'src/user/user.schema';

export type RequestproductDocument = HydratedDocument<RequestProduct>;

@Schema({ timestamps: true })
export class RequestProduct {
  @Prop({
    required: true,
    type: String,
  })
  titleNeed: string;

  @Prop({
    required: true,
    type: String,
    min:[5,"Details must be not less than 5"]
  })
  details: string;

  @Prop({
    type: Number,
    min:[1,"not less than 1"],
    required:true
  })
  quantity: Number;

    @Prop({
    type:String,
})
category:string

@Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref:User.name
})
user:string
}


export const RequestproductSchema = SchemaFactory.createForClass(RequestProduct);
