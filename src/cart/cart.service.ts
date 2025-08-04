import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { Product } from 'src/product/product.schema';
import { Coupon } from 'src/coupon/coupon.schema';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel:Model<Cart>,
    @InjectModel(Product.name) private productModel:Model<Product>,
    @InjectModel(Coupon.name) private couponModel:Model<Coupon>,

    @InjectModel(User.name) private userModel:Model<User>
  ){}


async findOrCreateCart(userId: string): Promise<CartDocument> {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequestException('Invalid user ID');
  }

  let cart = await this.cartModel.findOne({ user: userId })
    .populate('cartItems.productId')
    .exec();

  if (cart) {
    return cart;
  }

  // Create new cart with required defaults
  cart = new this.cartModel({
    user: new Types.ObjectId(userId),
    cartItems: [],
    totalPrice: 0,
    totalPriceAfterDiscount: 0,
    coupons: [],
  });

  return await cart.save();
}
async addItem(
  userId: string,
  productId: string,
  quantity: number,
  color: string = ''
) {
  // Validate input
  if (!mongoose.Types.ObjectId.isValid(userId) || 
      !mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestException('Invalid IDs');
  }

  const parsedQuantity = Math.floor(Number(quantity));
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    throw new BadRequestException('Quantity must be a positive integer');
  }

  // Get cart and product in parallel
  const [cart, product] = await Promise.all([
    this.findOrCreateCart(userId),
    this.productModel.findById(productId).exec()
  ]);

  if (!product) throw new NotFoundException('Product not found');
  if (product.quantity < parsedQuantity) {
    throw new ConflictException('Insufficient stock');
  }

  // Find existing item
  const existingItem = cart.cartItems.find(item => 
    item.productId.equals(productId) && 
    item.color === color
  );

  if (existingItem) { 
    // Update existing item
    existingItem.quantity += parsedQuantity;
  } else {
    // Add new item with price snapshot
    cart.cartItems.push({
      productId: new Types.ObjectId(productId),
      quantity: parsedQuantity,
      color,
      priceAtAddition: product.priceAfterdiscount || product.price
    });
  }

  // Recalculate totals
  cart.totalPrice = cart.cartItems.reduce(
    (total, item) => total + (item.quantity * item.priceAtAddition), 
    0
  );

  // Apply coupon discount if exists
  if (cart.coupons.length > 0) {
    const coupon = cart.coupons[0];
    cart.totalPriceAfterDiscount = Number(
      (cart.totalPrice * (1 - coupon.discount / 100)).toFixed(2)
    );
  } else {
    cart.totalPriceAfterDiscount = cart.totalPrice;
  }

  // Save the cart
  const updatedCart = await cart.save();
  
  return {
    status: 200,
    message: existingItem ? 'Item quantity updated' : 'New item added to cart',
    data: updatedCart
  };
}


  async findAll() {
    const cart = await this.cartModel.find().populate("user","category")
    return cart;
  }

  async findOne(id: string) {
    const cart = await this.cartModel.findById(id)

    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const cart = await this.cartModel.findById(id)
    if(!cart){
      throw new NotFoundException("the cart not found")
    }
    const updateCart = await this.cartModel.findByIdAndUpdate(id,updateCartDto)
    return {
      status:200,
      message:"updated succsesfully",
      data:updateCart
    };
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

async applyCoupon(userId: string, code: string): Promise<any> {
  const cart = await this.cartModel.findOne({ user: userId }).populate('coupon');
  if (!cart) throw new NotFoundException('Cart not found');

  const coupon = await this.couponModel.findOne({ code });
  if (!coupon) throw new NotFoundException('Coupon not found');

  const alreadyUsed = await this.cartModel.findOne({ user: userId, 'coupon': coupon._id });
  if (alreadyUsed) throw new BadRequestException('Coupon already used');

  //cart.coupons = coupon._id;
  await cart.save();

  return { message: 'Coupon applied successfully', cart };
}

async removeCoupon(userId: string): Promise<any> {
  const cart = await this.cartModel.findOne({ user: userId });
  //if (!cart || !cart.coupon) throw new NotFoundException('No coupon to remove');

  //cart.coupon = null;
  await cart.save();

  return { message: 'Coupon removed successfully', cart };
}


}
