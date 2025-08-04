import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.schema';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
          private brandModel:Model<Brand>, 
  ){}
  async create(createBrandDto: CreateBrandDto) {
    const brand = await this.brandModel.findOne({name:createBrandDto.name})
    if(brand){
      throw new NotFoundException("Brand not found")
    }
    const newBrand = await this.brandModel.create(createBrandDto)
    return {
      status:200,
      message:"the brand added",
      data:newBrand
    };
  }

  async findAll() {
    const brand = await this.brandModel.find().select("-_v")
    return {
      status:200,
      message:"all the brands",
      data:brand
    };
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id)
    if(!brand)
      {
        throw new NotFoundException("the brand not found")
      }
    return {
      status:200,
      message: "all the brands",
      data:brand
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandModel.findById(id)
    if(!brand){
      throw new NotFoundException("the brand not found")
    }
    const updatedBrand = await this.brandModel.findByIdAndUpdate(id,updateBrandDto)
    return {  
      status:200,
      message:"the brand updated succesfully",
      data:updatedBrand
    };
  }

  async remove(id: string) {
    const brand = await this.brandModel.findById(id)
    if(!brand){
      throw new NotFoundException("brand not found ")
    }
    const delbrand = await this.brandModel.findByIdAndDelete(id)
    return {
      status:200,
      message:"the brand deleted"
    };
  }
}
