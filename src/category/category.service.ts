import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './category.schema';
import { Model } from 'mongoose';
import { stat } from 'fs';

@Injectable()
export class CategoryService {
  constructor(
      @InjectModel(Category.name)
      private categoryModel:Model<Category>,
  ){ }
async create(createCategoryDto: CreateCategoryDto) {

  const existingCategory = await this.categoryModel.findOne({ name: createCategoryDto.name });

  if (existingCategory) {
    throw new HttpException("Category already exists", 400);
  }

  const newCategory = await this.categoryModel.create(createCategoryDto);

  return {
    status: 201,
    message: "Category created successfully",
    data: newCategory,
  };
}
  async findAll(query) {
    const {skip=0,limit=10000,sort="asc",name} = query
    if(Number.isNaN(Number(+limit)) ){
      throw new HttpException("the invalid limit",400)
    }
        if(Number.isNaN(Number(+skip)) ){
      throw new HttpException("the invalid limit",400)
    }
    if(!["asc","desc"].includes(sort)){
      throw new HttpException("invalid sort",400)
    }
    return {
      status:200,
      message:"the data has been got succsessfully ",
      data:  await this.categoryModel
      .find()
      .skip(skip)
      .limit(limit)
      .where('name',new RegExp(name,'i'))

      .sort(sort)
      .exec()
    }
  }
/*async findAll(query) {
  const {
    skip = 0,
    limit = 10,
    sort = "asc",
    sortBy = "createdAt",
    name = ""
  } = query;

  // Convert values
  const parsedSkip = Number(skip);
  const parsedLimit = Number(limit);
  const parsedSort = (sort === "asc" || sort === "1" || sort === 1) ? 1 : -1;

  // Validation
  if (isNaN(parsedLimit) || isNaN(parsedSkip)) {
    throw new HttpException("Invalid pagination values", 400);
  }

  const filter: any = {};
  if (name) {
    filter.name = new RegExp(name, 'i'); // Case-insensitive search
  }

  const [data, total] = await Promise.all([
    this.categoryModel
      .find(filter)
      .skip(parsedSkip)
      .limit(parsedLimit)
      .sort({ [sortBy]: parsedSort })
      .exec(),
    this.categoryModel.countDocuments(filter)
  ]);

  return {
    status: 200,
    message: "Data retrieved successfully",
    data,
    meta: {
      total,
      skip: parsedSkip,
      limit: parsedLimit,
      page: Math.floor(parsedSkip / parsedLimit) + 1,
      pages: Math.ceil(total / parsedLimit),
    }
  };
}*/


  /*async findAll(query) {
    const {skip=0,limit=1000,sort="asc",name} = query

        if(Number.isNaN(Number(+limit)) ){
      throw new HttpException("the invalid limit",400)
    }
        if(Number.isNaN(Number(+skip)) ){
      throw new HttpException("the invalid limit",400)
    }
    if(!["asc","desc"].includes(sort)){
      throw new HttpException("invalid sort",400)
    }
        return {
      status:200,
      message:"the data has been got succsessfully ",
      data:  await this.categoryModel
      .find()
      .skip(skip)
      .limit(limit)
      .where('name',new RegExp(name,'i'))
      .sort(sort)
      .exec()
    }
  }*/

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id)
    if(!category){
      throw new HttpException("category not found",400)
    }
    return category;
  }

async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
  const category = await this.categoryModel.findById(_id);
  if (!category) {
    throw new NotFoundException("The category was not found");
  }

  const updatedCategory = await this.categoryModel.findByIdAndUpdate(
    _id,
    updateCategoryDto,
    { new: true }
  );

  return {
    status: 200,
    message: "The category has been updated",
    data: updatedCategory,
  };
}


  async remove(_id: string) {
    const category = await this.categoryModel.findById({_id})
    if(!category){
      throw new HttpException("the category is not exist",400)
    }
   await this.categoryModel.findByIdAndDelete({_id})
    return {
      status:200,
      message:"the categroy has be  en deleted",
    };
  }
}
