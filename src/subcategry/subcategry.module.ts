import { Module } from '@nestjs/common';
import { SubcategryService } from './subcategry.service';
import { SubcategryController } from './subcategry.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcategory, SubcategorySchema } from './subcategory.schema';
import { CategoryModule } from 'src/category/category.module';
import { Category, CategorySchema } from 'src/category/category.schema';

@Module({
imports: [
  MongooseModule.forFeature([
    { name: Subcategory.name, schema: SubcategorySchema },
    { name: Category.name, schema: CategorySchema }, // ADD THIS
  ]),
],
  controllers: [SubcategryController],
  providers: [SubcategryService],
})
export class SubcategryModule {}
