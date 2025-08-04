import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import { request } from 'express';
import * as bcrypt from 'bcrypt';
import { stat } from 'fs';
import { NotFoundError } from 'rxjs';

const saltOrRounds = 10;
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtservice:JwtService){}

async create(createUserDto: CreateUserDto) {
  const userExist = await this.userModel.findOne({
    email: createUserDto.email
  });

  if (userExist) {
    throw new HttpException("User already exists", 400);
  }

  const password = await bcrypt.hash(createUserDto.password, saltOrRounds);

  const user = {
    ...createUserDto,
    password,
    role: createUserDto.role ?? "user",
    active: true
  };

  const createdUser = new this.userModel(user);
  await createdUser.save(); // 🔥 Saves the user in MongoDB

  return {
    status: 201,
    message: "User created successfully",
    data: createdUser
  };
}

 

  async findAll(query) {
    const {skip=0,limit=10000,sort="asc",name,email,role} = query
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
      data:  await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .where('name',new RegExp(name,'i'))
      .where('email',new RegExp(email,'i'))
      .where('role',new RegExp(role,'i'))
      .sort(sort)
      .exec()
    }
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select("-password -_v")
    if(!user){
      throw new HttpException("user not found",400)
    }
    return user
  }

 async update(id: string, updateUserDto: UpdateUserDto) {
    const userExist  = await  this.userModel.findById(id).select("-password -_v")
    if(!userExist){
      throw new HttpException("the user does not exist",400)
    }
    let user ={
      ...updateUserDto
    }
    if(updateUserDto.password){
        const password = await bcrypt.hash(updateUserDto.password,saltOrRounds);
        user ={
          ...user,
          password
        }
    }
    return{
      status:200,
      message:'user has been updated',
      data: await  this.userModel.findByIdAndUpdate(id,user,{
        new:true
      })
    } ;
  }

  async remove(id: string):Promise<{status:number,message:string}> {
    const user  =  await this.userModel.findById(id).select("-password -_v")
      if(!user){
      throw new HttpException("the user does not exist",400)
    }
    await  this.userModel.findByIdAndDelete(id)
    return {
      status:200,
      message:"the user has been deleted"
    }
  }

  async getMe(payload){
    if(!payload._id){
      throw new HttpException('user not found',400)
    }
    const user = await this.userModel
    .findById(payload._id).select('-password -_v')
    if(!user){
      throw new NotFoundException("the user not  found")
    }
    return {
      status:200,
      message: "user found",
      data:user
    }
  }
  async updateMe(payload, updateUserDto: UpdateUserDto){
    if(!payload._id){
      throw new HttpException('user not found',400)
    }
    const user = await this.userModel
    .findById(payload._id)
    .select('-password -_v')
    if(!user){
      throw new HttpException('user not found',400)
    }
    return{
      status:200,
      message:'user updated sucessfully',
      data: await this.userModel.findByIdAndUpdate(payload._id,updateUserDto,{
        new:true
      })
    }

  }
  async deleteMe(payload){
    if(!payload._id){
      throw new HttpException("user does not exist",400)
    }
    const user  = await this.userModel.findById(payload._id).select('-password -_v')
    if(!user){
      throw new HttpException('user not found',400)
    }
    return {
      status:200,
      messaage:'the user deleted succsessfullly',
      data: await this.userModel.findByIdAndUpdate(payload._id,{active:false},{new:true})
    }
  }
}
