import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier, SupplierDocument } from './supplier.schema';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';

@Injectable()
export class SupplierService {

  constructor(
  @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,  ){}
  async create(createSupplierDto: CreateSupplierDto) {
    const supplier = await this.supplierModel.findOne({name:createSupplierDto.name})
    if(supplier){
      throw new NotFoundException("the suplier already exist")
    }
    const addSupplier = await this.supplierModel.create(createSupplierDto)
    return {
      status:200,
      message:"the supplier created succsesfully",
      data:addSupplier
    };
  }

  async findAll() {
    const supplier = await this.supplierModel.find()
    return supplier;
  }

async findOne(id: string) {
  console.log('Received ID:', id);
  const supplier = await this.supplierModel.findById(id);
  console.log('Found Supplier:', supplier);

  if (!supplier) {
    throw new NotFoundException('notefound');
  }
  return supplier;
}


  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const suplier = await this.supplierModel.findById(id)
    if(!suplier){
      throw new NotFoundException("not found")
    }
    const updatedsupplier = await this.supplierModel.findByIdAndUpdate(id,updateSupplierDto)
        return {
      status:200,
      message:"the supplier created succsesfully",
      data:updatedsupplier
    };
  }

  async remove(id: string) {
    const supplier = await this.supplierModel.findById(id)
    if(!supplier){
      throw new NotFoundException("not found")
    }
        const delsupplier = await this.supplierModel.findByIdAndDelete(id)

    return {
      status:200,
      message:"the item deleted"
    };
  }
}
