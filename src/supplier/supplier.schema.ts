import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { url } from 'inspector';
import { HydratedDocument, Types } from 'mongoose';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({
    required: true,
    type: String,
    minlength: [4, 'name must be at least 10'],
    maxlength: [20, 'name must be at most 20'],
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  website: string;

}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
