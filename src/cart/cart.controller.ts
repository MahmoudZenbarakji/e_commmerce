import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Roles } from 'src/decorators/Roles.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

@Post()
@Roles(['user'])
@UseGuards(AuthGuard)
addToCart(
  @Body(new ValidationPipe({ forbidNonWhitelisted: true })) createCartDto: CreateCartDto,
  @Req() req,
) {
  if (req.user.role.toLowerCase() === 'admin') {
    throw new UnauthorizedException();
  }

  return this.cartService.addItem(
    req.user._id, // User ID
    createCartDto.productId,
    createCartDto.quantity,
    createCartDto.color || ''
  );
}


  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto,@Req() req) {
      if (req.user.role.toLowerCase() === "admin") {
        throw new UnauthorizedException();
      }
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Req() req) {
      if (req.user.role.toLowerCase() === "admin") {
        throw new UnauthorizedException();
      }
    return this.cartService.remove(+id);
  }
}
