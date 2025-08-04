import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubcategryDto } from './dto/create-subcategry.dto';
import { UpdateSubcategryDto } from './dto/update-subcategry.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategory } from './subcategory.schema';
import { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';

@Injectable()
export class SubcategryService {
  constructor(
    //here is the problem
    @InjectModel(Subcategory.name) private subcategoryModel: Model<Subcategory>,
    @InjectModel(Category.name) private categoryModel:Model<Category>,

  ) {}

  async create(createSubcategryDto: CreateSubcategryDto) {
  const subcategory = await this.subcategoryModel.findOne({ name: createSubcategryDto.name });
  if (subcategory) {
    throw new HttpException("The subcategory already exists", 400);
  }

  const category = await this.categoryModel.findById(createSubcategryDto.category);
  if (!category) {
    throw new NotFoundException("Category not found");
  }

  // ✅ Correct object passed to create()
  const newSubcategory = await this.subcategoryModel.create(createSubcategryDto);

  const populated = await this.subcategoryModel
    .findById(newSubcategory._id)
    .populate("category");

  return {
    status: 200,
    message: "The subcategory has been created successfully",
    data: populated,
  };
}


  // async create(createSubcategryDto: CreateSubcategryDto) {
  //   const subcategory = await this.subcategoryModel.findOne({ name: createSubcategryDto.name });
  //   if (subcategory) {
  //     throw new HttpException("The subcategory already exists", 400);
  //   }
  //     const category = await this.categoryModel.findById(createSubcategryDto.category)

  //   const newSubcategory = await this.subcategoryModel.create(createSubcategryDto.category);
  //   if(!category){
  //     throw new NotFoundException("caategory  nnot found")
  //   }
  //   // Populate category after creation
  //   const populated = await this.subcategoryModel.findById(newSubcategory._id).populate("category");

  //   return {
  //     status: 200,
  //     message: "The subcategory has been created successfully",
  //     data: populated,
  //   };
  // }

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
      data:  await this.subcategoryModel
      .find()
      .skip(skip)
      .limit(limit)
      .where('name',new RegExp(name,'i'))
      .populate("category")
      .sort(sort)
      .exec()
    }
  }

async findOne(id: string) {
  console.log("Looking for subcategory ID:", id);
  const subcategory = await this.subcategoryModel.findOne({ _id: id }).populate("category");

  if (!subcategory) {
    console.log("Subcategory not found in DB.");
    throw new NotFoundException("Subcategory not found");
  }

  return {
    status: 200,
    message: "Subcategory fetched successfully",
    data: subcategory,
  };
}


  async update(id: string, updateSubcategryDto: UpdateSubcategryDto) {
    const subcategory = await this.subcategoryModel.findById(id);
    if (!subcategory) {
      throw new NotFoundException("The subcategory was not found");
    }

    await this.subcategoryModel.findByIdAndUpdate(id, updateSubcategryDto);

    // Return the updated and populated subcategory
    const updatedSubcategory = await this.subcategoryModel.findById(id).populate("category");

    return {
      status: 200,
      message: "The subcategory has been updated successfully",
      data: updatedSubcategory,
    };
  }

  async remove(_id: string) {
    const subcategory = await this.subcategoryModel.findById(_id).populate("category");

    if (!subcategory) {
      throw new HttpException("The subcategory does not exist", 400);
    }

    await this.subcategoryModel.findByIdAndDelete(_id);

    return {
      status: 200,
      message: "The subcategory has been deleted successfully",
      data: subcategory, // return the deleted (populated) one for confirmation
    };
  }
}
