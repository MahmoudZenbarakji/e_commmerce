import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Roles } from 'src/decorators/Roles.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  create(@Body(new ValidationPipe({forbidNonWhitelisted:true})) createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body(new ValidationPipe({forbidNonWhitelisted:true})) updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
