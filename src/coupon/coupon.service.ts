import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CouponModule } from './coupon.module';
import { Model } from 'mongoose';
import { Coupon } from './coupon.schema';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private couponModel:Model<Coupon>
  ){}
async create(createCouponDto: CreateCouponDto) {
  try {
    const coupon = await this.couponModel.findOne({ name: createCouponDto.name });

    if (coupon) {
      throw new BadRequestException("Coupon with this name already exists");
    }

    const newCoupon = await this.couponModel.create(createCouponDto);

    return {
      status: 200,
      message: "The coupon was created successfully",
      data: newCoupon,
    };

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      throw new BadRequestException(messages);
    }

    throw error;
  }
}


  async findAll() {
    const coupn  =  await this.couponModel.find()
    if(!coupn){
      throw new NotFoundException("coupon not exist")
    }
  
    return {
      status:200,
      message:"all coupon",
      data:coupn
    };
  }

  async findOne(id: string) {
    const coupon = await this.couponModel.findById(id)
    if(!coupon){
      throw new NotFoundException("the coupon not found")
    }

    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    try{
          const coupon = await this.couponModel.findById(id)
    if(!coupon){
      throw new NotFoundException("the brand not found")
    }
    const updateCoupon = await this.couponModel.findByIdAndUpdate(id,updateCouponDto)
    return {
      status:200,
      message:"the coupon updated succsesfully",
      data:updateCoupon
    };
    }catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      throw new BadRequestException(messages);
    }

    throw error;
  }

  }

  async remove(id: string) {
    const coupon = await this.couponModel.findById(id)
        if(!coupon){
      throw new NotFoundException("the brand not found")
    }
    const delcoupon = await this.couponModel.findByIdAndDelete(id)
    return {
      status:200,
      message:"the coupon deleted sucses",
      data:delcoupon
    };
  }
}
