import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { timeStamp } from 'node:console';

export type CategoryDocument = HydratedDocument<Category>;
@Schema({timestamps:true})
export class Category{
@Prop({
    required:true,
    type:String,
    min:[10,"name must ve at least 10"],
    max:[20,"name must ve at most 10"]
})
name:string
@Prop({
required:true,
type:String,
})
image:string
}
export const CategorySchema = SchemaFactory.createForClass(Category);