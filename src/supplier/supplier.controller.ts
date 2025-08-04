import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Roles } from 'src/decorators/Roles.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
    @Roles(["admin"])
    @UseGuards(AuthGuard)
  create(@Body(new ValidationPipe({forbidNonWhitelisted:true})) createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()

  findAll() {
    return this.supplierService.findAll();
  }

  @Get(':id')

  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
    @Roles(["admin"])
    @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body(new ValidationPipe({forbidNonWhitelisted:true}))  updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.update(id, updateSupplierDto);
  }
     @Delete(':id')
    @Roles(["admin"])
    @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}
