// Fixed and Improved Cart Service, Schema, and DTO

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { Product } from 'src/product/product.schema';
import { Coupon } from 'src/coupon/coupon.schema';
import { User } from 'src/user/user.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async findOrCreateCart(userId: string): Promise<CartDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    let cart = await this.cartModel.findOne({ user: userId })
      .populate('cartItems.productId')
      .exec();

    if (cart) return cart;

    cart = new this.cartModel({
      user: new Types.ObjectId(userId),
      cartItems: [],
      totalPrice: 0,
      totalPriceAfterDiscount: 0,
      coupons: []
    });

    return await cart.save();
  }

  async addItem(userId: string, productId: string, quantity: number, color = '') {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid IDs');
    }

    const parsedQuantity = Math.floor(Number(quantity));
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const [cart, product] = await Promise.all([
      this.findOrCreateCart(userId),
      this.productModel.findById(productId).exec()
    ]);

    if (!product) throw new NotFoundException('Product not found');
    if (product.quantity < parsedQuantity) {
      throw new ConflictException('Insufficient stock');
    }

    const priceAtAddition = Number(product.priceAfterdiscount || product.price);
    if (isNaN(priceAtAddition)) {
      throw new BadRequestException('Invalid product price');
    }

    const existingItem = cart.cartItems.find(
      item => item.productId.equals(productId) && item.color === color
    );

    if (existingItem) {
      existingItem.quantity += parsedQuantity;
    } else {
      cart.cartItems.push({
        productId: new Types.ObjectId(productId),
        quantity: parsedQuantity,
        color,
        priceAtAddition
      });
    }

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.quantity * item.priceAtAddition,
      0
    );

    if (cart.coupons.length > 0) {
      const coupon = cart.coupons[0];
      cart.totalPriceAfterDiscount = Number(
        (cart.totalPrice * (1 - coupon.discount / 100)).toFixed(2)
      );
    } else {
      cart.totalPriceAfterDiscount = cart.totalPrice;
    }

    const updatedCart = await cart.save();
    return {
      status: 200,
      message: existingItem ? 'Item quantity updated' : 'New item added to cart',
      data: updatedCart
    };
  }

  async findAll() {
    return this.cartModel.find().populate('user', 'category');
  }

  async findOne(id: string) {
    return this.cartModel.findById(id);
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.cartModel.findById(id);
    if (!cart) throw new NotFoundException('Cart not found');

    const updateCart = await this.cartModel.findByIdAndUpdate(id, updateCartDto, { new: true });
    return {
      status: 200,
      message: 'Updated successfully',
      data: updateCart
    };
  }

  async remove(id: string) {
    await this.cartModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Cart removed successfully'
    };
  }

  async applyCoupon(userId: string, code: string): Promise<any> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const coupon = await this.couponModel.findOne({ code });
    if (!coupon) throw new NotFoundException('Coupon not found');

    const alreadyUsed = await this.cartModel.findOne({
      user: userId,
      'coupons.couponId': coupon._id
    });
    if (alreadyUsed) throw new BadRequestException('Coupon already used');

    cart.coupons.push({
      name: coupon.name,
      couponId: coupon._id,
      discount: coupon.Discount as number
    });

    cart.totalPriceAfterDiscount = Number(
      (cart.totalPrice * (1 - (coupon.Discount as number) / 100)).toFixed(2)
    );

    await cart.save();
    return { message: 'Coupon applied successfully', cart };
  }

  async removeCoupon(userId: string): Promise<any> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart || cart.coupons.length === 0) {
      throw new NotFoundException('No coupon to remove');
    }

    cart.coupons = [];
    cart.totalPriceAfterDiscount = cart.totalPrice;
    await cart.save();

    return { message: 'Coupon removed successfully', cart };
  }
}