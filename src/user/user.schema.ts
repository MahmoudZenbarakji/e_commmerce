
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { timeStamp } from 'node:console';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps:true})
export class User {
  @Prop({
    type:String,
    required:true,
    min:[5 , "name must be at least 5 characters"],
    max:[20 , "name must be at most 20 characters"]
  })
  name: string;
    @Prop({
    type:String,
    required:true,
    unique:true,
    min:[5 , "name must be at least 5 characters"],
    max:[20 , "name must be at most 20 characters"]
  })
  email: string;
    @Prop({
    type:String,
    required:true,
    min:[5 , "name must be at least 5 characters"],
    max:[20 , "name must be at most 20 characters"],
  })
  password:string;

     @Prop({
     type:String,
     required:true,
     enum:['user','admin'],

   })
  role:string;

  @Prop({
    type:String
})
  avatar:string;

  @Prop({
    type:Number
})
  age:Number

  @Prop({
    type:Number
})
   PhoneNumber:Number;
 @Prop({
    type:String
})
  address:string;

  @Prop({
    type:Boolean,
    enum:[true,false]

})
active:boolean;
@Prop({
    type:String
})
verificationCode:string;

@Prop({
    type:String,
    enum:["male","female"]
})
Gender:string
}

export const UserSchema = SchemaFactory.createForClass(User);
