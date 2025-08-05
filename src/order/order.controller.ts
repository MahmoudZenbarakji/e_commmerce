import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UnauthorizedException, NotFoundException, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/decorators/Roles.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('cart/checkout')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(":paymentmthpdType")
  @Roles(["user"])
  @UseGuards(AuthGuard)
  create( @Param("paymentMethodType") paymentMethodType,
   @Body(new ValidationPipe({forbidNonWhitelisted:true}))
   @Req() req,
   createOrderDto: CreateOrderDto) {
    if(req.user.role.toLowerCase()=== "admin"){
      throw new UnauthorizedException()
    }
    if(!["card","cash"].includes(paymentMethodType)){
      throw new NotFoundException("Not Found payment type ")
    }
    const user_id = req.user._id
    return this.orderService.create(user_id,paymentMethodType,createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
