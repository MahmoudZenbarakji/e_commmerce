import { HttpException, Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tax } from './tax.schema';
import { stat } from 'fs';

@Injectable()
export class TaxService {
  constructor(
    @InjectModel(Tax.name) private TaxModel:Model<Tax>
  ){}
 async createAndUpdate(createTaxDto: CreateTaxDto) {
    const tax = await this.TaxModel.findOne({})
    if(tax){
      throw new HttpException("already exist",400)
    }
    const addTax = await this.TaxModel.create(createTaxDto)
    return {
      status:200,
      message:"created taax",
      data:addTax,
    };
    const updateTax = await this.TaxModel.findOneAndUpdate({},createTaxDto,{new:true})
    return{
      status:200,
      message:"upfated",
      data:updateTax
    }
  }

  async find() {
    const tax = await this.TaxModel.findOne({})
    
    return {
      status:200,
      message:"found",
      data:tax
    };
  }
  async reSet():Promise<void>{
      await this.TaxModel.findOneAndUpdate({},{taxPrice:0,shippingPrice:0});
  }

  findOne(id: number) {
    return `This action returns a #${id} tax`;
  }

  update(id: number, updateTaxDto: UpdateTaxDto) {
    return `This action updates a #${id} tax`;
  }

  remove(id: number) {
    return `This action removes a #${id} tax`;
  }
}
