import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Mongoose, Types } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema'; // Ensure this import exists
import { Subcategory } from 'src/subcategry/subcategory.schema';
import { User } from 'src/user/user.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
@Prop({
type:String,
required:true,
min:[3,""],
})
title:String
@Prop({
    type:String,
    required:true,
    min:[20,""]
})
description:string
@Prop({
    type:Number,
    required:true,
    default:1,
    min:[1,""]
})
quantity:number
@Prop({
    type:String,
    required:true,
    min:[1,""]
})
imageCover:string
@Prop({
    type:Array,
    required:true,
    min:[1,""]
})
images:string[] 
@Prop({
    type:Number,
    min:[1,""]
})
sold:number

@Prop({
    type:Number,
    required:true,
    min:[1,""],
    max:[,""]
})
price:number
@Prop({
    type:Number,
    min:[1,""],
    max:[,""]
})
priceAfterdiscount:number
@Prop({
    type:[String],

})
colors:string[]
@Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref:Category.name,
    required:true,
    min:[1,""],
    max:[,""]
})
category:string
@Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref:Subcategory.name,
    required:true,
    min:[1,""],
    max:[,""]
})
subcategory:string
@Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref:Brand.name,
    required:true,
    min:[1,""],
    max:[,""]
})
brand:string
@Prop({
    type:Number,
    default:0,
    required:true,
    min:[1,""],
    max:[,""]
})
ratingAverage:number
@Prop({
    type:Number,
    min:[1,""],
    max:[,""]
})
ratingQuanity:number
}


export const ProductSchema = SchemaFactory.createForClass(Product);
