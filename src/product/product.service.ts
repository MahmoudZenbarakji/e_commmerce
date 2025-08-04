import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { isEmpty, NotFoundError } from 'rxjs';
import { Brand } from 'src/brand/brand.schema';
import { title } from 'node:process';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly produtModel:Model <Product> 
  ){}
  async create(createProductDto: CreateProductDto) {
    const product = await this.produtModel.findOne({title:createProductDto.title})
    const category = await this.produtModel.findById(createProductDto.category)

    if(product){
      throw new HttpException("the product already exist",400)
    }
      if(category){
      throw new HttpException("the category already exist",400)
    }
        if(createProductDto.subcategory){
      const subcategory = await this.produtModel.findById(createProductDto.subcategory)

        if(subcategory){
        throw new NotFoundException("there is no subcategory")
      }
    }
    const addProduct  =  await this.produtModel.create(createProductDto)
    const populateproduct = await this.produtModel.findById(addProduct._id)
    .populate("category")
    .populate("subcategory")
    .populate("brand") // Also fix capitalization

    return {
      status:200,
      message:"created",
      data:populateproduct
    };
  }

async findAll(query) {
  // 1. Filter
  let requestQuery = { ...query };
  const removeQuery = ["page", "limit", "sort", "keyword", "category", "fields"];
  removeQuery.forEach(key => delete requestQuery[key]);

  // Parse and transform gte/lte operators
  requestQuery = JSON.parse(
    JSON.stringify(requestQuery).replace(/\b(gte|lte|lt|gt)\b/g, match => `$${match}`)
  );

  let findData: any = { ...requestQuery };

  // 2. Search (keyword)
  if (query.keyword) {
    findData.$or = [
      { title: { $regex: query.keyword, $options: "i" } },
      { description: { $regex: query.keyword, $options: "i" } }
    ];
  }

  // 3. Category filter
  if (query.category) {
    findData.category = query.category.toString();
  }

  // 4. Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;
  const skip = (page - 1) * limit;

  // 5. Sorting
  const sort = query.sort || "asc";

  // 6. Field selection
  const fields = query.fields?.split(",").join(" ") || "";

  const products = await this.produtModel
    .find(findData)
    .limit(limit)
    .skip(skip)
    .sort({ title: sort })
    .select(fields);

  return {
    status: 200,
    message: "Here is the products list",
    isEmpty: products.length === 0,
    length: products.length,
    data: products
  };
}


  async findOne(id: string) {
    const product = await this.produtModel.findById(id).populate("category")
    .populate("subcategory")
    .populate("brand")
    if(!product){
      throw new NotFoundException("the product not exist")
    }
    return {
      status:200,
      message:"founded",
      data:product
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this. produtModel.findById(id)
    if(!product){
      throw new NotFoundException("the product not found ")
    }
    if(updateProductDto.category){
      const category = await this.produtModel.findById(updateProductDto.category)
      if(!category){
        throw new NotFoundException("there is no category")
      }
    }
        if(updateProductDto.subcategory){
      const subcategory = await this.produtModel.findById(updateProductDto.subcategory)
      if(!subcategory){
        throw new NotFoundException("there is no subcategory")
      }
    }
    const updatedProduct  = await this.produtModel.findByIdAndUpdate(id,updateProductDto)
    return {
      status:200,
      message:"updated",
      data:updatedProduct
    };
  }

  async remove(id: string) {
    const product = await this.produtModel.findById(id)
    if(!product){
      throw new NotFoundException("not found product")
    }
    const delproduct = await this.produtModel.findByIdAndDelete(id)
    return {
      status:200,
      message:"the  product deleted succsesfully",
      data:delproduct
    };
  }
}
