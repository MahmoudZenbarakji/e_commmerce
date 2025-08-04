import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RequestProduct } from './entities/request-product.entity';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name) private requestProdctModel: Model<RequestProduct>
  ){}

private async checkOwnershipOrAdmin(productId: string, user: any): Promise<RequestProduct> {
  const product = await this.requestProdctModel.findById(productId);
  if (!product) {
    throw new HttpException("Product not found", 404);
  }

  const populatedProduct = await product.populate("user") as RequestProduct & { user?: { _id: any } };

  if (!populatedProduct.user || !populatedProduct.user._id) {
    throw new UnauthorizedException("Owner not found for this product");
  }

  const isOwner = populatedProduct.user._id.toString() === user.id;
  const isAdmin = user.role?.toLowerCase() === "admin";

  if (!isOwner && !isAdmin) {
    throw new UnauthorizedException("You are not authorized to access this product");
  }

  return populatedProduct;
}




  async create(createRequestProductDto: CreateRequestProductDto) {
    const requestProduct = await this.requestProdctModel.findOne({titleNeed:createRequestProductDto.titleNeed,user:createRequestProductDto.user})
    if(requestProduct){
      throw new HttpException("the product already exist",400)
    }
    const newRequestProduct = await (await this.requestProdctModel.create(createRequestProductDto)).populate('user',"-password -role -_v")
    return {
      status:200,
      message:"created succsesfullly",
      data:newRequestProduct
    };
  }

  async findAll() {
    const requestProduct = await this.requestProdctModel.find().populate("user")

    return {status:200,message:"all the gets",data:requestProduct};
  }

async findOne(id: string, req: any) {
  const _idReqUser = req.user.id;

  const product = await this.requestProdctModel.findById(id);
  if (!product) {
    throw new HttpException("Product not found", 404);
  }

  const requestProduct = await product.populate("user") as RequestProduct & { user?: { _id: string } };

  if (!requestProduct.user || !requestProduct.user._id) {
    throw new UnauthorizedException("Owner not found for this product");
  }

  const isOwner = _idReqUser === requestProduct.user._id.toString();
  const isAdmin = req.user.role?.toLowerCase() === "admin";

  if (!isOwner && !isAdmin) {
    throw new UnauthorizedException("You are not authorized to access this product");
  }

  return {
    status: 200,
    message: "Here is your request product",
    data: requestProduct,
  };
}


async update(id: string, updateRequestProductDto: UpdateRequestProductDto, req: any) {
  // This will throw if not owner or not admin
  await this.checkOwnershipOrAdmin(id, req.user);

  const updatedRequestProduct = await this.requestProdctModel.findByIdAndUpdate(
    id,
    updateRequestProductDto,
    { new: true }
  ).populate("user", "-password -role -__v");

  return {
    status: 200,
    message: "Updated successfully",
    data: updatedRequestProduct,
  };
}




async remove(id: string, req: any) {
  await this.checkOwnershipOrAdmin(id, req.user);

  await this.requestProdctModel.findByIdAndDelete(id);

  return {
    status: 200,
    message: "Deleted successfully",
  };
}



}
