import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Req, HttpException, UnauthorizedException } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { Roles } from 'src/decorators/Roles.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('request-product')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Post()
    @Roles(["user"])
    @UseGuards(AuthGuard)
create(
  @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createRequestProductDto: CreateRequestProductDto,
  @Req() req,
) {
  if (req.user.role.toLowerCase() === "admin") {
    throw new UnauthorizedException();
  }
  return this.requestProductService.create({...createRequestProductDto,user:req.user._id});
}

  @Get()
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  findAll() {
    return this.requestProductService.findAll();
  }

  @Get(':id')
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.requestProductService.findOne(id,req);
  }

  @Patch(':id')
  @Roles(["user"])
  @UseGuards(AuthGuard)
  update(@Param('id') id: string,@Req() req ,@Body() updateRequestProductDto: UpdateRequestProductDto) {
    if(req.user.role.toLowerCase()==="admin"){
      throw new UnauthorizedException()
    }
    return this.requestProductService.update(id, {...updateRequestProductDto,user:req.user.id},req);
  }

  @Delete(':id')
  @Roles(["user"])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string,@Req() req) {
    return this.requestProductService.remove(id,req);
  }
  
}
